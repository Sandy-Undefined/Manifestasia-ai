import { generateText } from 'ai'

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt || typeof prompt !== 'string') {
      return Response.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const result = await generateText({
      model: 'openai/gpt-4o-mini',
      system: `You are an expert at enhancing AI image generation prompts. Given a manifestation visualization scene, you:
1. Suggest 5-8 short photography/cinematography enhancement terms (boosters) that would make the image more realistic and emotionally impactful. Keep each booster to 2-4 words max.
2. Create an improved version of the prompt with more vivid sensory details
3. Identify the core mood/emotion in 2-3 words

Focus on realistic, cinematic enhancements like lighting, composition, color grading, lens effects. Avoid generic terms.

You MUST respond with ONLY a valid JSON object (no markdown, no extra text) in this exact format:
{
  "boosters": ["term1", "term2", "term3", "term4", "term5"],
  "improvedPrompt": "enhanced prompt text with vivid details",
  "mood": "mood in 2-3 words"
}`,
      prompt: `Analyze this manifestation visualization prompt and suggest enhancements:\n\n"${prompt}"`,
    })

    // Parse the JSON response from the text
    const text = result.text.trim()
    
    // Try to extract JSON from the response
    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Could not parse AI response as JSON')
      }
    }

    return Response.json({
      boosters: Array.isArray(parsed.boosters) ? parsed.boosters : [],
      improvedPrompt: parsed.improvedPrompt || '',
      mood: parsed.mood || '',
    })
  } catch (error) {
    console.error('[v0] Analyze prompt error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze prompt' },
      { status: 500 }
    )
  }
}
