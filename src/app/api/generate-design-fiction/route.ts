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
          content: "You are a creative design fiction writer who specializes in exploring the social implications of technology. You write engaging, thought-provoking stories that help readers think critically about how design choices impact individuals, communities, and society. Write in first person from the user's perspective, using simple, accessible language that feels authentic and relatable."
        },
        {
          role: "user",
          content: `${prompt}

Format your response as a JSON object with two keys:
- "utopia": The positive scenario story (4 paragraphs)
- "dystopia": The negative scenario story (4 paragraphs)

Each story should be exactly 4 paragraphs, written in first person from the persona's perspective. Use natural paragraph breaks between each paragraph.`
        }
      ],
      max_tokens: 1200,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      return NextResponse.json(
        { error: 'Failed to generate design fiction' },
        { status: 500 }
      );
    }

    // Clean up the response text
    const cleanText = (text: string) => {
      return text
        .replace(/^["'`]*/, '') // Remove leading quotes
        .replace(/["'`]*$/, '') // Remove trailing quotes
        .replace(/^[^:]*:\s*/, '') // Remove "utopia:" or "dystopia:" prefixes
        .replace(/```[^`]*```/g, '') // Remove code blocks
        .replace(/\}\s*$/, '') // Remove trailing }
        .replace(/\\n\\n/g, '\n\n') // Fix escaped newlines
        .replace(/\\n/g, '\n') // Fix single escaped newlines
        .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double
        .replace(/^"/, '') // Remove leading quote at start
        .replace(/"$/, '') // Remove trailing quote at end
        .trim();
    };

    try {
      const stories = JSON.parse(response);
      
      if (!stories.utopia || !stories.dystopia) {
        throw new Error('Invalid response format');
      }

      return NextResponse.json({
        utopia: cleanText(stories.utopia),
        dystopia: cleanText(stories.dystopia)
      });
    } catch {
      console.log('JSON parsing failed, attempting manual parsing');
      
      // Look for clear separators or patterns
      const parts = response.split(/(?:UTOPIA|Utopia|DYSTOPIA|Dystopia)/i);
      
      if (parts.length >= 3) {
        return NextResponse.json({
          utopia: cleanText(parts[1] || "Unable to generate utopian scenario"),
          dystopia: cleanText(parts[2] || "Unable to generate dystopian scenario")
        });
      }
      
      // Fallback: split roughly in half
      const midpoint = Math.floor(response.length / 2);
      return NextResponse.json({
        utopia: cleanText(response.substring(0, midpoint)),
        dystopia: cleanText(response.substring(midpoint))
      });
    }

  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate design fiction' },
      { status: 500 }
    );
  }
}