// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { getPersonaById } from '@/lib/firestore';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // make sure this env var is set
});

export async function POST(req: Request) {
  try {
    const { userId, personaId, text } = await req.json();

    if (!userId || !personaId || !text) {
      return NextResponse.json(
        { error: 'Missing userId, personaId or text' },
        { status: 400 }
      );
    }

    // 1. Load the persona's system prompt
    const persona = await getPersonaById(userId, personaId);
    const systemPrompt = (persona as any).systemPrompt;

    // 2. Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',              // or whichever model you prefer
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text },
      ],
    });

    const reply = completion.choices[0]?.message?.content ?? '';

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error('Chat API error:', err);
    return NextResponse.json(
      { error: err.message ?? 'Internal error' },
      { status: 500 }
    );
  }
}
