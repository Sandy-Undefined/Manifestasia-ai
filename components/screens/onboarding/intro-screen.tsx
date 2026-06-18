"use client"

import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { Crown, Lock, ImagePlus, Film, MessageCircle } from 'lucide-react'

const sampleVisionGradients = [
  'linear-gradient(135deg, oklch(0.88 0.06 60) 0%, oklch(0.65 0.10 35) 50%, oklch(0.55 0.12 35) 100%)',
  'linear-gradient(135deg, oklch(0.70 0.08 200) 0%, oklch(0.55 0.12 250) 50%, oklch(0.40 0.10 280) 100%)',
  'linear-gradient(135deg, oklch(0.80 0.10 140) 0%, oklch(0.60 0.12 160) 50%, oklch(0.45 0.08 180) 100%)',
]

export function OnboardingIntroScreen() {
  const { setScreen } = useApp()

  return (
    <div className="flex flex-col min-h-dvh bg-background px-6 py-12">
      {/* Progress indicator */}
      <div className="flex gap-2 mb-8">
        <div className="h-1 flex-1 rounded-full bg-primary" />
        <div className="h-1 flex-1 rounded-full bg-border" />
        <div className="h-1 flex-1 rounded-full bg-border" />
        <div className="h-1 flex-1 rounded-full bg-border" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center animate-fade-in-up">
        <div className="breathing-orb w-24 h-24 mx-auto mb-8 opacity-60" />

        <h1 className="font-serif text-3xl font-medium text-foreground mb-4 text-center text-balance">
          {"Let's personalize your experience"}
        </h1>

        <p className="text-muted-foreground text-center leading-relaxed mb-6 text-balance">
          {"We'll ask a few questions to understand where you are and what you need. This helps us create a practice path that truly fits you."}
        </p>

        {/* Sample AI Visions Preview */}
        <div className="mb-6">
          <p className="text-xs font-medium text-muted-foreground text-center mb-3 uppercase tracking-wide">
            Sample AI-generated visions
          </p>
          <div className="flex gap-2 justify-center">
            {sampleVisionGradients.map((g, i) => (
              <div key={i} className="w-20 h-20 rounded-xl overflow-hidden" style={{ background: g }} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            You will create personalized visions like these
          </p>
        </div>

        {/* Locked premium preview */}
        <div className="bg-card rounded-2xl p-4 border border-border mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Crown className="w-4 h-4 text-primary" />
            <p className="text-sm font-medium text-foreground">Premium Features Preview</p>
          </div>
          <div className="space-y-2">
            {[
              { icon: Film, label: 'AI Video Loop Generation' },
              { icon: ImagePlus, label: 'Advanced Realism Model' },
              { icon: MessageCircle, label: 'Voice-Cloned Affirmations' },
            ].map((f) => {
              const Icon = f.icon
              return (
                <div key={f.label} className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground flex-1">{f.label}</span>
                  <Lock className="w-3 h-3 text-muted-foreground" />
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border">
          <p className="text-foreground text-center">
            <span className="font-medium">This takes about 2 minutes</span>
            <br />
            <span className="text-muted-foreground text-sm">
              Your answers help us guide you, not judge you.
            </span>
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="pt-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <Button
          onClick={() => setScreen('onboarding-areas')}
          className="w-full h-14 text-lg font-medium rounded-2xl"
        >
          Begin
        </Button>
      </div>
    </div>
  )
}
