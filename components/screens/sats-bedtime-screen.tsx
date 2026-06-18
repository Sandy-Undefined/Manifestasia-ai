"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { X, Moon, Play, Pause, SkipForward, Volume2, VolumeX } from 'lucide-react'

const satsSteps = [
  {
    id: 'relax',
    text: 'Lie down comfortably. Close your eyes. Let your body become heavy and still.',
    duration: 20000,
  },
  {
    id: 'breathe',
    text: 'Breathe deeply. In through your nose... hold... and slowly release. Feel yourself sinking.',
    duration: 25000,
  },
  {
    id: 'drowsy',
    text: 'Allow yourself to drift into that dreamy state between waking and sleeping. The state akin to sleep.',
    duration: 25000,
  },
  {
    id: 'scene',
    text: 'Now, bring to mind a single short scene that implies your wish is fulfilled. See it clearly.',
    duration: 30000,
  },
  {
    id: 'loop',
    text: 'Play this scene on repeat. Feel it. Touch it. Hear the sounds. You are there now.',
    duration: 40000,
  },
  {
    id: 'feel',
    text: 'Let the feeling of the wish fulfilled wash over you completely. This is your reality.',
    duration: 30000,
  },
  {
    id: 'sleep',
    text: 'Hold this feeling as you drift off to sleep. It is done. It is finished. Sleep in the end.',
    duration: 30000,
  },
]

