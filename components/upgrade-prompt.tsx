"use client"

import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { X, Crown, Sparkles, Film, Zap, Check } from 'lucide-react'

const plans = [
  {
    id: 'pro' as const,
    name: 'Pro',
    price: '$9.99/mo',
    features: [
      '25 AI generations per week',
      'Advanced realism model',
      'Animated vision loops',
      'Revision tool (photo-based)',
      'Priority generation speed',
    ],
  },
  {
    id: 'unlimited' as const,
    name: 'Unlimited',
    price: '$19.99/mo',
    features: [
      'Unlimited AI generations',
      'Video loop generation',
      'Voice-cloned affirmations',
      'Exportable vision boards',
      'All Pro features included',
    ],
  },
]

export function UpgradePrompt({ onClose }: { onClose: () => void }) {
  const { updateUser } = useApp()

  const handleUpgrade = (tier: 'pro' | 'unlimited') => {
    // Simulated upgrade
    updateUser({
      premiumTier: tier,
      weeklyGenerationLimit: tier === 'unlimited' ? 999 : 25,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'oklch(0 0 0 / 0.5)' }}>
      <div className="w-full max-w-[430px] bg-background rounded-t-3xl px-6 pt-6 pb-8 animate-fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-primary" />
            <h2 className="font-serif text-xl font-medium text-foreground">Unlock More</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-4">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-card rounded-2xl p-5 border border-border">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium text-foreground text-lg">{plan.name}</h3>
                  <p className="text-primary font-medium">{plan.price}</p>
                </div>
                {plan.id === 'unlimited' && (
                  <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium">Best Value</span>
                )}
              </div>
              <ul className="space-y-2 mb-4">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button onClick={() => handleUpgrade(plan.id)} className="w-full h-12 rounded-xl">
                Choose {plan.name}
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Cancel anytime. 7-day free trial included.
        </p>
      </div>
    </div>
  )
}
