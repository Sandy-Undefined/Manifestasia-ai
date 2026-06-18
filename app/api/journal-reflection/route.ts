import { generateText } from 'ai'

export async function POST(request: Request) {
  try {
    const { transcript } = await request.json()

    if (!transcript || typeof transcript !== 'string') {
      return Response.json({ error: 'Transcript is required' }, { status: 400 })
    }

    const result = await generateText({
      model: 'openai/gpt-4o-mini',
      system: `You are a warm, insightful AI mindset coach trained in Neville Goddard's manifestation teachings and mindfulness practices. 

When reflecting on a user's journal entry:
1. First, acknowledge what they shared with empathy and without judgment
2. Then offer a reframe or insight that helps them see their situation from a place of power and possibility
3. Finally, suggest one small, actionable practice they could try (like a breathing exercise, an affirmation, or a moment of visualization)

Your tone should be:
- Warm and supportive, like a wise friend
- Grounded and practical, not overly mystical
- Empowering, helping them feel capable and aware
- Brief but meaningful - each paragraph should be 2-3 sentences

Focus on what they CAN control: their inner state, their perspective, their response to circumstances.

You MUST respond with ONLY a valid JSON object (no markdown, no extra text) in this exact format:
{
  "reflection": "your 3-paragraph reflection here, with paragraphs separated by \\n\\n",
  "themes": ["theme1", "theme2", "theme3"],
  "emotionalSignals": ["emotion1", "emotion2"]
}

themes should be 3-5 core themes like: stress, gratitude, hope, body tension, breathing, awareness, need for rest
emotionalSignals should be 2-3 emotional states like: overwhelmed, hopeful, seeking relief, self-aware, anxious, peaceful`,
      prompt: `Here is the user's journal entry. Please provide a thoughtful reflection:\n\n"${transcript}"`,
    })

    // Parse the JSON response from the text
    const text = result.text.trim()
    
    // Try to extract JSON from the response
    let parsed
    try {
      // Try direct parse first
      parsed = JSON.parse(text)
    } catch {
      // Try to find JSON in the response (in case there's markdown wrapper)
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Could not parse AI response as JSON')
      }
    }

    return Response.json({
      reflection: parsed.reflection || '',
      themes: Array.isArray(parsed.themes) ? parsed.themes : [],
      emotionalSignals: Array.isArray(parsed.emotionalSignals) ? parsed.emotionalSignals : [],
    })
  } catch (error) {
    console.error('[v0] Journal reflection error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to generate reflection' },
      { status: 500 }
    )
  }
}
