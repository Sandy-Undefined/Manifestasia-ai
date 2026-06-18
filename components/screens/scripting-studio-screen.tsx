"use client"

import { useState, useCallback } from 'react'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { PrimaryCTAButton } from '@/components/ui/primary-cta-button'
import { BackButton } from '@/components/ui/back-button'
import { X, PenLine, Sparkles, Mic, BookOpen, ChevronRight, Check, Wand2 } from 'lucide-react'

const scriptingTemplates = [
  {
    id: 'ideal-day' as const,
    title: 'My Ideal Day',
    subtitle: 'Describe your perfect day from start to finish',
    icon: BookOpen,
    prompt: 'I wake up in the morning feeling completely rested and at peace. The sunlight gently fills my beautiful bedroom. I...',
  },
  {
    id: 'specific-goal' as const,
    title: 'Specific Goal',
    subtitle: 'Script a specific desire as already fulfilled',
    icon: Sparkles,
    prompt: 'It is so wonderful now that I have...',
  },
  {
    id: 'revision' as const,
    title: 'Revision Script',
    subtitle: 'Rewrite a past event as you wished it happened',
    icon: PenLine,
    prompt: 'I remember when this happened, and it went perfectly. What actually happened was...',
  },
  {
    id: 'gratitude' as const,
    title: 'Gratitude Script',
    subtitle: 'Thank the universe for what you already have',
    icon: BookOpen,
    prompt: 'I am so grateful and thankful that...',
  },
  {
    id: 'free-form' as const,
    title: 'Free Writing',
    subtitle: 'Write freely in present tense',
    icon: PenLine,
    prompt: '',
  },
]

const nevilleTransforms = [
  { from: 'I want', to: 'I have' },
  { from: 'I wish', to: 'I am grateful that' },
  { from: 'I hope', to: 'I know' },
  { from: 'I will', to: 'I am' },
  { from: 'I need', to: 'I already have' },
  { from: 'someday', to: 'now' },
  { from: 'going to', to: 'already' },
]

