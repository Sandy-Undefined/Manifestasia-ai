"use client"

import { useState, useEffect, useCallback } from 'react'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { X, Sparkles, ThumbsUp, ThumbsDown, ImagePlus, Wand2, Save } from 'lucide-react'

// Maps journal themes to visual scene descriptions for AI image generation
const themeToVisualMap: Record<string, string[]> = {
  stress: [
    'A peaceful forest clearing bathed in golden morning light, a person meditating calmly',
    'A tranquil lake at sunset reflecting warm colors, complete stillness and serenity',
  ],
  awareness: [
    'A person standing on a mountain summit at sunrise, arms open, feeling connected to everything',
    'A beautiful garden full of blooming flowers, soft sunlight filtering through leaves',
  ],
  'need for rest': [
    'A cozy reading nook with warm blankets, soft lamplight, rain outside the window',
    'A hammock between palm trees on a quiet beach at golden hour, gentle waves',
  ],
  'body tension': [
    'A person doing yoga on a misty mountain overlook, completely at ease and flexible',
    'A natural hot spring surrounded by lush greenery, steam rising in soft morning light',
  ],
  breathing: [
    'An open meadow with wildflowers gently swaying in a warm breeze, expansive blue sky',
    'A person standing at the edge of the ocean, wind in their hair, breathing deeply',
  ],
  gratitude: [
    'A golden sunrise over rolling hills, every detail glowing with warmth and abundance',
    'A festive table surrounded by loved ones, laughter and warm candlelight',
  ],
  hope: [
    'A bright path leading through a field of sunflowers toward a radiant horizon',
    'A rainbow arching over a peaceful valley after a refreshing rain',
  ],
}

