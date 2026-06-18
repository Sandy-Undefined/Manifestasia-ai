"use client"

import { useEffect, useMemo, useState } from 'react'
import { useApp, type MediaType, type VisionImage } from '@/lib/app-context'
import { supabase } from '@/lib/supabase'
import { saveVisionImageToGallery } from '@/lib/vision-images-api'
import { Button } from '@/components/ui/button'
import { PrimaryCTAButton } from '@/components/ui/primary-cta-button'
import { SelectablePill } from '@/components/ui/selectable-pill'
import {
  X, Sparkles, ImagePlus, Wand2, ChevronRight, Check, Eye, Camera,
  Film, Play, Lock, Crown, Upload, Zap, RefreshCw, User
} from 'lucide-react'

const promptTemplates = [
  {
    category: 'Wealth & Abundance',
    templates: [
      'I am living in my dream home, a beautiful modern house with floor-to-ceiling windows',
      'I am checking my bank account and seeing abundant wealth flowing in',
      'I am driving my brand new luxury car along a scenic coastal road',
    ],
  },
  {
    category: 'Love & Relationships',
    templates: [
      'I am having a wonderful evening with my perfect partner at an elegant restaurant',
      'I am surrounded by loving friends celebrating my success',
      'I am holding hands with my soulmate watching the sunset on the beach',
    ],
  },
  {
    category: 'Health & Vitality',
    templates: [
      'I am radiating health and energy, jogging along a beach at sunrise',
      'I am looking in the mirror and feeling confident and strong',
      'I am practicing yoga on a peaceful mountaintop feeling completely at ease',
    ],
  },
  {
    category: 'Career & Purpose',
    templates: [
      'I am on stage receiving an award for my incredible work',
      'I am in my beautiful office running my thriving business',
      'I am signing a deal for my dream role at a top company',
    ],
  },
  {
    category: 'Freedom & Travel',
    templates: [
      'I am sitting at a cafe in Paris with my laptop, working from anywhere',
      'I am exploring the streets of Tokyo feeling completely free',
      'I am waking up in a luxury hotel suite overlooking the ocean',
    ],
  },
  {
    category: 'Implied Success Scenes',
    templates: [
      'My friends are congratulating me on my incredible achievement',
      'I am reading a heartfelt letter of appreciation from someone I admire',
      'Someone is shaking my hand saying "I knew you would do it"',
    ],
  },
]

type VisionLifeArea = {
  id: string
  name: string
  slug?: string
  type?: string
}

const defaultBoosters = [
  'golden hour lighting',
  'photorealistic detail',
  'natural skin texture',
  'cinematic composition',
  'warm color grading',
  'shallow depth of field',
  '8k ultra HD',
  'film grain texture',
]

const gradientPool = [
  'linear-gradient(135deg, oklch(0.88 0.06 60) 0%, oklch(0.65 0.10 35) 50%, oklch(0.55 0.12 35) 100%)',
  'linear-gradient(135deg, oklch(0.70 0.08 200) 0%, oklch(0.55 0.12 250) 50%, oklch(0.40 0.10 280) 100%)',
  'linear-gradient(135deg, oklch(0.80 0.10 140) 0%, oklch(0.60 0.12 160) 50%, oklch(0.45 0.08 180) 100%)',
  'linear-gradient(135deg, oklch(0.85 0.08 40) 0%, oklch(0.70 0.12 20) 50%, oklch(0.50 0.14 10) 100%)',
  'linear-gradient(135deg, oklch(0.78 0.06 280) 0%, oklch(0.55 0.10 300) 50%, oklch(0.40 0.14 320) 100%)',
  'linear-gradient(135deg, oklch(0.82 0.08 100) 0%, oklch(0.60 0.12 120) 50%, oklch(0.42 0.10 140) 100%)',
]

