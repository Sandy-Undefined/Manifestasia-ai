"use client"

import { useApp } from '@/lib/app-context'
import { PrimaryCTAButton } from '@/components/ui/primary-cta-button'
import { Shield, Heart, AlertTriangle } from 'lucide-react'

export function DisclaimerModal() {
  const { updateUser } = useApp()

  const handleAccept = () => {
    updateUser({ hasAcceptedDisclaimer: true })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: 'oklch(0 0 0 / 0.5)' }}>
      <div className="w-full max-w-[380px] bg-background rounded-3xl p-6 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-medium text-foreground">Before We Begin</h2>
            <p className="text-sm text-muted-foreground">Important information</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Mindset Tool, Not Medical Advice</p>
              <p className="text-xs text-muted-foreground mt-1">
                This app is a personal development and mindset tool. It is not a substitute for professional medical, psychological, or financial advice.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Results Vary</p>
              <p className="text-xs text-muted-foreground mt-1">
                We provide tools to support consistent mindset practices. Results depend on individual effort and are not guaranteed. We make no claims of supernatural outcomes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Your Privacy Matters</p>
              <p className="text-xs text-muted-foreground mt-1">
                AI-generated images and voice data are processed securely. Selfie photos used for personalization are never shared or stored beyond your account.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-xl p-3 mb-4">
          <p className="text-xs text-muted-foreground text-center">
            If you are experiencing mental health challenges, please seek support from a qualified professional.
          </p>
        </div>

        <PrimaryCTAButton onClick={handleAccept}>
          I Understand, Continue
        </PrimaryCTAButton>
      </div>
    </div>
  )
}
