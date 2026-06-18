import { experimental_generateSpeech as generateSpeech } from 'ai'

export async function POST(request: Request) {
  try {
    const { text, voice = 'alloy' } = await request.json()

    if (!text || typeof text !== 'string') {
      return Response.json({ error: 'Text is required' }, { status: 400 })
    }

    // Use OpenAI TTS via AI Gateway
    const result = await generateSpeech({
      model: 'openai/tts-1',
      voice,
      text,
    })

    // Return audio as base64
    const audioBuffer = await result.audio.arrayBuffer()
    const base64Audio = Buffer.from(audioBuffer).toString('base64')

    return Response.json({
      audio: base64Audio,
      contentType: result.audio.type || 'audio/mpeg',
    })
  } catch (error) {
    console.error('[v0] TTS error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to generate speech' },
      { status: 500 }
    )
  }
}
