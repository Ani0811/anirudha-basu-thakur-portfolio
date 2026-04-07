import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { repoUrl, projectName } = await req.json();

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
      const contentsResponse = await fetch(
        `https://api.github.com/repos/${repoUrl}/contents`,
        { headers }
      );

      if (contentsResponse.ok) {
        const contents = await contentsResponse.json();
        
        // Try to get README
        const readmeFile = contents.find((file: any) => 
          file.name.toLowerCase().startsWith('readme')
        );
        
        if (readmeFile?.download_url) {
          const readmeResponse = await fetch(readmeFile.download_url);
          if (readmeResponse.ok) {
            const readmeText = await readmeResponse.text();
            codeSnippet += `README:\n${readmeText.slice(0, 2000)}\n\n`;
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
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching from GitHub:', error);
    }

    if (!codeSnippet) {
      return NextResponse.json(
        { error: 'Could not fetch code from repository' },
        { status: 404 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    const prompt = `You are a brutally honest senior software engineer reviewing the "${projectName}" project.
Based on the code and README provided below, give a SHORT (2-3 sentences) roast that is funny but constructive.
Focus on architecture, code quality, or tech stack choices. Keep it entertaining but educational.

Repository content:
${codeSnippet}

Provide ONLY the roast text, no additional formatting or labels.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const roast = response.text();

    return NextResponse.json({ roast });
  } catch (error) {
    console.error('Error generating roast:', error);
    return NextResponse.json(
      { error: 'Failed to generate roast' },
      { status: 500 }
    );
  }
}
