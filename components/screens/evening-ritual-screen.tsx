"use client"

import React from "react"

import { useState, useCallback } from 'react'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { X, Moon, Heart, PenLine, Sparkles, ChevronRight, Check } from 'lucide-react'

const gratitudePrompts = [
  'What is one thing that went well today?',
  'Who made you smile today?',
  'What small moment brought you peace?',
  'What are you thankful for right now?',
  'What progress did you notice today?',
]

const revisionPrompts = [
  'Was there a moment today you would like to revise?',
  'Rewrite any challenging moment as you wished it happened.',
  'If you could replay one scene differently, what would it look like?',
]

export function EveningRitualScreen() {
  const { setScreen, completeRitual, updateUser, user } = useApp()
  const [step, setStep] = useState<'intro' | 'gratitude' | 'revision' | 'release' | 'complete'>('intro')
  const [gratitudeText, setGratitudeText] = useState('')
  const [revisionText, setRevisionText] = useState('')
  const [releaseItems, setReleaseItems] = useState<string[]>([])
  const [customRelease, setCustomRelease] = useState('')

  const todaysGratitudePrompt = gratitudePrompts[new Date().getDay() % gratitudePrompts.length]
  const todaysRevisionPrompt = revisionPrompts[new Date().getDay() % revisionPrompts.length]

  const releaseOptions = [
    'Worry about tomorrow',
    'Self-doubt',
    'Need for control',
    'Comparison to others',
    'Fear of failure',
    'Attachment to outcome',
  ]

  const handleComplete = useCallback(() => {
    completeRitual('evening')
    if (user) {
      updateUser({
        totalSessions: (user.totalSessions || 0) + 1,
        practices: [
          ...(user.practices || []),
          {
            id: Date.now().toString(),
            date: new Date(),
            type: 'evening-ritual',
            completed: true,
            duration: 300,
          },
        ],
      })
    }
    setStep('complete')
  }, [completeRitual, updateUser, user])

  const toggleRelease = (item: string) => {
    setReleaseItems(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    )
  }

  // Dark evening theme colors
  const bgColor = 'oklch(0.14 0.02 260)'
  const cardColor = 'oklch(0.20 0.02 260)'
  const borderColor = 'oklch(0.28 0.02 260)'
  const textColor = 'oklch(0.92 0.02 260)'
  const mutedColor = 'oklch(0.60 0.04 260)'
  const accentColor = 'oklch(0.60 0.10 260)'

  if (step === 'complete') {
    return (
      <div className="flex flex-col min-h-dvh px-6 py-8" style={{ background: bgColor }}>
        <div className="flex-1 flex flex-col items-center justify-center animate-fade-in-up">
          <Moon className="w-16 h-16 mb-8" style={{ color: accentColor }} />
          <h1 className="font-serif text-3xl font-medium mb-3 text-center" style={{ color: textColor }}>
            Evening complete
          </h1>
          <p className="text-center mb-8 max-w-[280px]" style={{ color: mutedColor }}>
            {"You've released the day and planted seeds for tomorrow. Rest well knowing all is unfolding perfectly."}
          </p>
          <div className="rounded-2xl p-5 w-full max-w-sm text-center" style={{ background: cardColor, border: `1px solid ${borderColor}` }}>
            <p className="text-sm italic" style={{ color: mutedColor }}>
              {"\"Assume the feeling of your wish fulfilled and observe the route that your attention follows.\""}
              <span className="block mt-1 not-italic font-medium" style={{ color: textColor }}>- Neville Goddard</span>
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <Button onClick={() => setScreen('sats-bedtime')} className="w-full h-14 text-lg font-medium rounded-2xl gap-2" style={{ background: accentColor, color: 'oklch(0.98 0.01 260)' }}>
            <Moon className="w-5 h-5" />
            Continue to SATS
          </Button>
          <button onClick={() => setScreen('home')} className="w-full h-12 text-sm" style={{ color: mutedColor }}>
            Return Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: bgColor }}>
      <header className="px-6 pt-8 pb-4 flex items-center justify-between">
        <button
          onClick={() => setScreen('home')}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: cardColor, border: `1px solid ${borderColor}` }}
          aria-label="Close"
        >
          <X className="w-5 h-5" style={{ color: mutedColor }} />
        </button>
        <div className="text-center">
          <p className="text-sm flex items-center gap-2" style={{ color: mutedColor }}>
            <Moon className="w-4 h-4" />
            Evening Ritual
          </p>
        </div>
        <div className="w-10" />
      </header>

      <main className="flex-1 px-6 pb-6 overflow-y-auto">
        {/* Intro */}
        {step === 'intro' && (
          <div className="text-center animate-fade-in-up">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: `${accentColor}20` }}>
              <Moon className="w-10 h-10" style={{ color: accentColor }} />
            </div>
            <h2 className="font-serif text-2xl font-medium mb-2" style={{ color: textColor }}>
              Time to Wind Down
            </h2>
            <p className="max-w-[280px] mx-auto mb-8" style={{ color: mutedColor }}>
              {"Tonight's"} ritual includes gratitude, revision, and release. About 5 minutes.
            </p>

            <div className="space-y-3 text-left">
              {[
                { icon: Heart, title: 'Gratitude', desc: 'Give thanks for today' },
                { icon: PenLine, title: 'Revision', desc: 'Rewrite what needs rewriting' },
                { icon: Sparkles, title: 'Release', desc: 'Let go and surrender' },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: cardColor, border: `1px solid ${borderColor}` }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${accentColor}20` }}>
                      <Icon className="w-5 h-5" style={{ color: accentColor }} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: textColor }}>{item.title}</p>
                      <p className="text-sm" style={{ color: mutedColor }}>{item.desc}</p>
                    </div>
                    <ChevronRight className="w-5 h-5" style={{ color: mutedColor }} />
                  </div>
                )
              })}
            </div>

            <Button onClick={() => setStep('gratitude')} className="w-full h-14 text-lg font-medium rounded-2xl mt-8" style={{ background: accentColor, color: 'oklch(0.98 0.01 260)' }}>
              Begin Evening Ritual
            </Button>
          </div>
        )}

        {/* Gratitude */}
        {step === 'gratitude' && (
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${accentColor}20` }}>
                <Heart className="w-5 h-5" style={{ color: accentColor }} />
              </div>
              <div>
                <p className="font-medium" style={{ color: textColor }}>Gratitude</p>
                <p className="text-sm" style={{ color: mutedColor }}>Step 1 of 3</p>
              </div>
            </div>

            <p className="font-serif text-xl mb-4" style={{ color: textColor }}>{todaysGratitudePrompt}</p>

            <textarea
              value={gratitudeText}
              onChange={(e) => setGratitudeText(e.target.value)}
              placeholder="Write what you are grateful for..."
              className="w-full h-40 rounded-2xl p-4 resize-none focus:outline-none focus:ring-2 mb-6"
              style={{
                background: cardColor,
                border: `1px solid ${borderColor}`,
                color: textColor,
                '--tw-ring-color': accentColor,
              } as React.CSSProperties}
            />

            <Button onClick={() => setStep('revision')} className="w-full h-14 text-lg font-medium rounded-2xl" style={{ background: accentColor, color: 'oklch(0.98 0.01 260)' }}>
              Next: Revision
            </Button>
          </div>
        )}

        {/* Revision */}
        {step === 'revision' && (
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${accentColor}20` }}>
                <PenLine className="w-5 h-5" style={{ color: accentColor }} />
              </div>
              <div>
                <p className="font-medium" style={{ color: textColor }}>Revision</p>
                <p className="text-sm" style={{ color: mutedColor }}>Step 2 of 3</p>
              </div>
            </div>

            <p className="font-serif text-xl mb-4" style={{ color: textColor }}>{todaysRevisionPrompt}</p>

            <textarea
              value={revisionText}
              onChange={(e) => setRevisionText(e.target.value)}
              placeholder="Rewrite the scene as you wish it happened..."
              className="w-full h-40 rounded-2xl p-4 resize-none focus:outline-none focus:ring-2 mb-4"
              style={{
                background: cardColor,
                border: `1px solid ${borderColor}`,
                color: textColor,
                '--tw-ring-color': accentColor,
              } as React.CSSProperties}
            />

            <div className="rounded-2xl p-4 mb-6" style={{ background: `${accentColor}15` }}>
              <p className="text-sm italic" style={{ color: mutedColor }}>
                Neville Goddard taught that by revising our memories before sleep, we reshape our reality from within.
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep('release')} className="flex-1 h-14 rounded-2xl font-medium" style={{ background: accentColor, color: 'oklch(0.98 0.01 260)' }}>
                Next: Release
              </button>
              <button onClick={() => setStep('release')} className="h-14 px-6 rounded-2xl font-medium" style={{ color: mutedColor }}>
                Skip
              </button>
            </div>
          </div>
        )}

        {/* Release */}
        {step === 'release' && (
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${accentColor}20` }}>
                <Sparkles className="w-5 h-5" style={{ color: accentColor }} />
              </div>
              <div>
                <p className="font-medium" style={{ color: textColor }}>Release</p>
                <p className="text-sm" style={{ color: mutedColor }}>Step 3 of 3</p>
              </div>
            </div>

            <p className="font-serif text-xl mb-6" style={{ color: textColor }}>
              What are you ready to let go of tonight?
            </p>

            <div className="space-y-3 mb-6">
              {releaseOptions.map((item) => (
                <button
                  key={item}
                  onClick={() => toggleRelease(item)}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl text-left transition-colors"
                  style={{
                    background: releaseItems.includes(item) ? `${accentColor}20` : cardColor,
                    border: `1px solid ${releaseItems.includes(item) ? accentColor : borderColor}`,
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: releaseItems.includes(item) ? accentColor : 'transparent',
                      border: releaseItems.includes(item) ? 'none' : `2px solid ${borderColor}`,
                    }}
                  >
                    {releaseItems.includes(item) && <Check className="w-4 h-4" style={{ color: 'oklch(0.98 0.01 260)' }} />}
                  </div>
                  <span style={{ color: textColor }}>{item}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 mb-6">
              <input
                value={customRelease}
                onChange={(e) => setCustomRelease(e.target.value)}
                placeholder="Something else..."
                className="flex-1 h-12 rounded-xl px-4 focus:outline-none focus:ring-2"
                style={{
                  background: cardColor,
                  border: `1px solid ${borderColor}`,
                  color: textColor,
                  '--tw-ring-color': accentColor,
                } as React.CSSProperties}
              />
              {customRelease && (
                <button
                  onClick={() => { toggleRelease(customRelease); setCustomRelease(''); }}
                  className="h-12 px-4 rounded-xl font-medium"
                  style={{ background: accentColor, color: 'oklch(0.98 0.01 260)' }}
                >
                  Add
                </button>
              )}
            </div>

            <Button onClick={handleComplete} className="w-full h-14 text-lg font-medium rounded-2xl" style={{ background: accentColor, color: 'oklch(0.98 0.01 260)' }}>
              Release & Complete
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
