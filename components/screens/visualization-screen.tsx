"use client"

import { useState, useEffect, useCallback } from 'react'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { X, Pause, Play, SkipForward } from 'lucide-react'

const visualizationSteps = [
  {
    id: 'settle',
    text: 'Close your eyes and take a deep breath. Let your body settle into stillness.',
    duration: 15000,
  },
  {
    id: 'safe-place',
    text: 'Imagine yourself in a place where you feel completely safe and at peace.',
    duration: 20000,
  },
  {
    id: 'details',
    text: 'Notice the details around you. The colors, the sounds, the feeling of the air.',
    duration: 20000,
  },
  {
    id: 'intention',
    text: 'Now, bring to mind something you want to create in your life. See it clearly.',
    duration: 25000,
  },
  {
    id: 'feeling',
    text: 'Feel what it would be like to already have this. Let that feeling fill your body.',
    duration: 25000,
  },
  {
    id: 'gratitude',
    text: 'Thank yourself for showing up today. Slowly begin to return to the present.',
    duration: 15000,
  },
]

export function VisualizationScreen() {
  const { setScreen, updateUser, user } = useApp()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [stepProgress, setStepProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const currentStep = visualizationSteps[currentStepIndex]
  const totalSteps = visualizationSteps.length

  const handleComplete = useCallback(() => {
    setIsComplete(true)
    setIsPlaying(false)

    if (user) {
      updateUser({
        totalSessions: (user.totalSessions || 0) + 1,
        practices: [
          ...(user.practices || []),
          {
            id: Date.now().toString(),
            date: new Date(),
            type: 'visualization',
            completed: true,
            duration: 120,
          },
        ],
      })
    }
  }, [user, updateUser])

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
      <div className="flex flex-col min-h-dvh bg-background px-6 py-8">
        <div className="flex-1 flex flex-col items-center justify-center animate-fade-in-up">
          <div className="breathing-orb w-32 h-32 mb-8" />

          <h1 className="font-serif text-3xl font-medium text-foreground mb-3 text-center">
            Well done
          </h1>
          <p className="text-muted-foreground text-center mb-8 max-w-[280px]">
            {"You've aligned your mind with your intentions. This practice compounds over time."}
          </p>

          <div className="bg-card rounded-2xl p-6 border border-border w-full max-w-sm text-center mb-8">
            <p className="text-sm text-muted-foreground mb-1">Visualization complete</p>
            <p className="text-2xl font-medium text-foreground">2 minutes</p>
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
          <p className="text-sm text-muted-foreground">Visualization</p>
          <p className="font-medium text-foreground">
            {currentStepIndex + 1} of {totalSteps}
          </p>
        </div>
        <button
          onClick={skipToNext}
          className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center"
          aria-label="Skip"
        >
          <SkipForward className="w-5 h-5 text-muted-foreground" />
        </button>
      </header>

      {/* Progress Bar */}
      <div className="px-6 mb-8">
        <div className="flex gap-1">
          {visualizationSteps.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-1 rounded-full bg-border overflow-hidden"
            >
              <div
                className="h-full bg-primary transition-all duration-100"
                style={{
                  width: index < currentStepIndex
                    ? '100%'
                    : index === currentStepIndex
                      ? `${progress}%`
                      : '0%'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Ambient Orb */}
        <div className="breathing-orb w-40 h-40 mb-12 opacity-60" />

        {/* Guidance Text */}
        <div className="text-center animate-fade-in-up" key={currentStepIndex}>
          <p className="font-serif text-2xl text-foreground leading-relaxed max-w-[300px] text-balance">
            {currentStep.text}
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

        <p className="text-center text-sm text-muted-foreground mt-4">
          {isPlaying ? 'Tap to pause' : 'Tap to begin'}
        </p>
      </div>
    </div>
  )
}
