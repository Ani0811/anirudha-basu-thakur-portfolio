import { NextRequest, NextResponse } from 'next/server';

interface GitHubRepo {
  name: string;
  owner: { login: string };
  language: string | null;
}

interface GitHubUser {
  public_repos: number;
  created_at: string;
}

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();

    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const githubToken = process.env.GITHUB_TOKEN;
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };

    if (githubToken) {
      headers['Authorization'] = `token ${githubToken}`;
    }

    // Fetch user data
    const userResponse = await fetch(`https://api.github.com/users/${username}`, {
      headers,
    });

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: 'GitHub user not found' },
        { status: 404 }
      );
    }

    const userData: GitHubUser = await userResponse.json();

    // Fetch repositories
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      { headers }
    );

    if (!reposResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch repositories' },
        { status: 500 }
      );
    }

    const repos: GitHubRepo[] = await reposResponse.json();

    // Calculate total commits across repositories
    let totalCommits = 0;
    const commitPromises = repos.slice(0, 20).map(async (repo) => {
      try {
        const commitsResponse = await fetch(
          `https://api.github.com/repos/${repo.owner.login}/${repo.name}/commits?author=${username}&per_page=1`,
          { headers }
        );
        
        if (commitsResponse.ok) {
          const linkHeader = commitsResponse.headers.get('Link');
          if (linkHeader) {
            const match = linkHeader.match(/page=(\d+)>; rel="last"/);
            if (match) {
              return parseInt(match[1], 10);
            }
          }
          const commits = await commitsResponse.json();
          return commits.length;
        }
        return 0;
      } catch {
        return 0;
      }
    });

    const commitCounts = await Promise.all(commitPromises);
    totalCommits = commitCounts.reduce((sum, count) => sum + count, 0);

    // Fetch contributions using GraphQL API
    let totalContributions = 0;
    if (githubToken) {
      try {
        const currentYear = new Date().getFullYear();
        const graphqlQuery = {
          query: `
            query {
              user(login: "${username}") {
                contributionsCollection(from: "${currentYear}-01-01T00:00:00Z") {
                  contributionCalendar {
                    totalContributions
                  }
                }
              }
            }
          `
        };

        const graphqlResponse = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            'Authorization': `bearer ${githubToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(graphqlQuery),
        });

        if (graphqlResponse.ok) {
          const graphqlData = await graphqlResponse.json();
          totalContributions = graphqlData?.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions || 0;
        }
      } catch (error) {
        console.error('Error fetching contributions:', error);
      }
    }

    const languageCounts: Record<string, number> = {};
    repos.forEach((repo) => {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
    });

    const topLanguages = Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map((entry) => entry[0]);

    return NextResponse.json({
      username,
      publicRepos: userData.public_repos,
      totalCommits,
      totalContributions,
      topLanguages,
      createdAt: userData.created_at,
    });
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub statistics' },
      { status: 500 }
    );
  }
}
