import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Parse request body robustly. Prefer `req.json()` but fall back to
    // reading raw text and attempting simple sanitization for PowerShell-
    // mangled payloads (single quotes, extra wrappers).
    let repoUrl: string | undefined;
    let projectName: string | undefined;

    try {
      const body = await req.json();
      repoUrl = body?.repoUrl;
      projectName = body?.projectName;
    } catch (jsonErr) {
      const raw = await req.text();
      console.warn('Failed to parse JSON with req.json(), raw body:', raw);

      // Heuristic sanitization: strip surrounding single quotes and convert
      // single quotes to double quotes when keys/values use single quotes.
      let sanitized = raw;
      // Remove wrapping single quotes added by some shells: '\'{...}\'' -> '{...}'
      sanitized = sanitized.replace(/^'+|'+$/g, '');
      // If it still looks like JS object with single quotes, convert them.
      if (sanitized.includes("'repoUrl") || sanitized.includes("':")) {
        sanitized = sanitized.replace(/'/g, '"');
      }

      try {
        const body2 = JSON.parse(sanitized);
        repoUrl = body2?.repoUrl;
        projectName = body2?.projectName;
      } catch (parseErr) {
        // Last-resort: simple regex extraction for common patterns
        const repoMatch = raw.match(/repoUrl\s*[:=]\s*["']?([^"',}\s]+)/i);
        const nameMatch = raw.match(/projectName\s*[:=]\s*["']?([^"',}\s]+)/i);
        if (repoMatch) repoUrl = repoMatch[1];
        if (nameMatch) projectName = nameMatch[1];

        if (!repoUrl) {
          console.error('Unable to parse request body for repoUrl. Raw body:', raw);
          return NextResponse.json(
            { error: 'Invalid JSON in request body', rawBody: raw },
            { status: 400 }
          );
        }
      }
    }

    if (!repoUrl || typeof repoUrl !== 'string') {
      return NextResponse.json(
        { error: 'Repository URL is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Fetch README and main files from GitHub
    const githubToken = process.env.GITHUB_TOKEN;
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };
    if (githubToken) {
      headers['Authorization'] = `token ${githubToken}`;
    }

    let codeSnippet = '';
    
    try {
      // Fetch repository contents
      console.log('Fetching GitHub contents for:', repoUrl);
      const contentsResponse = await fetch(
        `https://api.github.com/repos/${repoUrl}/contents`,
        { headers }
      );

      if (!contentsResponse.ok) {
        // Capture response body for debugging when GitHub returns an error
        let respText = '';
        try {
          respText = await contentsResponse.text();
        } catch (e) {
          respText = '<failed to read response body>';
        }
        console.error('GitHub contents fetch failed', {
          repo: repoUrl,
          status: contentsResponse.status,
          statusText: contentsResponse.statusText,
          body: respText,
        });

        // Return debug info to caller for easier local debugging (temporary)
        return NextResponse.json(
          {
            error: 'GitHub contents fetch failed',
            repo: repoUrl,
            status: contentsResponse.status,
            statusText: contentsResponse.statusText,
            body: respText,
          },
          { status: 502 }
        );
      } else {
        const contents = await contentsResponse.json();
        console.log('GitHub contents fetched, items:', Array.isArray(contents) ? contents.length : typeof contents);

        // Try to get README
        const readmeFile = contents.find((file: any) => 
          file.name.toLowerCase().startsWith('readme')
        );

        if (readmeFile?.download_url) {
          const readmeResponse = await fetch(readmeFile.download_url);
          if (readmeResponse.ok) {
            const readmeText = await readmeResponse.text();
            codeSnippet += `README:\n${readmeText.slice(0, 2000)}\n\n`;
          } else {
            console.warn('Failed to download README:', readmeFile.download_url, readmeResponse.status);
          }
        }

        // Get main code files (limit to 3-5 files)
        const codeFiles = contents.filter((file: any) => 
          file.type === 'file' && 
          (file.name.endsWith('.js') || 
           file.name.endsWith('.ts') || 
           file.name.endsWith('.jsx') ||
           file.name.endsWith('.tsx') ||
           file.name.endsWith('.py') ||
           file.name.endsWith('.php'))
        ).slice(0, 3);

        for (const file of codeFiles) {
          if (file.download_url) {
            const fileResponse = await fetch(file.download_url);
            if (fileResponse.ok) {
              const fileText = await fileResponse.text();
              codeSnippet += `File: ${file.name}\n\`\`\`\n${fileText.slice(0, 1500)}\n\`\`\`\n\n`;
            } else {
              console.warn('Failed to download file:', file.download_url, fileResponse.status);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching from GitHub:', error);
    }

    // If we didn't collect any snippet from the top-level contents,
    // traverse the repository using the GitHub Contents API (recursive by
    // visiting directories) so we read files "normally" instead of using
    // the git/trees endpoint.
    if (!codeSnippet) {
      try {
        console.log('Falling back to recursive contents traversal for:', repoUrl);

        // Start from the root. We'll perform a BFS over directories found
        // via the contents API, stopping when we've gathered enough files.
        const exts = ['.js', '.ts', '.jsx', '.tsx', '.py', '.php'];
        const maxFiles = 5;
        const maxReadmeChars = 2000;

        const rootResp = await fetch(`https://api.github.com/repos/${repoUrl}/contents`, { headers });
        if (!rootResp.ok) {
          console.warn('Root contents fetch failed for traversal', rootResp.status);
        } else {
          const rootListing = await rootResp.json();
          const queue: string[] = [];

          // Enqueue any top-level directories to explore.
          for (const item of rootListing) {
            if (item.type === 'dir') queue.push(item.path);
            // Also consider top-level files for README or code
            if (item.type === 'file') {
              const name = (item.name || '').toLowerCase();
              if (name.startsWith('readme')) {
                try {
                  if (item.download_url) {
                    const r = await fetch(item.download_url, { headers });
                    if (r.ok) {
                      const txt = await r.text();
                      codeSnippet += `README (${item.path}):\n${txt.slice(0, maxReadmeChars)}\n\n`;
                    }
                  } else if (item.url) {
                    const blobResp = await fetch(item.url, { headers });
                    if (blobResp.ok) {
                      const blobJson = await blobResp.json();
                      const txt = Buffer.from(blobJson.content || '', 'base64').toString('utf8');
                      codeSnippet += `README (${item.path}):\n${txt.slice(0, maxReadmeChars)}\n\n`;
                    }
                  }
                } catch (err) {
                  console.warn('Failed fetching top-level README', item.path, err);
                }
              }
            }
          }

          const foundFiles: any[] = [];

          while (queue.length && foundFiles.length < maxFiles) {
            const dir = queue.shift()!;
            try {
              const dirResp = await fetch(`https://api.github.com/repos/${repoUrl}/contents/${dir}`, { headers });
              if (!dirResp.ok) {
                console.warn('Contents fetch failed for', dir, dirResp.status);
                continue;
              }
              const listing = await dirResp.json();
              for (const item of listing) {
                if (item.type === 'dir') {
                  queue.push(item.path);
                } else if (item.type === 'file') {
                  const lname = (item.name || '').toLowerCase();
                  if (lname.startsWith('readme')) {
                    try {
                      if (item.download_url) {
                        const r = await fetch(item.download_url, { headers });
                        if (r.ok) {
                          const txt = await r.text();
                          codeSnippet += `README (${item.path}):\n${txt.slice(0, maxReadmeChars)}\n\n`;
                        }
                      } else if (item.url) {
                        const blobResp = await fetch(item.url, { headers });
                        if (blobResp.ok) {
                          const blobJson = await blobResp.json();
                          const txt = Buffer.from(blobJson.content || '', 'base64').toString('utf8');
                          codeSnippet += `README (${item.path}):\n${txt.slice(0, maxReadmeChars)}\n\n`;
                        }
                      }
                    } catch (err) {
                      console.warn('Failed fetching README', item.path, err);
                    }
                  }

                  if (exts.some(ext => lname.endsWith(ext))) {
                    foundFiles.push(item);
                    // fetch file content
                    try {
                      if (item.download_url) {
                        const fr = await fetch(item.download_url, { headers });
                        if (fr.ok) {
                          const ft = await fr.text();
                          codeSnippet += `File: ${item.path}\n\`\`\`\n${ft.slice(0, 1500)}\n\`\`\`\n\n`;
                        } else {
                          console.warn('Failed to download file via download_url', item.path, fr.status);
                        }
                      } else if (item.url) {
                        const blobResp = await fetch(item.url, { headers });
                        if (blobResp.ok) {
                          const blobJson = await blobResp.json();
                          const ft = Buffer.from(blobJson.content || '', 'base64').toString('utf8');
                          codeSnippet += `File: ${item.path}\n\`\`\`\n${ft.slice(0, 1500)}\n\`\`\`\n\n`;
                        } else {
                          console.warn('Failed to fetch blob for file', item.path, blobResp.status);
                        }
                      }
                    } catch (err) {
                      console.warn('Error fetching file content', item.path, err);
                    }
                  }

                  if (foundFiles.length >= maxFiles) break;
                }
              }
            } catch (err) {
              console.warn('Error traversing dir', dir, err);
            }
          }

          console.log('Traversal found files:', foundFiles.length);
        }
      } catch (err) {
        console.error('Error during recursive contents traversal:', err);
      }
    }

    if (!codeSnippet) {
      return NextResponse.json(
        { error: 'Could not fetch code from repository' },
        { status: 404 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    const prompt = `You are a brutally honest senior software engineer reviewing the "${projectName}" project.
Based on the code and README provided below, give a SHORT (2-3 sentences) roast that is funny but constructive.
Focus on architecture, code quality, or tech stack choices. Keep it entertaining but educational.

Repository content:
${codeSnippet}

Provide ONLY the roast text, no additional formatting or labels.`;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const roast = response.text();
      return NextResponse.json({ roast });
    } catch (apiErr: any) {
      console.error('Gemini API Error:', apiErr);
      if (apiErr.status === 503 || apiErr.message?.includes('503')) {
        return NextResponse.json(
          { 
            error: 'The roasting AI is currently overwhelmed by the sheer brilliance of your code (or just high traffic). Please try again in a moment!',
            isRetryable: true 
          },
          { status: 503 }
        );
      }
      if (apiErr.status === 429 || apiErr.message?.includes('429') || apiErr.message?.toLowerCase().includes('quota')) {
        return NextResponse.json(
          { 
            error: "We've reached the free-tier roast limit! The AI advisor is on a mandatory coffee break. Please check back later.",
            isRetryable: false 
          },
          { status: 429 }
        );
      }
      throw apiErr; // Re-throw to be caught by outer catch
    }
  } catch (error) {
    console.error('Error generating roast:', error);
    return NextResponse.json(
      { error: 'The AI advisor is temporarily offline. It might be debugging itself or just taking a breather. Please try again in a few minutes.' },
      { status: 500 }
    );
  }
}
