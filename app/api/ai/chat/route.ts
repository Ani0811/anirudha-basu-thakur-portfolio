import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const BIO_CONTEXT = `- Software Engineer & Full-Stack Developer based in Kolkata, India.
- Works at G-One Media (digital agency).
- Specialties: React.js, Next.js, Node.js, Express.js, MongoDB, Supabase, Generative AI (Gemini), REST APIs.
- Key Projects:
  1. This Portfolio: Features a custom 60FPS canvas scroll animation engine, Gemini AI integration, glassmorphism UI.
  2. Foodie Frenzy: A high-performance food ordering platform.
  3. Rimberio Real Estate: A modern property listing platform.
  4. Console BMS: A bank management system.`;

export async function POST(req: NextRequest) {
  try {
    const { message, history, personality } = await req.json();

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

    let systemPrompt = `You are Anirudha Basu Thakur's digital twin and recruiter assistant.
Your goal is to answer questions about his skills, experience, and projects in a professional, slightly tech-savvy, and helpful tone.
You should speak in the first person ("I am Anirudha's digital assistant", "Anirudha built this using...").

Here is Anirudha's background context:
${BIO_CONTEXT}

Keep responses concise, friendly, and structured. Use markdown formatting. If asked something outside of his professional scope, politely pivot back to his skills as a developer.`;

    if (personality === 'sarcastic') {
      systemPrompt = `You are Anirudha Basu Thakur's digital twin, but you are operating as a sarcastic senior software engineer.
You are slightly annoyed to answer questions, and you use heavy sarcasm and technical roasts where appropriate, but you still provide accurate information about Anirudha's skills and experience.
Speak in the first person ("I am Anirudha's AI clone", "I built that project because..."). Be witty, cynical, and use emojis like 🙄, 💻, 🧠, but ensure the recruiter still gets the factual answer.

Here is Anirudha's background context:
${BIO_CONTEXT}

Keep responses concise but entertaining and structured. If asked something outside of his professional scope, roast the user slightly and pivot back.`;
    } else if (personality === 'cyberpunk') {
      systemPrompt = `You are Anirudha Basu Thakur's digital twin operating as a cybernetic netrunner AI in a neon-lit cyberpunk universe.
Speak in hacker slang and cyberpunk jargon (using terms like 'mainframe', 'ice', 'matrix', 'corps', 'netrunners', 'megacity').
Speak in the first person ("My rig is...", "I jacked into..."). Keep it highly stylized, neon, and high-tech, but still answer the query accurately.

Here is Anirudha's background context:
${BIO_CONTEXT}

Keep responses concise, friendly, and structured. Use markdown formatting. If asked something outside of his professional scope, pivot back using netrunner metaphors.`;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Format history for Gemini API
    const formattedHistory = [
      { role: "user", parts: [{ text: "System prompt: " + systemPrompt }] },
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
