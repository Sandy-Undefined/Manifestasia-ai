"use client"

import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'

export function WelcomeScreen() {
  const { setScreen } = useApp()

  return (
    <div className="flex flex-col min-h-dvh bg-background px-6 py-12">
      {/* Breathing Orb */}
      <div className="flex-1 flex items-center justify-center relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="breathing-orb w-[280px] h-[280px] opacity-30" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="breathing-orb w-[180px] h-[180px]" />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 text-center animate-fade-in-up">
          <h1 className="font-serif text-4xl font-medium text-foreground mb-4 text-balance">
            Manifestasia
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-[280px] mx-auto text-balance">
            A personal mindset coach powered by AI
          </p>
        </div>
      </div>

      {/* Value Props */}
      <div className="space-y-4 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
          <p className="text-foreground">AI vision generator to see yourself in the end</p>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
          <p className="text-foreground">Guided SATS, scripting, and Neville-style rituals</p>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
          <p className="text-foreground">Evidence tracking and vision board builder</p>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
          <p className="text-foreground">Morning and evening manifestation rituals</p>
        </div>
      </div>

      {/* Trust Signal */}
      <p className="text-center text-muted-foreground text-sm mb-6 px-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        Turn your imagination into reality with daily AI vision and Neville Goddard practices.
      </p>

      {/* CTA Buttons */}
      <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <Button
          onClick={() => setScreen('signup')}
          className="w-full h-14 text-lg font-medium rounded-2xl"
        >
          Get Started
        </Button>
        <Button
          variant="ghost"
          onClick={() => setScreen('login')}
          className="w-full h-12 text-muted-foreground"
        >
          I already have an account
        </Button>
      </div>
    </div>
  )
}
