"use client"

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { PrimaryCTAButton } from '@/components/ui/primary-cta-button'
import { SelectableCard } from '@/components/ui/selectable-card'
import { ArrowLeft, Briefcase, Heart, Brain, Sparkles, Users, Wallet } from 'lucide-react'

const lifeAreas = [
  { id: 'career', label: 'Career & Purpose', icon: Briefcase },
  { id: 'relationships', label: 'Relationships', icon: Heart },
  { id: 'peace', label: 'Inner Peace', icon: Brain },
  { id: 'confidence', label: 'Confidence', icon: Sparkles },
  { id: 'social', label: 'Social Life', icon: Users },
  { id: 'abundance', label: 'Abundance', icon: Wallet },
]

export function OnboardingAreasScreen() {
  const { setScreen, onboardingData, setOnboardingData, onboardingOptions, onboardingOptionsLoading } = useApp()
  const [selected, setSelected] = useState<string[]>(onboardingData.lifeAreas || [])
  const apiLifeAreas = onboardingOptions.life_areas
  const displayAreas = apiLifeAreas.length > 0
    ? apiLifeAreas.map((area) => ({
      id: area.id,
      label: area.name || area.label || 'Untitled',
      icon: Briefcase,
    }))
    : onboardingOptionsLoading ? [] : lifeAreas

  const toggleArea = (id: string) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(a => a !== id)
        : [...prev, id]
    )
  }

  const handleContinue = () => {
    setOnboardingData({ ...onboardingData, lifeAreas: selected })
    setScreen('onboarding-emotional')
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setScreen('onboarding-intro')}
          className="flex items-center gap-2 text-muted-foreground -ml-1"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Progress indicator */}
        <div className="flex gap-2 flex-1 mx-8">
          <div className="h-1 flex-1 rounded-full bg-primary" />
          <div className="h-1 flex-1 rounded-full bg-primary" />
          <div className="h-1 flex-1 rounded-full bg-border" />
          <div className="h-1 flex-1 rounded-full bg-border" />
        </div>

        <div className="w-5" />
      </div>

      {/* Content */}
      <div className="animate-fade-in-up">
        <h1 className="font-serif text-2xl font-medium text-foreground mb-2">
          What areas of life do you want to focus on?
        </h1>
        <p className="text-muted-foreground mb-8">
          Select all that resonate with you
        </p>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3">
          {displayAreas.map((area) => {
            const Icon = area.icon
            const isSelected = selected.includes(area.id)

            return (
              <SelectableCard
                key={area.id}
                selected={isSelected}
                variant="grid"
                icon={<Icon className="w-6 h-6" />}
                onClick={() => toggleArea(area.id)}
              >
                {area.label}
              </SelectableCard>
            )
          })}
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
