"use client"

import React from "react"

import { useState, useRef, useCallback, useEffect } from 'react'
import { useApp } from '@/lib/app-context'
import {
  Wind,
  Sparkles,
  Mic,
  ImagePlus,
  PenLine,
  Moon,
  TrendingUp,
  LayoutGrid,
  MessageCircle,
  X,
  Compass,
  BookOpen,
  BarChart3,
} from 'lucide-react'

function PraxinoscopeOverlay({
  open,
  onClose,
  tools,
}: {
  open: boolean
  onClose: () => void
  tools: {
    id: string
    title: string
    icon: React.ComponentType<{ className?: string }>
    action: () => void
  }[]
}) {
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [velocity, setVelocity] = useState(0)
  const lastPointer = useRef(0)
  const lastTime = useRef(0)
  const animFrame = useRef<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const count = tools.length
  const angleStep = 360 / count

  // Reset rotation when overlay opens
  useEffect(() => {
    if (open) {
      setRotation(0)
      setVelocity(0)
    }
  }, [open])

  // Inertia momentum
  useEffect(() => {
    if (isDragging || !open) return
    let v = velocity
    const decay = () => {
      if (Math.abs(v) < 0.15) {
        cancelAnimationFrame(animFrame.current)
        return
      }
      v *= 0.95
      setRotation((prev) => prev + v)
      setVelocity(v)
      animFrame.current = requestAnimationFrame(decay)
    }
    animFrame.current = requestAnimationFrame(decay)
    return () => cancelAnimationFrame(animFrame.current)
  }, [isDragging, open, velocity])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true)
    lastPointer.current = e.clientX
    lastTime.current = Date.now()
    setVelocity(0)
    cancelAnimationFrame(animFrame.current)
  }, [])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return
      const dx = e.clientX - lastPointer.current
      setRotation((prev) => prev + dx * 0.4)
      setVelocity(dx * 0.3)
      lastPointer.current = e.clientX
      lastTime.current = Date.now()
    },
    [isDragging],
  )

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleToolClick = (tool: (typeof tools)[0]) => {
    onClose()
    setTimeout(() => tool.action(), 200)
  }

  const getFrontIndex = () => {
    const normalized = ((rotation % 360) + 360) % 360
    return Math.round(normalized / angleStep) % count
  }

  const frontIdx = getFrontIndex()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-60 flex flex-col items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
        onClick={onClose}
        role="presentation"
      />

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-8 right-6 z-10 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center"
        aria-label="Close tools"
      >
        <X className="w-5 h-5 text-muted-foreground" />
      </button>

      {/* Title */}
      <p className="relative z-10 text-sm font-medium text-muted-foreground mb-2 uppercase tracking-widest">
        Swipe to explore
      </p>

      {/* Praxinoscope ring */}
      <div
        ref={containerRef}
        className="relative z-10 w-72 h-72 touch-none select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ perspective: '800px' }}
      >
        {/* Ring guides */}
        <div className="absolute inset-2 rounded-full border border-border/40" />
        <div className="absolute inset-6 rounded-full border border-border/20" />

        {tools.map((tool, i) => {
          const angle = i * angleStep - rotation
          const rad = (angle * Math.PI) / 180
          const radius = 120
          const x = Math.sin(rad) * radius
          const z = Math.cos(rad) * radius
          const scale = 0.55 + 0.45 * ((z + radius) / (2 * radius))
          const opacity = 0.3 + 0.7 * ((z + radius) / (2 * radius))
          const isFront = i === frontIdx

          const Icon = tool.icon
          return (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              className="absolute top-1/2 left-1/2 flex flex-col items-center gap-1.5 transition-all duration-150 ease-out"
              style={{
                transform: `translate(-50%, -50%) translateX(${x}px) scale(${scale})`,
                zIndex: Math.round(z + radius),
                opacity,
                pointerEvents: scale > 0.7 ? 'auto' : 'none',
              }}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 ${isFront
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                  : 'bg-card border border-border text-foreground'
                  }`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <span
                className={`text-[11px] font-medium leading-tight text-center max-w-16 transition-colors duration-200 ${isFront ? 'text-primary' : 'text-muted-foreground'
                  }`}
              >
                {tool.title}
              </span>
            </button>
          )
        })}

        {/* Center point */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/40" />
      </div>

      {/* Active tool label */}
      <div className="relative z-10 mt-6 text-center animate-fade-in-up px-8">
        <p className="font-serif text-lg font-medium text-foreground">
          {tools[frontIdx]?.title}
        </p>
        <p className="text-sm text-muted-foreground mt-1">Tap to open</p>
      </div>
    </div>
  )
}

export function ToolsFab() {
  const { setScreen } = useApp()
  const [open, setOpen] = useState(false)

  const allTools = [
    { id: 'home', title: 'Home', icon: Compass, action: () => setScreen('home') },
    { id: 'breathwork', title: 'Breathwork', icon: Wind, action: () => setScreen('breathwork') },
    { id: 'visualization', title: 'Visualization', icon: Sparkles, action: () => setScreen('visualization') },
    { id: 'vision-gen', title: 'AI Visions', icon: ImagePlus, action: () => setScreen('vision-generator') },
    { id: 'journal', title: 'Journal', icon: Mic, action: () => setScreen('journal') },
    { id: 'scripting', title: 'Scripting', icon: PenLine, action: () => setScreen('scripting-studio') },
    { id: 'evening', title: 'Evening Ritual', icon: Moon, action: () => setScreen('evening-ritual') },
    { id: 'sats', title: 'SATS', icon: Moon, action: () => setScreen('sats-bedtime') },
    { id: 'evidence', title: 'Evidence', icon: TrendingUp, action: () => setScreen('evidence-tracker') },
    { id: 'board', title: 'Vision Board', icon: LayoutGrid, action: () => setScreen('vision-board') },
    { id: 'convo', title: 'Conversations', icon: MessageCircle, action: () => setScreen('inner-conversations') },
    { id: 'learn', title: 'Learn', icon: BookOpen, action: () => setScreen('learning-modules') },
    { id: 'progress', title: 'Progress', icon: BarChart3, action: () => setScreen('progress') },
  ]

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fab-tools-button"
        aria-label="Open all tools"
      >
        <span className="fab-tools-ring" />
        <Compass className="w-6 h-6 relative z-10" />
      </button>

      <PraxinoscopeOverlay
        open={open}
        onClose={() => setOpen(false)}
        tools={allTools}
      />
    </>
  )
}
