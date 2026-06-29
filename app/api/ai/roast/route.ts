import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { code, personality } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Code is required' },
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
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    let personalityPrompt = "";
    if (personality === 'gordon_ramsay') {
      personalityPrompt = "You are Gordon Ramsay of Code. Be extremely passionate, loud, use food metaphors, and yell in caps. Describe how raw, tasteless, and disgusting their code is, but still point out the actual structural issues.";
    } else if (personality === 'sarcastic') {
      personalityPrompt = "You are a passive-aggressive senior developer who is tired of junior devs. Use heavy sarcasm, e.g. 'Oh, wow, another nested loop, truly ground-breaking work.' Explain what's wrong with the code using witty condescension.";
    } else if (personality === 'cyberpunk') {
      personalityPrompt = "You are a cybernetic hacker AI from the year 2077. Use hacker slang, references to megacorporations, cybernetic enhancements, and matrix analogies. Point out how their code would get easily cracked by a netrunner.";
    } else { // default/toxic
      personalityPrompt = "You are a brutally honest, hyper-critical senior software engineer. Highlight code smell, inefficient algorithms, bad naming conventions, or design pattern abuse in a funny but highly educational way.";
    }

    const prompt = `${personalityPrompt}
Here is the code to roast:
\`\`\`
${code}
\`\`\`

Give a short (3-4 sentences max) roast that is funny, savage, but constructively points out a real flaw. Format with emojis where appropriate. Do not include markdown code block containers in your outer response. Just output the raw roast text.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const roast = response.text().trim();

    return NextResponse.json({ roast });
  } catch (error: any) {
    console.error('Roast API Error:', error);
    
    if (error.status === 429 || error.message?.includes('429')) {
      return NextResponse.json(
        { error: "I'm currently too exhausted from roasting bad code. Please try again in a minute." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Sorry, the roaster engine is temporarily offline.' },
      { status: 500 }
    );
  }
}
