import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { projectName, techStack } = await req.json();

    if (!projectName || typeof projectName !== 'string') {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }

    if (!techStack || typeof techStack !== 'string') {
      return NextResponse.json(
        { error: 'Tech stack is required' },
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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    const prompt = `Generate a concise professional message requesting access to the source code for the project: "${projectName}".
The project uses the following technologies: ${techStack}.
The sender is a developer interested in studying the architecture and implementation details.

Keep the message polite, professional, and between 2-4 sentences.
Do not include subject lines, greetings, or signatures - just the body of the message.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const message = response.text();

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error generating message:', error);
    return NextResponse.json(
      { error: 'Failed to generate message' },
      { status: 500 }
    );
  }
}
