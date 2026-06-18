import { experimental_generateImage as generateImage } from 'ai'

export async function POST(req: Request) {
  try {
    const { prompt, n = 1 } = await req.json()

    if (!prompt || typeof prompt !== 'string') {
      return Response.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Build enhanced prompt for vision/manifestation images
    const enhancedPrompt = `${prompt}. Photorealistic, cinematic lighting, warm color grading, 8k ultra HD quality, professional photography.`

    const result = await generateImage({
      model: 'google/imagen-4.0-generate-001',
      prompt: enhancedPrompt,
      n: Math.min(n, 4), // Max 4 variants
    })

    // Return base64 images
    const images = result.images.map((img) => {
      if (typeof img === 'string') {
        return img
      }
      // If it's a Uint8Array, convert to base64 data URL
      const base64 = Buffer.from(img.uint8Array).toString('base64')
      return `data:${img.mimeType || 'image/png'};base64,${base64}`
    })

    return Response.json({ images })
  } catch (error) {
    console.error('[v0] Image generation error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to generate image' },
      { status: 500 }
    )
  }
}
