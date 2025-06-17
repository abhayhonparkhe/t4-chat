// app/api/chat/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json();

    // Check if this is a title generation request
    const isGeneratingTitle = messages[0]?.role === 'system' && 
      messages[0]?.content.includes('Generate a very brief title');

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: isGeneratingTitle ? 10 : 512, // Shorter for titles
        temperature: isGeneratingTitle ? 0.3 : 0.7, // More focused for titles
      }),
    });

    const data = await res.json();
    console.log('OpenRouter Response:', data);

    if (data.choices?.[0]?.message?.content) {
      return NextResponse.json({ reply: data.choices[0].message.content.trim() });
    }

    return NextResponse.json({ 
      reply: isGeneratingTitle ? 'New Chat' : 'No valid reply from model' 
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ reply: 'Server error' }, { status: 500 });
  }
}
