"use client"

import { useEffect, useState } from 'react'
import { useApp } from '@/lib/app-context'
import { PrimaryCTAButton } from '@/components/ui/primary-cta-button'
import { Wind, Mic, Sparkles, Calendar, ImagePlus, PenLine, Moon, TrendingUp } from 'lucide-react'

const roadmapItems = [
  {
    icon: Wind,
    title: 'Morning Ritual',
    description: 'Breathwork + SATS visualization + AI vision generation',
    timing: 'Every morning, 10 min',
  },
  {
    icon: ImagePlus,
    title: 'AI Vision Generator',
    description: 'See yourself living in the end with AI-generated images',
    timing: 'Create visions anytime',
  },
  {
    icon: PenLine,
    title: 'Scripting Studio',
    description: 'Write your reality in present tense, Neville-style',
    timing: 'Daily or as inspired',
  },
  {
    icon: Moon,
    title: 'Evening Ritual & SATS',
    description: 'Gratitude, revision, release, and fall asleep in the end',
    timing: 'Every evening',
  },
  {
    icon: Mic,
    title: 'Voice Journal + AI Image',
    description: 'Speak freely, get reflections, and an AI-generated vision',
    timing: 'When you need it',
  },
  {
    icon: TrendingUp,
    title: 'Evidence Tracker',
    description: 'Log synchronicities and watch your manifestations unfold',
    timing: 'As signs appear',
  },
  {
    icon: Calendar,
    title: 'Weekly Check-ins',
    description: 'Review your progress, streaks, and patterns',
    timing: 'Every Sunday',
  },
]

export function RoadmapScreen() {
  const { completeOnboarding, user } = useApp()
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const name = user?.name || 'Friend'

  useEffect(() => {
    // Simulate AI generating the roadmap
    const timer1 = setTimeout(() => setIsLoading(false), 2000)
    const timer2 = setTimeout(() => setShowContent(true), 2200)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  const handleStart = async () => {
    setError(null)
    setIsCompleting(true)
    try {
      await completeOnboarding()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete onboarding')
    } finally {
      setIsCompleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh bg-background px-6">
        <div className="breathing-orb w-32 h-32 mb-8" />
        <p className="text-foreground font-medium text-lg animate-pulse-soft">
          Creating your personal path...
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background px-6 py-8">
      {/* Header */}
      <div className={`mb-8 ${showContent ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <h1 className="font-serif text-3xl font-medium text-foreground mb-3">
          Your path is ready, {name}
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          {"This is a starting point, not a rulebook. We'll adjust as we learn what works for you."}
        </p>
      </div>

      {/* Roadmap Items */}
      <div className="flex-1 space-y-4">
        {roadmapItems.map((item, index) => {
          const Icon = item.icon
          return (
            <div
              key={item.title}
              className={`bg-card rounded-2xl p-5 border border-border ${showContent ? 'animate-fade-in-up' : 'opacity-0'
                }`}
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  <span className="text-xs text-primary font-medium">{item.timing}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Trust message */}
      <div
        className={`bg-muted/50 rounded-2xl p-4 mt-6 ${showContent ? 'animate-fade-in-up' : 'opacity-0'}`}
        style={{ animationDelay: '0.5s' }}
      >
        <p className="text-center text-sm text-muted-foreground">
          Remember: We make the tools easy. Your consistency creates the change.
        </p>
      </div>

      {/* CTA */}
      <div
        className={`pt-6 ${showContent ? 'animate-fade-in-up' : 'opacity-0'}`}
        style={{ animationDelay: '0.6s' }}
      >
        {error && (
          <p className="text-sm text-destructive mb-3">{error}</p>
        )}
        <PrimaryCTAButton
          onClick={handleStart}
          disabled={isCompleting}
        >
          {isCompleting ? 'Saving your onboarding...' : "Start Today's Practice"}
        </PrimaryCTAButton>
      </div>
    </div>
  )
}