export function ScriptingStudioScreen() {
  const { setScreen, addScript, user } = useApp()
  const [step, setStep] = useState<'select' | 'write' | 'polish' | 'saved'>('select')
  const [selectedTemplate, setSelectedTemplate] = useState<typeof scriptingTemplates[0] | null>(null)
  const [rawText, setRawText] = useState('')
  const [polishedText, setPolishedText] = useState('')
  const [isPolishing, setIsPolishing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  const handleSelectTemplate = (template: typeof scriptingTemplates[0]) => {
    setSelectedTemplate(template)
    setRawText(template.prompt)
    setStep('write')
  }

  const handlePolish = useCallback(() => {
    setIsPolishing(true)
    // Simulate AI polishing to Neville-style present tense
    setTimeout(() => {
      let polished = rawText
      for (const transform of nevilleTransforms) {
        polished = polished.replace(new RegExp(transform.from, 'gi'), transform.to)
      }
      // Add some Neville-style enhancements
      polished = polished + '\n\nIt is done. It is finished. I am now living in this beautiful reality. I give thanks for this wonderful manifestation.'
      setPolishedText(polished)
      setIsPolishing(false)
      setStep('polish')
    }, 2000)
  }, [rawText])

  const handleSave = useCallback(() => {
    if (selectedTemplate) {
      addScript({
        id: Date.now().toString(),
        date: new Date(),
        type: selectedTemplate.id,
        rawText,
        polishedText: polishedText || rawText,
        beliefLevel: 3,
        vividnessLevel: 3,
      })
      setStep('saved')
    }
  }, [selectedTemplate, rawText, polishedText, addScript])

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false)
      // Simulate voice to text
      if (!rawText) {
        setRawText("I am living in my dream apartment overlooking the city. Every morning I wake up feeling grateful and excited for the day ahead. My work brings me deep fulfillment and abundance flows to me effortlessly.")
      }
    } else {
      setIsRecording(true)
    }
  }

  if (isPolishing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh bg-background px-6">
        <div className="breathing-orb w-28 h-28 mb-8" />
        <div className="text-center">
          <p className="font-medium text-foreground text-lg mb-2 animate-pulse-soft">
            Polishing your script...
          </p>
          <p className="text-muted-foreground text-sm">
            Transforming to present-tense Neville style
          </p>
        </div>
      </div>
    )
  }

  if (step === 'saved') {
    return (
      <div className="flex flex-col min-h-dvh bg-background px-6 py-8">
        <div className="flex-1 flex flex-col items-center justify-center animate-fade-in-up">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Check className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-serif text-3xl font-medium text-foreground mb-3 text-center">
            Script Saved
          </h1>
          <p className="text-muted-foreground text-center mb-8 max-w-[280px]">
            Read this script before bed tonight. Let the feeling of having it fill your being.
          </p>
          <div className="bg-muted/50 rounded-2xl p-5 w-full max-w-sm text-center">
            <p className="text-sm text-muted-foreground italic">
              {"\"To imagine a state is to have it. Dwell in the end.\""}
              <span className="block mt-1 not-italic font-medium text-foreground">- Neville Goddard</span>
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <PrimaryCTAButton onClick={() => setScreen('home')}>
            Return Home
          </PrimaryCTAButton>
          <Button variant="ghost" onClick={() => { setStep('select'); setRawText(''); setPolishedText(''); }} className="w-full h-12 text-muted-foreground">
            Write Another Script
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <header className="px-6 pt-8 pb-4 flex items-center justify-between">
        <BackButton
          onClick={() => {
            if (step === 'write') setStep('select')
            else if (step === 'polish') setStep('write')
            else setScreen('home')
          }}
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </BackButton>
        <h1 className="font-serif text-lg font-medium text-foreground">
          {step === 'select' && 'Scripting Studio'}
          {step === 'write' && selectedTemplate?.title}
          {step === 'polish' && 'Polished Script'}
        </h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 px-6 pb-6 overflow-y-auto">
        {/* Template Selection */}
        {step === 'select' && (
          <>
            <div className="text-center mb-6 animate-fade-in-up">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <PenLine className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-serif text-2xl font-medium text-foreground mb-2">
                Script Your Reality
              </h2>
              <p className="text-muted-foreground max-w-[280px] mx-auto">
                Write your desires in present tense as if they are already true.
              </p>
            </div>

            <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              {scriptingTemplates.map((template) => {
                const Icon = template.icon
                return (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
                    className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-medium text-foreground">{template.title}</h4>
                      <p className="text-sm text-muted-foreground">{template.subtitle}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                )
              })}
            </div>

            {(user?.scripts?.length || 0) > 0 && (
              <div className="mt-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                  Recent Scripts
                </h3>
                <div className="space-y-3">
                  {user?.scripts?.slice(-3).reverse().map((script) => (
                    <div key={script.id} className="p-4 bg-card rounded-2xl border border-border">
                      <p className="text-xs text-muted-foreground mb-1">
                        {new Date(script.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {' - '}
                        {script.type.replace('-', ' ')}
                      </p>
                      <p className="text-foreground text-sm italic truncate">{script.polishedText.slice(0, 80)}...</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Writing Step */}
        {step === 'write' && (
          <div className="animate-fade-in-up">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-muted-foreground">Write or speak your script</label>
                <button
                  onClick={toggleRecording}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${isRecording ? 'bg-destructive text-destructive-foreground' : 'bg-primary/10 text-primary'
                    }`}
                >
                  <Mic className="w-4 h-4" />
                  {isRecording ? 'Stop' : 'Voice'}
                </button>
              </div>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Begin writing in present tense... &quot;I am now...&quot;"
                className="w-full h-64 bg-card border border-border rounded-2xl p-4 text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 leading-relaxed"
              />
              <p className="text-xs text-muted-foreground mt-2">{rawText.length} characters</p>
            </div>

            <div className="bg-muted/50 rounded-2xl p-4 mb-6">
              <p className="text-sm font-medium text-foreground mb-2">Tips for powerful scripting</p>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span>Write in present tense: {"\"I am\"  not \"I will\""}</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span>Include sensory details and emotions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span>Feel gratitude as you write</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handlePolish}
                disabled={!rawText.trim()}
                variant="outline"
                className="flex-1 h-14 rounded-2xl gap-2 bg-transparent"
              >
                <Wand2 className="w-5 h-5" />
                AI Polish
              </Button>
              <Button
                onClick={handleSave}
                disabled={!rawText.trim()}
                className="flex-1 h-14 rounded-2xl gap-2"
              >
                <Check className="w-5 h-5" />
                Save As-Is
              </Button>
            </div>
          </div>
        )}

        {/* Polished Result */}
        {step === 'polish' && (
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">AI-Polished Version</p>
                <p className="text-sm text-muted-foreground">Present-tense, Neville-style</p>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-5 border border-border mb-6">
              <p className="text-foreground leading-relaxed whitespace-pre-line italic">
                {polishedText}
              </p>
            </div>

            <div className="bg-muted/50 rounded-2xl p-4 mb-6">
              <p className="text-sm text-muted-foreground">
                Your original text has been transformed to present tense and infused with Neville Goddard phrasing. Read this before sleep for maximum effect.
              </p>
            </div>

            <Button onClick={handleSave} className="w-full h-14 text-lg font-medium rounded-2xl gap-2">
              <Check className="w-5 h-5" />
              Save Polished Script
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
