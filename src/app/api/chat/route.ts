import { NextRequest, NextResponse } from 'next/server';
import { getChatResponse } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { messages, identity } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages required' }, { status: 400 });
    }

    const response = await getChatResponse(messages, identity);
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to get response. Please try again.' },
      { status: 500 }
    );
  }
}