export function JournalReflectionScreen() {
  const { setScreen, currentJournalEntry, user, updateUser, setCurrentJournalEntry, addVisionImage } = useApp()
  const [isLoading, setIsLoading] = useState(true)
  const [reflection, setReflection] = useState('')
  const [themes, setThemes] = useState<string[]>([])
  const [emotionalSignals, setEmotionalSignals] = useState<string[]>([])

  // AI generated image state
  const [imageStep, setImageStep] = useState<'idle' | 'generating' | 'done'>('idle')
  const [generatedImagePrompt, setGeneratedImagePrompt] = useState('')
  const [generatedImageGradient, setGeneratedImageGradient] = useState('')
  const [imageSaved, setImageSaved] = useState(false)

  const generateReflection = useCallback(async () => {
    const transcript = currentJournalEntry?.transcript
    
    if (!transcript || transcript.length < 10) {
      // Fallback for empty/short transcripts
      setReflection("It looks like you're taking a moment to pause and reflect. That's a beautiful practice in itself. Even without many words, the act of showing up matters.")
      setThemes(['mindfulness', 'presence'])
      setEmotionalSignals(['reflective'])
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/journal-reflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate reflection')
      }

      const data = await response.json()
      
      if (data.reflection) {
        setReflection(data.reflection)
      }
      if (data.themes && Array.isArray(data.themes)) {
        setThemes(data.themes)
      }
      if (data.emotionalSignals && Array.isArray(data.emotionalSignals)) {
        setEmotionalSignals(data.emotionalSignals)
      }
    } catch (error) {
      console.error('[v0] Reflection generation error:', error)
      // Fallback reflection if API fails
      setReflection("Thank you for sharing what's on your mind. Taking time to journal is a powerful practice of self-awareness. Whatever you're experiencing right now, know that acknowledging it is the first step toward transformation.")
      setThemes(['self-awareness', 'growth'])
      setEmotionalSignals(['reflective', 'open'])
    } finally {
      setIsLoading(false)
    }
  }, [currentJournalEntry?.transcript])

  useEffect(() => {
    generateReflection()
  }, [generateReflection])

  const handleGenerateImage = useCallback(async () => {
    setImageStep('generating')

    // Build a custom prompt based on the AI-detected themes and emotional signals
    const themesList = themes.length > 0 ? themes.join(', ') : 'peace, clarity'
    const emotionsList = emotionalSignals.length > 0 ? emotionalSignals.join(', ') : 'calm, hopeful'
    
    // Create a personalized visualization prompt based on the journal analysis
    const customPrompt = `A serene, cinematic visualization scene representing ${themesList}. The mood is ${emotionsList}. A person experiencing deep peace and transformation, photorealistic, golden hour lighting, 8k quality, emotionally uplifting`
    
    setGeneratedImagePrompt(customPrompt)

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: customPrompt, n: 1 }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate image')
      }

      const data = await response.json()
      if (data.images && data.images.length > 0) {
        setGeneratedImageGradient(data.images[0])
      }
      setImageStep('done')
    } catch (error) {
      console.error('[v0] Image generation error:', error)
      // Fallback to a gradient if image generation fails
      const gradients = [
        'linear-gradient(135deg, oklch(0.85 0.08 70) 0%, oklch(0.65 0.10 40) 40%, oklch(0.50 0.12 25) 100%)',
        'linear-gradient(135deg, oklch(0.80 0.06 150) 0%, oklch(0.60 0.10 180) 40%, oklch(0.45 0.08 200) 100%)',
      ]
      setGeneratedImageGradient(gradients[Math.floor(Math.random() * gradients.length)])
      setImageStep('done')
    }
  }, [themes, emotionalSignals])

  const handleSaveImage = useCallback(() => {
    addVisionImage({
      id: `journal-${Date.now()}`,
      prompt: generatedImagePrompt,
      imageUrl: generatedImageGradient,
      createdAt: new Date(),
      lifeArea: themes[0] || 'journal-reflection',
      mediaType: 'image',
      modelTier: 'basic',
      isFulfilled: false,
      lifecycle: 'active',
      beliefLevel: 3,
      vividnessLevel: 3,
      variants: [],
      usesUserPhoto: false,
      tags: themes,
    })
    setImageSaved(true)
  }, [addVisionImage, generatedImagePrompt, generatedImageGradient, themes])

  const handleSave = useCallback(() => {
    if (!currentJournalEntry || !user) return

    const completeEntry = {
      ...currentJournalEntry,
      id: currentJournalEntry.id || Date.now().toString(),
      date: currentJournalEntry.date || new Date(),
      transcript: currentJournalEntry.transcript || '',
      aiReflection: reflection,
      themes,
      emotionalSignals,
      duration: currentJournalEntry.duration || 0,
      beliefLevel: 3,
      vividnessLevel: 3,
    }

    updateUser({
      journalEntries: [...(user.journalEntries || []), completeEntry],
      totalSessions: (user.totalSessions || 0) + 1,
      practices: [
        ...(user.practices || []),
        {
          id: Date.now().toString(),
          date: new Date(),
          type: 'journal' as const,
          completed: true,
          duration: currentJournalEntry.duration || 60,
        },
      ],
    })

    setCurrentJournalEntry(null)
    setScreen('home')
  }, [currentJournalEntry, user, reflection, themes, emotionalSignals, updateUser, setCurrentJournalEntry, setScreen])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh bg-background px-6">
        <div className="breathing-orb w-28 h-28 mb-8" />
        <div className="text-center">
          <p className="font-medium text-foreground text-lg mb-2 animate-pulse-soft">
            Processing your words...
          </p>
          <p className="text-muted-foreground text-sm">
            Finding patterns and meaning
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between">
        <button
          onClick={() => setScreen('home')}
          className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
        <h1 className="font-serif text-lg font-medium text-foreground">
          AI Reflection
        </h1>
        <div className="w-10" />
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 pb-6 overflow-y-auto">
        {/* Your Words - show the actual transcript */}
        {currentJournalEntry?.transcript && (
          <div className="bg-primary/5 rounded-2xl p-5 border border-primary/20 mb-6 animate-fade-in-up">
            <p className="text-sm font-medium text-muted-foreground mb-2">What you said</p>
            <p className="text-foreground leading-relaxed italic">
              {'"'}{currentJournalEntry.transcript}{'"'}
            </p>
          </div>
        )}

        {/* AI Coach Header */}
        <div className="flex items-center gap-3 mb-6 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">{"Here's what I heard"}</p>
            <p className="text-sm text-muted-foreground">Based on your journal entry</p>
          </div>
        </div>

        {/* Reflection Content */}
        <div className="bg-card rounded-2xl p-6 border border-border mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="space-y-4 text-foreground leading-relaxed">
            {reflection.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Themes Detected */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-sm font-medium text-muted-foreground mb-3">Themes detected</p>
          <div className="flex flex-wrap gap-2">
            {themes.map((theme) => (
              <span
                key={theme}
                className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium capitalize"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>

        {/* Emotional Signals */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <p className="text-sm font-medium text-muted-foreground mb-3">Emotional signals</p>
          <div className="flex flex-wrap gap-2">
            {emotionalSignals.map((signal) => (
              <span
                key={signal}
                className="px-3 py-1.5 rounded-full bg-accent/30 text-foreground text-sm font-medium capitalize"
              >
                {signal}
              </span>
            ))}
          </div>
        </div>

        {/* AI Generated Image Section */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-3 mb-3">
            <ImagePlus className="w-5 h-5 text-primary" />
            <p className="text-sm font-medium text-muted-foreground">AI Vision from your journal</p>
          </div>

          {imageStep === 'idle' && (
            <button
              onClick={handleGenerateImage}
              className="w-full bg-primary/10 border-2 border-dashed border-primary/30 rounded-2xl p-6 flex flex-col items-center gap-3 hover:border-primary/50 transition-colors"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Wand2 className="w-7 h-7 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">Generate a Vision</p>
                <p className="text-sm text-muted-foreground mt-1">
                  AI will create an image that reflects what you shared
                </p>
              </div>
            </button>
          )}

          {imageStep === 'generating' && (
            <div className="w-full bg-card rounded-2xl border border-border p-8 flex flex-col items-center gap-4">
              <div className="breathing-orb w-16 h-16" />
              <div className="text-center">
                <p className="font-medium text-foreground animate-pulse-soft">
                  Creating your vision...
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Transforming your words into imagery
                </p>
              </div>
            </div>
          )}

          {imageStep === 'done' && (
            <div className="space-y-3">
              <div className="w-full aspect-16/10 rounded-2xl overflow-hidden relative bg-secondary">
                {generatedImageGradient.startsWith('http') || generatedImageGradient.startsWith('data:') ? (
                  <img
                    src={generatedImageGradient}
                    alt={generatedImagePrompt}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="w-full h-full" style={{ background: generatedImageGradient }} />
                )}
                <div className="absolute inset-0 flex items-end p-4">
                  <div className="bg-background/80 backdrop-blur-sm rounded-xl p-3 w-full">
                    <p className="text-xs text-foreground italic text-balance leading-relaxed">
                      {'"'}{generatedImagePrompt}{'"'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleGenerateImage}
                  variant="outline"
                  className="flex-1 h-11 rounded-xl gap-2 bg-transparent"
                >
                  <Wand2 className="w-4 h-4" />
                  Regenerate
                </Button>
                {!imageSaved ? (
                  <Button
                    onClick={handleSaveImage}
                    className="flex-1 h-11 rounded-xl gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save to Gallery
                  </Button>
                ) : (
                  <Button
                    disabled
                    className="flex-1 h-11 rounded-xl gap-2 opacity-70"
                  >
                    <Sparkles className="w-4 h-4" />
                    Saved
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Feedback */}
        <div className="bg-muted/50 rounded-2xl p-4 mb-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <p className="text-sm text-muted-foreground mb-3">Was this reflection helpful?</p>
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
              <ThumbsUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Yes</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
              <ThumbsDown className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Not quite</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="px-6 py-6 bg-background">
        <Button
          onClick={handleSave}
          className="w-full h-14 text-lg font-medium rounded-2xl"
        >
          Done
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          You showed up today. {"That's"} what matters.
        </p>
      </div>
    </div>
  )
}
