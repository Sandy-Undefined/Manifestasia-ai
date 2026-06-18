"use client"

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { X, Wind, Sparkles, ImagePlus, ChevronRight } from 'lucide-react'

const practiceSteps = [
  {
    id: 'breathwork',
    title: 'Breathwork',
    subtitle: 'Ground yourself',
    duration: '3 min',
    icon: Wind,
    screen: 'breathwork' as const,
  },
  {
    id: 'visualization',
    title: 'Visualization',
    subtitle: 'SATS-style imagery',
    duration: '5 min',
    icon: Sparkles,
    screen: 'visualization' as const,
  },
  {
    id: 'vision',
    title: 'AI Vision',
    subtitle: 'See yourself in the end',
    duration: '2 min',
    icon: ImagePlus,
    screen: 'vision-generator' as const,
  },
]

export function PracticeScreen() {
  const { setScreen } = useApp()
  const [currentStep, setCurrentStep] = useState(0)

  const handleStart = () => {
    setScreen(practiceSteps[currentStep].screen)
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
          {"Today's Practice"}
        </h1>
        <div className="w-10" />
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 flex flex-col">
        {/* Intro */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="breathing-orb w-24 h-24 mx-auto mb-6" />
          <h2 className="font-serif text-2xl font-medium text-foreground mb-2">
            Ready to begin?
          </h2>
          <p className="text-muted-foreground max-w-[280px] mx-auto">
            {"Your morning ritual: breathwork, visualization, and AI vision creation. About 10 minutes."}
          </p>
        </div>

        {/* Practice Steps */}
        <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {practiceSteps.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStep
            const isComplete = index < currentStep

            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${isActive
                    ? 'bg-primary/10 border-primary'
                    : isComplete
                      ? 'bg-muted/50 border-border'
                      : 'bg-card border-border'
                  }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-medium text-foreground">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.subtitle}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-muted-foreground">{step.duration}</span>
                  {isActive && <ChevronRight className="w-5 h-5 text-primary ml-auto" />}
                </div>
              </button>
            )
          })}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* CTA */}
        <div className="py-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Button
            onClick={handleStart}
            className="w-full h-14 text-lg font-medium rounded-2xl"
          >
            Begin {practiceSteps[currentStep].title}
          </Button>

          <button
            onClick={() => setScreen('home')}
            className="w-full mt-4 text-muted-foreground text-sm"
          >
            {"I'll do this later"}
          </button>
        </div>
      </main>
    </div>
  )
}
