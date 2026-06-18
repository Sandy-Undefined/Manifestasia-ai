"use client"

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { PrimaryCTAButton } from '@/components/ui/primary-cta-button'
import { SelectableCard } from '@/components/ui/selectable-card'
import { ArrowLeft, Check } from 'lucide-react'

const intentions = [
  { id: 'clarity', label: 'Find clarity on what I want' },
  { id: 'calm', label: 'Feel calmer and more grounded' },
  { id: 'confidence', label: 'Build confidence in myself' },
  { id: 'consistency', label: 'Develop consistent habits' },
  { id: 'mindset', label: 'Shift my mindset and beliefs' },
  { id: 'focus', label: 'Stay focused on my goals' },
  { id: 'self-care', label: 'Prioritize my mental wellbeing' },
  { id: 'action', label: 'Take meaningful action daily' },
]

export function OnboardingIntentionsScreen() {
  const { setScreen, onboardingData, setOnboardingData, onboardingOptions, onboardingOptionsLoading } = useApp()
  const [selected, setSelected] = useState<string[]>(onboardingData.intentions || [])
  const apiIntentions = onboardingOptions.intentions
  const displayIntentions = apiIntentions.length > 0
    ? apiIntentions.map((intention) => ({
      id: intention.id,
      label: intention.label || intention.name || 'Untitled',
    }))
    : onboardingOptionsLoading ? [] : intentions

  const toggleIntention = (id: string) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : prev.length < 3 ? [...prev, id] : prev
    )
  }

  const handleContinue = () => {
    setOnboardingData({ ...onboardingData, intentions: selected })
    setScreen('onboarding-challenges')
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setScreen('onboarding-emotional')}
          className="flex items-center gap-2 text-muted-foreground -ml-1"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Progress indicator */}
        <div className="flex gap-2 flex-1 mx-8">
          <div className="h-1 flex-1 rounded-full bg-primary" />
          <div className="h-1 flex-1 rounded-full bg-primary" />
          <div className="h-1 flex-1 rounded-full bg-primary" />
          <div className="h-1 flex-1 rounded-full bg-primary" />
        </div>

        <div className="w-5" />
      </div>

      {/* Content */}
      <div className="animate-fade-in-up">
        <h1 className="font-serif text-2xl font-medium text-foreground mb-2">
          What do you hope to achieve?
        </h1>
        <p className="text-muted-foreground mb-8">
          Select up to 3 intentions
        </p>

        {/* Options */}
        <div className="space-y-3">
          {displayIntentions.map((intention) => (
            <SelectableCard
              key={intention.id}
              selected={selected.includes(intention.id)}
              variant="row-with-check"
              trailing={<Check className="w-4 h-4 text-primary-foreground" />}
              onClick={() => toggleIntention(intention.id)}
            >
              {intention.label}
            </SelectableCard>
          ))}
        </div>
        {onboardingOptionsLoading && (
          <p className="text-sm text-muted-foreground mt-3">Loading options...</p>
        )}
      </div>

      {/* CTA */}
      <div className="mt-auto pt-8">
        <PrimaryCTAButton
          onClick={handleContinue}
          disabled={selected.length === 0}
        >
          Continue
        </PrimaryCTAButton>
      </div>
    </div>
  )
}
