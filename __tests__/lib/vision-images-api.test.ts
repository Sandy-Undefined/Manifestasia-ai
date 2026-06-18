import { mapAiVisionRowToVisionImage } from '@/lib/vision-images-api'

describe('mapAiVisionRowToVisionImage', () => {
  it('maps API row to VisionImage', () => {
    const v = mapAiVisionRowToVisionImage({
      id: '550e8400-e29b-41d4-a716-446655440000',
      image_url: 'https://storage.example.com/v.png',
      created_at: '2025-01-15T12:00:00.000Z',
      vision_describe: 'I am thriving',
      output_type: 'image',
      model_quality: 'basic',
      metadata: { belief_level: 4, life_area_label: 'Career' },
    })
    expect(v.id).toBe('550e8400-e29b-41d4-a716-446655440000')
    expect(v.imageUrl).toBe('https://storage.example.com/v.png')
    expect(v.prompt).toBe('I am thriving')
    expect(v.lifeArea).toBe('Career')
    expect(v.beliefLevel).toBe(4)
    expect(v.lifecycle).toBe('active')
  })
})
