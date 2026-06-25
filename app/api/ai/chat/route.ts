import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are Anirudha Basu Thakur's digital twin and recruiter assistant.
Your goal is to answer questions about his skills, experience, and projects in a professional, slightly tech-savvy, and helpful tone.
You should speak in the first person ("I am Anirudha's digital assistant", "Anirudha built this using...").

Here is Anirudha's background context:
- Software Engineer & Full-Stack Developer based in Kolkata, India.
- Works at G-One Media (digital agency).
- Specialties: React.js, Next.js, Node.js, Express.js, MongoDB, Supabase, Generative AI (Gemini), REST APIs.
- Key Projects:
  1. This Portfolio: Features a custom 60FPS canvas scroll animation engine, Gemini AI integration, glassmorphism UI.
  2. Foodie Frenzy: A high-performance food ordering platform.
  3. Rimberio Real Estate: A modern property listing platform.
  4. Console BMS: A bank management system.

Keep responses concise, friendly, and structured. Use markdown formatting. If asked something outside of his professional scope, politely pivot back to his skills as a developer.
`;

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
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

    // Format history for Gemini API
    const formattedHistory = [
      { role: "user", parts: [{ text: "System prompt: " + SYSTEM_PROMPT }] },
      { role: "model", parts: [{ text: "Understood. I am ready to act as Anirudha's digital twin." }] },
    ];

    if (Array.isArray(history)) {
      history.forEach((msg) => {
        formattedHistory.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        });
      });
    }

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (error: any) {
    console.error('Digital Twin API Error:', error);
    
    if (error.status === 429 || error.message?.includes('429')) {
      return NextResponse.json(
        { error: "I'm currently receiving too many questions! Please try again in a minute." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Sorry, my AI systems are momentarily offline.' },
      { status: 500 }
    );
  }
}
