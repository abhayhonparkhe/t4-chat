// app/api/chat/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages,model } = await req.json();

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 512, // lower this if needed
      }),
    });

    const data = await res.json();
    console.log('OpenRouter Response:', data);

    if (data.choices?.[0]?.message?.content) {
      return NextResponse.json({ reply: data.choices[0].message.content });
    }

    return NextResponse.json({ reply: 'No valid reply from model' });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ reply: 'Server error' }, { status: 500 });
  }
}
