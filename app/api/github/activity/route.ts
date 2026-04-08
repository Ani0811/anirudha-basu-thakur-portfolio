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
      `https://api.github.com/users/${username}/events/public?per_page=15`,
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
    const filteredEvents = events.filter((event: any) => 
      ['PushEvent', 'CreateEvent', 'PullRequestEvent', 'IssuesEvent'].includes(event.type)
    ).slice(0, 10);

    // Resolve detailed information for PushEvents concurrently
    const formattedEvents = await Promise.all(filteredEvents.map(async (event: any) => {
      let title = '';
      let detail = '';

      switch (event.type) {
        case 'PushEvent':
          title = 'Pushed to repository';
          const pushCommits = event.payload.commits || [];
          
          if (pushCommits.length > 0) {
            // Take the last commit message from the payload if present
            detail = pushCommits[pushCommits.length - 1].message;
          } else if (event.payload.head) {
            // Secondary lookup: Fetch the specific commit details using the head SHA
            try {
              const commitResponse = await fetch(
                `https://api.github.com/repos/${event.repo.name}/commits/${event.payload.head}`,
                { headers }
              );
              if (commitResponse.ok) {
                const commitData = await commitResponse.json();
                detail = commitData.commit?.message || 'Pushed code updates';
              } else {
                detail = 'Pushed code updates';
              }
            } catch (err) {
              console.error('Secondary commit fetch failed:', err);
              detail = 'Pushed code updates';
            }
          } else {
            detail = `Pushed ${event.payload.size || ''} commit(s)`;
          }
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
    }));

    return NextResponse.json(formattedEvents);
  } catch (error) {
    console.error('Error fetching GitHub activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub activity' },
      { status: 500 }
    );
  }
}