function mapSavedRowToVision(
  row: Record<string, unknown>,
  opts: {
    prompt: string
    selectedCategory: string | null
    mediaType: MediaType
    modelTier: 'basic' | 'advanced'
    beliefLevel: number
    variants: string[]
    usePhoto: boolean
  }
): VisionImage {
  const id = String(row.id ?? Date.now())
  const imageUrl = String(row.image_url ?? '')
  const createdAt = row.created_at ? new Date(String(row.created_at)) : new Date()
  const outType = row.output_type != null ? String(row.output_type) : ''
  const media: MediaType =
    outType === 'video' ? 'video' : outType === 'animated' ? 'animated' : opts.mediaType
  const tier =
    row.model_quality === 'advanced' ? 'advanced' : opts.modelTier

  return {
    id,
    prompt: opts.prompt,
    imageUrl,
    createdAt,
    lifeArea: opts.selectedCategory || 'general',
    mediaType: media,
    modelTier: tier,
    isFulfilled: false,
    lifecycle: 'active',
    beliefLevel: opts.beliefLevel,
    vividnessLevel: 3,
    variants: opts.variants,
    usesUserPhoto: opts.usePhoto,
    tags: [],
  }
}

export function VisionGeneratorScreen() {
  const { setScreen, addVisionImage, user, consumeGeneration, canGenerate, setShowUpgradePrompt, refreshProgress } = useApp()
  const [step, setStep] = useState<'category' | 'template' | 'customize' | 'generating' | 'result'>('category')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [customPrompt, setCustomPrompt] = useState('')
  const [selectedBoosters, setSelectedBoosters] = useState<string[]>([])
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [variants, setVariants] = useState<string[]>([])
  const [selectedVariant, setSelectedVariant] = useState(0)

  // New feature states
  const [mediaType, setMediaType] = useState<MediaType>('image')
  const [modelTier, setModelTier] = useState<'basic' | 'advanced'>('basic')
  const [usePhoto, setUsePhoto] = useState(false)
  const [beliefLevel, setBeliefLevel] = useState(3)

  // AI-generated boosters
  const [aiBoosters, setAiBoosters] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [improvedPrompt, setImprovedPrompt] = useState<string | null>(null)
  const [promptMood, setPromptMood] = useState<string | null>(null)
  const [visionLifeAreas, setVisionLifeAreas] = useState<VisionLifeArea[]>([])
  const [isLoadingVisionOptions, setIsLoadingVisionOptions] = useState(false)

  // Use AI boosters if available, otherwise fallback to defaults
  const displayBoosters = aiBoosters.length > 0 ? aiBoosters : defaultBoosters

  const isPro = user?.premiumTier !== 'free'
  const remaining = (user?.weeklyGenerationLimit || 5) - (user?.weeklyGenerationsUsed || 0)
  const displayCategories = useMemo(() => {
    if (visionLifeAreas.length === 0) return promptTemplates
    return visionLifeAreas.map((lifeArea) => ({
      category: lifeArea.name,
      templates: [`I am now thriving in ${lifeArea.name}.`],
    }))
  }, [visionLifeAreas])

  useEffect(() => {
    let isMounted = true
    const loadOptions = async () => {
      if (!supabase || !user) return
      setIsLoadingVisionOptions(true)
      try {
        const { data } = await supabase.auth.getSession()
        const token = data.session?.access_token
        if (!token) return
        const response = await fetch('/api/vision-images/options', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) return
        const payload = await response.json()
        const areas = Array.isArray(payload?.life_areas) ? payload.life_areas : []
        if (!isMounted) return
        setVisionLifeAreas(
          areas.map((area: { id: string; name: string; slug?: string; type?: string }) => ({
            id: area.id,
            name: area.name,
            slug: area.slug,
            type: area.type,
          }))
        )
      } catch (error) {
        console.error('[v0] Failed to load vision options', error)
      } finally {
        if (isMounted) setIsLoadingVisionOptions(false)
      }
    }
    void loadOptions()
    return () => {
      isMounted = false
    }
  }, [user])

  const canGenerateVision = () => {
    return canGenerate() && remaining > 0
  }

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category)
    setStep('template')
  }

  const handleSelectTemplate = (template: string) => {
    setSelectedTemplate(template)
    setCustomPrompt(template)
    setStep('customize')
  }

  const handleToggleBooster = (booster: string) => {
    setSelectedBoosters(prev =>
      prev.includes(booster) ? prev.filter(b => b !== booster) : [...prev, booster]
    )
  }

  const autoBoosts = ['photorealistic detail', 'cinematic composition', 'golden hour lighting', '8k ultra HD']
  const handleOneTopEnhance = () => {
    // Select all AI boosters or fallback boosters
    setSelectedBoosters(displayBoosters.slice(0, 4))
  }

  // Analyze prompt with AI to get smart boosters
  const analyzePromptWithAI = async () => {
    console.log('[v0] analyzePromptWithAI called, prompt length:', customPrompt.length)
    if (!customPrompt.trim() || customPrompt.length < 20) {
      console.log('[v0] Prompt too short, skipping analysis')
      return
    }

    setIsAnalyzing(true)
    try {
      console.log('[v0] Calling /api/analyze-prompt')
      const response = await fetch('/api/analyze-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: customPrompt }),
      })

      console.log('[v0] Response status:', response.status)
      if (!response.ok) throw new Error('Failed to analyze')

      const data = await response.json()
      console.log('[v0] Response data:', data)
      
      if (data.boosters && Array.isArray(data.boosters)) {
        console.log('[v0] Setting AI boosters:', data.boosters)
        setAiBoosters(data.boosters)
      }
      if (data.improvedPrompt) {
        setImprovedPrompt(data.improvedPrompt)
      }
      if (data.mood) {
        setPromptMood(data.mood)
      }
    } catch (err) {
      console.error('[v0] Analyze error:', err)
      // Keep using default boosters
    } finally {
      setIsAnalyzing(false)
    }
  }

  const [generationError, setGenerationError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const generateVisionImage = async () => {
    const fullPrompt = customPrompt + (selectedBoosters.length > 0 ? `. ${selectedBoosters.join(', ')}` : '')

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt, n: 4 }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate image')
      }

      const data = await response.json()
      return data.images as string[]
    } catch (err) {
      console.error('[v0] Vision generation error:', err)
      throw err
    }
  }

  const handleGenerate = async () => {
    const success = consumeGeneration()
    if (!success) return
    setStep('generating')
    setGenerationError(null)

    try {
      const images = await generateVisionImage()
      setGeneratedImage(images[0])
      setVariants(images)
      setSelectedVariant(0)
      setStep('result')
    } catch (err) {
      setGenerationError(err instanceof Error ? err.message : 'Failed to generate vision')
      setStep('customize')
    }
  }

  const handleRegenerate = async () => {
    const success = consumeGeneration()
    if (!success) return
    setStep('generating')
    setGenerationError(null)

    try {
      const images = await generateVisionImage()
      setGeneratedImage(images[0])
      setVariants(images)
      setSelectedVariant(0)
      setStep('result')
    } catch (err) {
      setGenerationError(err instanceof Error ? err.message : 'Failed to regenerate vision')
      setStep('result')
    }
  }

  const handleSave = async () => {
    const finalImage = variants[selectedVariant] || generatedImage
    if (!finalImage) {
      setSaveError('No image to save.')
      return
    }
    if (!user) {
      setSaveError('Sign in to save your vision to the gallery.')
      return
    }

    const fullPrompt =
      customPrompt + (selectedBoosters.length > 0 ? ` -- ${selectedBoosters.join(', ')}` : '')

    setSaveError(null)
    setIsSaving(true)
    try {
      const selectedLifeArea = visionLifeAreas.find((a) => a.name === selectedCategory)
      const row = await saveVisionImageToGallery({
        image: finalImage,
        metadata: {
          prompt: fullPrompt,
          belief_level: beliefLevel,
          variants_count: variants.length,
          life_area_label: selectedCategory || 'General',
        },
        life_areas: selectedLifeArea ? [selectedLifeArea.id] : undefined,
        realism_booster: selectedBoosters.length > 0 ? selectedBoosters : undefined,
        output_type: mediaType,
        model_quality: modelTier,
        vision_describe: fullPrompt,
      })

      addVisionImage(
        mapSavedRowToVision(row, {
          prompt: fullPrompt,
          selectedCategory,
          mediaType,
          modelTier,
          beliefLevel,
          variants,
          usePhoto,
        })
      )
      await refreshProgress()
      setScreen('vision-gallery')
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Could not save to gallery')
    } finally {
      setIsSaving(false)
    }
  }

  // Generating state
  if (step === 'generating') {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh bg-background px-6">
        <div className="relative mb-8">
          <div className="breathing-orb w-28 h-28" />
          {mediaType === 'video' && (
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Film className="w-5 h-5 text-primary-foreground" />
            </div>
          )}
        </div>
        <div className="text-center">
          <p className="font-medium text-foreground text-lg mb-2 animate-pulse-soft">
            {mediaType === 'video' ? 'Rendering cinematic loop...' : mediaType === 'animated' ? 'Generating animated vision...' : 'Creating your vision...'}
          </p>
          <p className="text-muted-foreground text-sm">
            {usePhoto ? 'Blending your likeness into the scene' : 'Bringing your imagination to life'}
          </p>
          <p className="text-xs text-muted-foreground mt-3">
            Model: {modelTier === 'advanced' ? 'Advanced Realism' : 'Standard'}
          </p>
        </div>
      </div>
    )
  }

  // Result state with variants
  if (step === 'result') {
    return (
      <div className="flex flex-col min-h-dvh bg-background">
        <header className="px-6 pt-8 pb-4 flex items-center justify-between">
          <button
            onClick={() => setStep('customize')}
            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center"
            aria-label="Back"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
          <h1 className="font-serif text-lg font-medium text-foreground">Your Vision</h1>
          <div className="flex items-center gap-1 text-xs text-muted-foreground bg-card border border-border px-3 py-1.5 rounded-full">
            {remaining <= 0 ? '0' : remaining} left
          </div>
        </header>

        <main className="flex-1 px-6 pb-6 overflow-y-auto">
          {/* Main generated image */}
          <div className="relative w-full aspect-4/5 rounded-3xl mb-4 animate-fade-in-up overflow-hidden bg-secondary">
            {(variants[selectedVariant] || generatedImage) && (
              <img
                src={variants[selectedVariant] || generatedImage || ''}
                alt={customPrompt}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            )}
            {mediaType === 'video' && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Play className="w-3 h-3 text-primary fill-primary" />
                <span className="text-xs font-medium text-foreground">Video Loop</span>
              </div>
            )}
            {mediaType === 'animated' && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <RefreshCw className="w-3 h-3 text-primary animate-spin" style={{ animationDuration: '3s' }} />
                <span className="text-xs font-medium text-foreground">Animated</span>
              </div>
            )}
            {usePhoto && (
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <User className="w-3 h-3 text-primary" />
                <span className="text-xs font-medium text-foreground">Your Likeness</span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-4">
              <p className="text-sm text-foreground font-medium italic text-balance">
                {'"'}{customPrompt.slice(0, 80)}{customPrompt.length > 80 ? '...' : ''}{'"'}
              </p>
            </div>
          </div>

          {/* Variant selector */}
          {variants.length > 1 && (
            <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Variants</p>
              <div className="flex gap-2">
                {variants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedVariant(i)}
                    className={`flex-1 aspect-square rounded-xl overflow-hidden border-2 transition-colors bg-secondary ${selectedVariant === i ? 'border-primary' : 'border-transparent'
                      }`}
                  >
                    <img src={v} alt={`Variant ${i + 1}`} className="w-full h-full object-cover" crossOrigin="anonymous" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Belief slider */}
          <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              How real does this feel? ({['Not yet', 'Slightly', 'Possible', 'Likely', 'Absolutely'][beliefLevel - 1]})
            </p>
            <input type="range" min={1} max={5} value={beliefLevel} onChange={(e) => setBeliefLevel(Number(e.target.value))} className="w-full accent-primary" />
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-4 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <Button onClick={handleRegenerate} variant="outline" className="flex-1 h-12 rounded-2xl gap-2 bg-transparent">
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </Button>
            <Button onClick={handleOneTopEnhance} variant="outline" className="flex-1 h-12 rounded-2xl gap-2 bg-transparent">
              <Zap className="w-4 h-4" />
              Enhance
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mb-4 italic animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {"\"It is done. It is finished. The vision is already mine.\""}
          </p>
        </main>

        <div className="px-6 py-6">
          {saveError && (
            <p className="text-sm text-destructive mb-3 text-center" role="alert">
              {saveError}
            </p>
          )}
          <Button
            type="button"
            onClick={() => void handleSave()}
            disabled={isSaving}
            className="w-full h-14 text-lg font-medium rounded-2xl gap-2"
          >
            <Check className="w-5 h-5" />
            {isSaving ? 'Saving...' : 'Save to My Gallery'}
          </Button>
          <button
            onClick={() => setScreen('vision-board')}
            className="w-full mt-3 text-primary text-sm font-medium py-2"
          >
            Add to Vision Board
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between">
        <button
          onClick={() => {
            if (step === 'template') setStep('category')
            else if (step === 'customize') setStep('template')
            else setScreen('home')
          }}
          className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center"
          aria-label="Back"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
        <h1 className="font-serif text-lg font-medium text-foreground">
          {step === 'category' && 'AI Vision Generator'}
          {step === 'template' && selectedCategory}
          {step === 'customize' && 'Customize Your Vision'}
        </h1>
        <button
          onClick={() => setScreen('vision-gallery')}
          className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center"
          aria-label="Gallery"
        >
          <Eye className="w-5 h-5 text-muted-foreground" />
        </button>
      </header>

      <main className="flex-1 px-6 pb-6 overflow-y-auto">
        {/* Category Selection */}
        {step === 'category' && (
          <>
            <div className="text-center mb-6 animate-fade-in-up">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <ImagePlus className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-serif text-2xl font-medium text-foreground mb-2">See Yourself in the End</h2>
              <p className="text-muted-foreground max-w-[280px] mx-auto">
                Choose a life area and we will create a vivid image, video, or animation of your desired reality.
              </p>
            </div>

            {/* Generation credits */}
            <div className="flex items-center justify-between bg-card rounded-2xl p-4 border border-border mb-4 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{remaining} generations left</p>
                  <p className="text-xs text-muted-foreground">Resets weekly</p>
                </div>
              </div>
              {!isPro && (
                <button onClick={() => setShowUpgradePrompt(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  <Crown className="w-3 h-3" />
                  Upgrade
                </button>
              )}
            </div>

            <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              {displayCategories.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => handleSelectCategory(cat.category)}
                  className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-medium text-foreground">{cat.category}</h4>
                    <p className="text-sm text-muted-foreground">{cat.templates.length} templates</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
            </div>
            {isLoadingVisionOptions && (
              <p className="text-xs text-muted-foreground mt-3">Loading options...</p>
            )}

            {/* Gallery link */}
            {(user?.visionImages?.length || 0) > 0 && (
              <button
                onClick={() => setScreen('vision-gallery')}
                className="w-full mt-6 flex items-center gap-4 p-4 bg-primary/10 rounded-2xl animate-fade-in-up"
                style={{ animationDelay: '0.2s' }}
              >
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <Eye className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-medium text-foreground">My Vision Gallery</h4>
                  <p className="text-sm text-muted-foreground">{user?.visionImages?.length} saved visions</p>
                </div>
                <ChevronRight className="w-5 h-5 text-primary" />
              </button>
            )}
          </>
        )}

        {/* Template Selection */}
        {step === 'template' && (
          <div className="space-y-3 animate-fade-in-up">
            {displayCategories
              .find(c => c.category === selectedCategory)
              ?.templates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectTemplate(template)}
                  className="w-full text-left p-5 bg-card rounded-2xl border border-border hover:border-primary/50 transition-colors"
                >
                  <p className="text-foreground leading-relaxed italic">{'"'}{template}{'"'}</p>
                </button>
              ))}
            <div className="pt-3">
              <button
                onClick={() => { setCustomPrompt(''); setStep('customize') }}
                className="w-full text-left p-5 bg-primary/10 rounded-2xl border-2 border-dashed border-primary/30"
              >
                <p className="font-medium text-primary mb-1">Write your own</p>
                <p className="text-sm text-muted-foreground">Describe your desired reality in your own words</p>
              </button>
            </div>
          </div>
        )}

        {/* Customize Prompt */}
        {step === 'customize' && (
          <div className="animate-fade-in-up">
            {/* Error display */}
            {generationError && (
              <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl">
                <p className="text-sm text-destructive font-medium">Generation failed</p>
                <p className="text-xs text-destructive/80 mt-1">{generationError}</p>
              </div>
            )}
            
            {/* Media Type Selector */}
            <div className="mb-5">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Output type</label>
              <div className="flex gap-2">
                {([
                  { type: 'image' as MediaType, icon: ImagePlus, label: 'Image' },
                  { type: 'animated' as MediaType, icon: RefreshCw, label: 'Animated', pro: true },
                  { type: 'video' as MediaType, icon: Film, label: 'Video', pro: true },
                ]).map(({ type, icon: Icon, label, pro }) => (
                  <button
                    key={type}
                    onClick={() => {
                      if (pro && !isPro) { setShowUpgradePrompt(true); return }
                      setMediaType(type)
                    }}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl text-sm font-medium transition-colors relative ${mediaType === type
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border text-foreground'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                    {pro && !isPro && (
                      <Lock className="w-3 h-3 absolute top-2 right-2 text-muted-foreground" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Model Tier Selector */}
            <div className="mb-5">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Model quality</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setModelTier('basic')}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${modelTier === 'basic' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground'
                    }`}
                >
                  Standard
                </button>
                <button
                  onClick={() => {
                    if (!isPro) { setShowUpgradePrompt(true); return }
                    setModelTier('advanced')
                  }}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors relative ${modelTier === 'advanced' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground'
                    }`}
                >
                  Advanced Realism
                  {!isPro && <Lock className="w-3 h-3 absolute top-2 right-2 text-muted-foreground" />}
                </button>
              </div>
            </div>

            {/* Photo personalization toggle */}
            <div className="flex items-center justify-between bg-card rounded-2xl p-4 border border-border mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {user?.selfieUrl ? <Camera className="w-5 h-5 text-primary" /> : <Upload className="w-5 h-5 text-primary" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Use my photo</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.selfieUrl ? 'Your likeness will be blended in' : 'Upload a selfie to personalize'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setUsePhoto(!usePhoto)}
                className={`w-12 h-7 rounded-full transition-colors flex items-center ${usePhoto ? 'bg-primary justify-end' : 'bg-border justify-start'
                  }`}
              >
                <div className="w-5 h-5 rounded-full bg-card mx-1 shadow-sm" />
              </button>
            </div>

            {/* Prompt textarea */}
            <div className="mb-5">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Describe your vision (present tense)</label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="I am living in my dream home..."
                className="w-full h-32 bg-card border border-border rounded-2xl p-4 text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Realism boosters */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-muted-foreground">Realism boosters</label>
                  {promptMood && (
                    <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {promptMood}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={analyzePromptWithAI}
                    disabled={isAnalyzing || customPrompt.length < 20}
                    className="flex items-center gap-1 text-xs font-medium text-primary disabled:opacity-50"
                  >
                    <Sparkles className={`w-3 h-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
                    {isAnalyzing ? 'Analyzing...' : 'AI Suggest'}
                  </button>
                  <button onClick={handleOneTopEnhance} className="flex items-center gap-1 text-xs font-medium text-primary">
                    <Zap className="w-3 h-3" />
                    Auto-select
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {displayBoosters.map((booster) => (
                  <SelectablePill
                    key={booster}
                    selected={selectedBoosters.includes(booster)}
                    onClick={() => handleToggleBooster(booster)}
                  >
                    {booster}
                  </SelectablePill>
                ))}
              </div>
              {improvedPrompt && improvedPrompt !== customPrompt && (
                <button
                  onClick={() => setCustomPrompt(improvedPrompt)}
                  className="mt-3 w-full p-3 bg-primary/5 border border-primary/20 rounded-xl text-left"
                >
                  <p className="text-xs font-medium text-primary mb-1">AI-enhanced prompt available</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{improvedPrompt}</p>
                </button>
              )}
            </div>

            <div className="bg-muted/50 rounded-2xl p-4 mb-6">
              <p className="text-sm text-muted-foreground italic">
                {"\"Assume the feeling of your wish fulfilled.\""}
                <span className="block mt-1 not-italic font-medium text-foreground">- Neville Goddard</span>
              </p>
            </div>

            <PrimaryCTAButton
              icon={<Wand2 className="w-5 h-5" />}
              onClick={handleGenerate}
              disabled={!customPrompt.trim() || !canGenerate()}
            >
              Generate My Vision
            </PrimaryCTAButton>
            {!canGenerate() && (
              <p className="text-center text-xs text-destructive mt-2">
                No generations remaining this week.{' '}
                <button onClick={() => setShowUpgradePrompt(true)} className="text-primary font-medium underline">Upgrade</button>
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
