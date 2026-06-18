"use client"

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { PrimaryCTAButton } from '@/components/ui/primary-cta-button'
import { SelectableCard } from '@/components/ui/selectable-card'
import { ArrowLeft } from 'lucide-react'

const emotionalStates = [
  { id: 'overwhelmed', label: 'Overwhelmed', description: 'Too much on my plate' },
  { id: 'stuck', label: 'Stuck', description: 'Not sure what direction to take' },
  { id: 'anxious', label: 'Anxious', description: 'Worried about the future' },
  { id: 'unmotivated', label: 'Unmotivated', description: 'Lacking drive or energy' },
  { id: 'scattered', label: 'Scattered', description: 'Hard to focus or stay consistent' },
  { id: 'hopeful', label: 'Hopeful', description: 'Ready for positive change' },
]

export function OnboardingEmotionalScreen() {
  const { setScreen, onboardingData, setOnboardingData, onboardingOptions, onboardingOptionsLoading } = useApp()
  const [selected, setSelected] = useState<string>(onboardingData.emotionalState || '')
  const apiEmotionalStates = onboardingOptions.emotional_states
  const displayStates = apiEmotionalStates.length > 0
    ? apiEmotionalStates.map((state) => ({
      id: state.id,
      label: state.label || state.name || 'Untitled',
      description: state.description || '',
    }))
    : onboardingOptionsLoading ? [] : emotionalStates

  const handleContinue = () => {
    setOnboardingData({ ...onboardingData, emotionalState: selected })
    setScreen('onboarding-intentions')
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setScreen('onboarding-areas')}
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
          <div className="h-1 flex-1 rounded-full bg-border" />
        </div>

        <div className="w-5" />
      </div>

      {/* Content */}
      <div className="animate-fade-in-up">
        <h1 className="font-serif text-2xl font-medium text-foreground mb-2">
          How are you feeling right now?
        </h1>
        <p className="text-muted-foreground mb-8">
          Be honest. There are no wrong answers.
        </p>

        {/* Options */}
        <div className="space-y-3">
          {displayStates.map((state) => (
            <SelectableCard
              key={state.id}
              selected={selected === state.id}
              variant="row"
              description={state.description}
              onClick={() => setSelected(state.id)}
              className="p-5"
            >
              {state.label}
            </SelectableCard>
          ))}
        </div>
        {onboardingOptionsLoading && (
          <p className="text-sm text-muted-foreground mt-3">Loading options...</p>
        )}
      </div>

      {/* CTA */}
      <div className="mt-auto pt-8">
        <PrimaryCTAButton onClick={handleContinue} disabled={!selected}>
          Continue
        </PrimaryCTAButton>
      </div>
    </div>
  )
}
