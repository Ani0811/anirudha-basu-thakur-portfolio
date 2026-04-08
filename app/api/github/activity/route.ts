import { NextRequest, NextResponse } from 'next/server';

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

    const response = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=10`,
      { headers }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch GitHub activity' },
        { status: response.status }
      );
    }

    const events = await response.json();

    // Filter and format the events for the UI
    const formattedEvents = events
      .filter((event: any) => 
        ['PushEvent', 'CreateEvent', 'PullRequestEvent', 'IssuesEvent'].includes(event.type)
      )
      .slice(0, 5)
      .map((event: any) => {
        let title = '';
        let detail = '';

        switch (event.type) {
          case 'PushEvent':
            title = 'Pushed to repository';
            const pushCommits = event.payload.commits || [];
            // Take the last commit message (usually the most recent one in the push)
            detail = pushCommits.length > 0 
              ? pushCommits[pushCommits.length - 1].message 
              : `Pushed ${event.payload.size || ''} commit(s)`;
            break;
          case 'PullRequestEvent':
            title = `${event.payload.action} pull request`;
            detail = event.payload.pull_request?.title || '';
            break;
          case 'CreateEvent':
            title = `Created ${event.payload.ref_type}`;
            detail = event.payload.ref || event.repo.name;
            break;
          case 'IssuesEvent':
            title = `${event.payload.action} issue`;
            detail = event.payload.issue?.title || '';
            break;
          default:
            title = 'GitHub activity';
            detail = event.repo.name;
        }

        return {
          id: event.id,
          type: event.type,
          repo: event.repo.name,
          title,
          detail,
          timestamp: event.created_at,
          url: `https://github.com/${event.repo.name}`,
        };
      });

    return NextResponse.json(formattedEvents);
  } catch (error) {
    console.error('Error fetching GitHub activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub activity' },
      { status: 500 }
    );
  }
}
