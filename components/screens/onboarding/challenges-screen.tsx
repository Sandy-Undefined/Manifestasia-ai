"use client"

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { PrimaryCTAButton } from '@/components/ui/primary-cta-button'
import { SelectablePill } from '@/components/ui/selectable-pill'
import { ArrowLeft } from 'lucide-react'

const challenges = [
  { id: 'time', label: 'Finding time' },
  { id: 'consistency', label: 'Staying consistent' },
  { id: 'motivation', label: 'Staying motivated' },
  { id: 'belief', label: 'Believing in the process' },
  { id: 'distraction', label: 'Getting distracted' },
  { id: 'self-doubt', label: 'Self-doubt' },
]

export function OnboardingChallengesScreen() {
  const { setScreen, onboardingData, setOnboardingData, onboardingOptions, onboardingOptionsLoading } = useApp()
  const [selected, setSelected] = useState<string[]>(onboardingData.challenges || [])
  const apiChallenges = onboardingOptions.challenges
  const displayChallenges = apiChallenges.length > 0
    ? apiChallenges.map((challenge) => ({
      id: challenge.id,
      label: challenge.label || challenge.name || 'Untitled',
    }))
    : onboardingOptionsLoading ? [] : challenges

  const toggleChallenge = (id: string) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id]
    )
  }

  const handleContinue = () => {
    setOnboardingData({
      ...onboardingData,
      challenges: selected,
    })
    setScreen('roadmap')
  }

  const isValid = selected.length > 0

  return (
    <div className="flex flex-col min-h-dvh bg-background px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setScreen('onboarding-intentions')}
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
      <div className="flex-1 overflow-y-auto animate-fade-in-up">
        <h1 className="font-serif text-2xl font-medium text-foreground mb-2">
          What challenges do you face?
        </h1>
        <p className="text-muted-foreground mb-6">
          {"Knowing your obstacles helps us support you better"}
        </p>

        {/* Challenge Options */}
        <div className="flex flex-wrap gap-2 mb-8">
          {displayChallenges.map((challenge) => (
            <SelectablePill
              key={challenge.id}
              selected={selected.includes(challenge.id)}
              onClick={() => toggleChallenge(challenge.id)}
            >
              {challenge.label}
            </SelectablePill>
          ))}
        </div>
        {onboardingOptionsLoading && (
          <p className="text-sm text-muted-foreground mt-3">Loading options...</p>
        )}
      </div>

      {/* CTA */}
      <div className="mt-auto pt-6">
        <PrimaryCTAButton onClick={handleContinue} disabled={!isValid}>
          See My Personalized Path
        </PrimaryCTAButton>
      </div>
    </div>
  )
}
