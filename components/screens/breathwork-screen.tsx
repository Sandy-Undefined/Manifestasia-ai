"use client"

import { useState, useEffect, useCallback } from 'react'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { X, Pause, Play } from 'lucide-react'

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest'

const breathCycle = [
  { phase: 'inhale' as BreathPhase, duration: 4000, label: 'Breathe In' },
  { phase: 'hold' as BreathPhase, duration: 4000, label: 'Hold' },
  { phase: 'exhale' as BreathPhase, duration: 6000, label: 'Breathe Out' },
  { phase: 'rest' as BreathPhase, duration: 2000, label: 'Rest' },
]

const TOTAL_DURATION = 180000 // 3 minutes

export function BreathworkScreen() {
  const { setScreen, updateUser, user } = useApp()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
  const [phaseProgress, setPhaseProgress] = useState(0)
  const [totalElapsed, setTotalElapsed] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const currentPhase = breathCycle[currentPhaseIndex]

  const handleComplete = useCallback(() => {
    setIsComplete(true)
    setIsPlaying(false)

    if (user) {
      updateUser({
        daysPracticed: (user.daysPracticed || 0) + 1,
        totalSessions: (user.totalSessions || 0) + 1,
        practices: [
          ...(user.practices || []),
          {
            id: Date.now().toString(),
            date: new Date(),
            type: 'breathwork',
            completed: true,
            duration: 180,
          },
        ],
      })
    }
  }, [user, updateUser])

  useEffect(() => {
    if (!isPlaying || isComplete) return

    const phaseInterval = setInterval(() => {
      setPhaseProgress(prev => {
        const newProgress = prev + 50
        if (newProgress >= currentPhase.duration) {
          setCurrentPhaseIndex(i => (i + 1) % breathCycle.length)
          return 0
        }
        return newProgress
      })
    }, 50)

    const totalInterval = setInterval(() => {
      setTotalElapsed(prev => {
        const newTotal = prev + 1000
        if (newTotal >= TOTAL_DURATION) {
          handleComplete()
          return TOTAL_DURATION
        }
        return newTotal
      })
    }, 1000)

    return () => {
      clearInterval(phaseInterval)
      clearInterval(totalInterval)
    }
  }, [isPlaying, currentPhase.duration, isComplete, handleComplete])

  const orbScale = () => {
    const progress = phaseProgress / currentPhase.duration
    switch (currentPhase.phase) {
      case 'inhale':
        return 1 + progress * 0.3
      case 'hold':
        return 1.3
      case 'exhale':
        return 1.3 - progress * 0.3
      case 'rest':
        return 1
      default:
        return 1
    }
  }

  const remainingTime = Math.ceil((TOTAL_DURATION - totalElapsed) / 1000)
  const minutes = Math.floor(remainingTime / 60)
  const seconds = remainingTime % 60

  if (isComplete) {
    return (
      <div className="flex flex-col min-h-dvh bg-background px-6 py-8">
        <div className="flex-1 flex flex-col items-center justify-center animate-fade-in-up">
          <div className="breathing-orb w-32 h-32 mb-8" />

          <h1 className="font-serif text-3xl font-medium text-foreground mb-3 text-center">
            Beautifully done
          </h1>
          <p className="text-muted-foreground text-center mb-8 max-w-[280px]">
            You just gave yourself 3 minutes of calm. That matters.
          </p>

          <div className="bg-card rounded-2xl p-6 border border-border w-full max-w-sm text-center mb-8">
            <p className="text-sm text-muted-foreground mb-1">Session complete</p>
            <p className="text-2xl font-medium text-foreground">3 minutes</p>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => setScreen('journal')}
            className="w-full h-14 text-lg font-medium rounded-2xl"
          >
            Reflect with Voice Journal
          </Button>
          <Button
            variant="ghost"
            onClick={() => setScreen('home')}
            className="w-full h-12 text-muted-foreground"
          >
            Return Home
          </Button>
        </div>
      </div>
    )
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
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Breathwork</p>
          <p className="font-medium text-foreground">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </p>
        </div>
        <div className="w-10" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Breathing Orb */}
        <div className="relative mb-8">
          <div
            className="w-48 h-48 rounded-full transition-transform duration-500 ease-in-out"
            style={{
              transform: `scale(${orbScale()})`,
              background: 'radial-gradient(circle at 30% 30%, oklch(0.88 0.06 60 / 0.8), oklch(0.55 0.12 35 / 0.6))',
              boxShadow: '0 0 60px oklch(0.55 0.12 35 / 0.3), 0 0 100px oklch(0.55 0.12 35 / 0.15)',
            }}
          />
        </div>

        {/* Phase Label */}
        <div className="text-center animate-fade-in-up">
          <h2 className="font-serif text-3xl font-medium text-foreground mb-2">
            {currentPhase.label}
          </h2>
          <p className="text-muted-foreground">
            {isPlaying ? 'Follow the rhythm' : 'Press play to begin'}
          </p>
        </div>
      </main>

      {/* Controls */}
      <div className="px-6 py-8">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-20 h-20 mx-auto rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8 ml-1" />
          )}
        </button>
      </div>
    </div>
  )
}
