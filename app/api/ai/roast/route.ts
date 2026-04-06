import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Code is required and must be a string' },
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
    const model = genAI.getGenerativeModel({ model: 'text-bison-001' });

    const prompt = `You are a brutally honest senior software engineer.
Roast the following code in a humorous way, but also provide useful constructive feedback and suggestions for improvement.
Be entertaining but educational. Point out issues with code quality, naming, architecture, or logic.

Code to roast:
\`\`\`
${code}
\`\`\`

Provide your roast in a natural, conversational tone.`;

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