export function SatsBedtimeScreen() {
  const { setScreen, updateUser, user, completeRitual } = useApp()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [stepProgress, setStepProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const currentStep = satsSteps[currentStepIndex]
  const totalSteps = satsSteps.length

  const handleComplete = useCallback(() => {
    setIsComplete(true)
    setIsPlaying(false)
    completeRitual('evening')

    if (user) {
      updateUser({
        totalSessions: (user.totalSessions || 0) + 1,
        practices: [
          ...(user.practices || []),
          {
            id: Date.now().toString(),
            date: new Date(),
            type: 'sats',
            completed: true,
            duration: 200,
          },
        ],
      })
    }
  }, [user, updateUser, completeRitual])

  useEffect(() => {
    if (!isPlaying || isComplete) return

    const interval = setInterval(() => {
      setStepProgress(prev => {
        const newProgress = prev + 100
        if (newProgress >= currentStep.duration) {
          if (currentStepIndex >= totalSteps - 1) {
            handleComplete()
            return currentStep.duration
          }
          setCurrentStepIndex(i => i + 1)
          return 0
        }
        return newProgress
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying, currentStep.duration, currentStepIndex, totalSteps, isComplete, handleComplete])

  // Auto-fade volume in the last step
  useEffect(() => {
    if (currentStepIndex === totalSteps - 1 && isPlaying && !volumeTimeoutRef.current) {
      volumeTimeoutRef.current = setInterval(() => {
        setVolume(prev => Math.max(0, prev - 2))
      }, 1000)
    }
    return () => {
      if (volumeTimeoutRef.current) {
        clearInterval(volumeTimeoutRef.current)
        volumeTimeoutRef.current = null
      }
    }
  }, [currentStepIndex, totalSteps, isPlaying])

  const skipToNext = () => {
    if (currentStepIndex >= totalSteps - 1) {
      handleComplete()
    } else {
      setCurrentStepIndex(i => i + 1)
      setStepProgress(0)
    }
  }

  const progress = (stepProgress / currentStep.duration) * 100

  if (isComplete) {
    return (
      <div className="flex flex-col min-h-dvh px-6 py-8" style={{ background: 'oklch(0.12 0.02 260)' }}>
        <div className="flex-1 flex flex-col items-center justify-center animate-fade-in-up">
          <Moon className="w-16 h-16 mb-8" style={{ color: 'oklch(0.75 0.08 260)' }} />
          <h1 className="font-serif text-3xl font-medium mb-3 text-center" style={{ color: 'oklch(0.92 0.02 260)' }}>
            Sweet dreams
          </h1>
          <p className="text-center mb-8 max-w-[280px]" style={{ color: 'oklch(0.65 0.04 260)' }}>
            You fell asleep in the wish fulfilled. Let it crystallize into your reality overnight.
          </p>
          <div className="rounded-2xl p-6 w-full max-w-sm text-center mb-8" style={{ background: 'oklch(0.18 0.02 260)', border: '1px solid oklch(0.25 0.02 260)' }}>
            <p className="text-sm mb-1" style={{ color: 'oklch(0.55 0.04 260)' }}>SATS session complete</p>
            <p className="text-2xl font-medium" style={{ color: 'oklch(0.92 0.02 260)' }}>~3 minutes</p>
          </div>
        </div>
        <Button
          onClick={() => setScreen('home')}
          className="w-full h-14 text-lg font-medium rounded-2xl"
          style={{ background: 'oklch(0.55 0.08 260)', color: 'oklch(0.95 0.01 260)' }}
        >
          Return Home
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: 'oklch(0.12 0.02 260)' }}>
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between">
        <button
          onClick={() => setScreen('home')}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'oklch(0.18 0.02 260)', border: '1px solid oklch(0.25 0.02 260)' }}
          aria-label="Close"
        >
          <X className="w-5 h-5" style={{ color: 'oklch(0.65 0.04 260)' }} />
        </button>
        <div className="text-center">
          <p className="text-sm flex items-center gap-2" style={{ color: 'oklch(0.55 0.04 260)' }}>
            <Moon className="w-4 h-4" />
            SATS Bedtime Mode
          </p>
          <p className="font-medium" style={{ color: 'oklch(0.85 0.02 260)' }}>
            {currentStepIndex + 1} of {totalSteps}
          </p>
        </div>
        <button
          onClick={skipToNext}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'oklch(0.18 0.02 260)', border: '1px solid oklch(0.25 0.02 260)' }}
          aria-label="Skip"
        >
          <SkipForward className="w-5 h-5" style={{ color: 'oklch(0.65 0.04 260)' }} />
        </button>
      </header>

      {/* Progress Bar */}
      <div className="px-6 mb-8">
        <div className="flex gap-1">
          {satsSteps.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-1 rounded-full overflow-hidden"
              style={{ background: 'oklch(0.25 0.02 260)' }}
            >
              <div
                className="h-full transition-all duration-100"
                style={{
                  width: index < currentStepIndex ? '100%' : index === currentStepIndex ? `${progress}%` : '0%',
                  background: 'oklch(0.65 0.10 260)',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Moon Glow */}
        <div className="relative mb-12">
          <div
            className="w-32 h-32 rounded-full animate-breathe-slow"
            style={{
              background: 'radial-gradient(circle at 35% 35%, oklch(0.75 0.08 260 / 0.8), oklch(0.45 0.12 260 / 0.4))',
              boxShadow: '0 0 80px oklch(0.55 0.10 260 / 0.3), 0 0 160px oklch(0.45 0.08 260 / 0.15)',
            }}
          />
        </div>

        {/* Guidance Text */}
        <div className="text-center animate-fade-in-up" key={currentStepIndex}>
          <p className="font-serif text-2xl leading-relaxed max-w-[300px] text-balance" style={{ color: 'oklch(0.88 0.02 260)' }}>
            {currentStep.text}
          </p>
        </div>
      </main>

      {/* Controls */}
      <div className="px-6 py-8">
        {/* Volume Control */}
        <div className="flex items-center gap-3 mb-6 px-4">
          <button onClick={() => setIsMuted(!isMuted)} aria-label={isMuted ? 'Unmute' : 'Mute'}>
            {isMuted ? (
              <VolumeX className="w-5 h-5" style={{ color: 'oklch(0.55 0.04 260)' }} />
            ) : (
              <Volume2 className="w-5 h-5" style={{ color: 'oklch(0.55 0.04 260)' }} />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={isMuted ? 0 : volume}
            onChange={(e) => { setVolume(Number(e.target.value)); setIsMuted(false); }}
            className="flex-1 accent-primary"
            style={{ accentColor: 'oklch(0.65 0.10 260)' }}
          />
        </div>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-lg"
          style={{
            background: 'oklch(0.55 0.10 260)',
            color: 'oklch(0.95 0.01 260)',
            boxShadow: '0 0 40px oklch(0.55 0.10 260 / 0.4)',
          }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8 ml-1" />
          )}
        </button>

        <p className="text-center text-sm mt-4" style={{ color: 'oklch(0.50 0.04 260)' }}>
          {isPlaying ? 'Drift into the end...' : 'Tap to begin your SATS session'}
        </p>
      </div>
    </div>
  )
}
