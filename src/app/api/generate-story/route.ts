import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a storyteller who writes short, realistic scenarios about everyday situations. Keep your language simple and concrete. Focus on specific details and actions rather than emotions or abstract concepts. Write from the person's perspective in first person, making it feel like a real experience someone might have."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.3,
    });

    const story = completion.choices[0]?.message?.content;

    if (!story) {
      return NextResponse.json(
        { error: 'Failed to generate story' },
        { status: 500 }
      );
    }

    return NextResponse.json({ story });

  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate story' },
      { status: 500 }
    );
  }
}