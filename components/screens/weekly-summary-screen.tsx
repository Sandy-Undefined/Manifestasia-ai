"use client"

import { useApp } from '@/lib/app-context'
import { PrimaryCTAButton } from '@/components/ui/primary-cta-button'
import { BackButton } from '@/components/ui/back-button'
import { ArrowLeft, Sparkles, TrendingUp, MessageCircle, Heart } from 'lucide-react'

export function WeeklySummaryScreen() {
  const { setScreen, user } = useApp()

  // Aggregate themes from journal entries
  const allThemes = user?.journalEntries?.flatMap(e => e.themes) || []
  const themeCounts = allThemes.reduce((acc, theme) => {
    acc[theme] = (acc[theme] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topThemes = Object.entries(themeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([theme]) => theme)

  const insights = [
    {
      icon: TrendingUp,
      title: 'Growing Awareness',
      description: "You've become more attuned to your body's signals. This is the foundation of lasting change.",
    },
    {
      icon: MessageCircle,
      title: 'Finding Your Voice',
      description: "Your journal entries show increasing depth and self-reflection. Keep speaking your truth.",
    },
    {
      icon: Heart,
      title: 'Showing Up Matters',
      description: "Every session, no matter how short, builds the neural pathways for lasting transformation.",
    },
  ]

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex items-center gap-4">
        <BackButton onClick={() => setScreen('progress')}>
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </BackButton>
        <h1 className="font-serif text-xl font-medium text-foreground">
          Weekly Reflection
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 pb-6 overflow-y-auto">
        {/* Summary Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="breathing-orb w-20 h-20 mx-auto mb-4 opacity-60" />
          <h2 className="font-serif text-2xl font-medium text-foreground mb-2">
            {"Here's what you focused on"}
          </h2>
          <p className="text-muted-foreground">
            A gentle look at your week
          </p>
        </div>

        {/* Week Stats */}
        <div className="bg-card rounded-2xl p-6 border border-border mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-serif font-medium text-foreground">
                {user?.practices?.filter(p => {
                  const date = new Date(p.date)
                  const weekAgo = new Date()
                  weekAgo.setDate(weekAgo.getDate() - 7)
                  return date >= weekAgo
                }).length || 1}
              </p>
              <p className="text-xs text-muted-foreground">Sessions</p>
            </div>
            <div>
              <p className="text-2xl font-serif font-medium text-foreground">
                {user?.journalEntries?.filter(e => {
                  const date = new Date(e.date)
                  const weekAgo = new Date()
                  weekAgo.setDate(weekAgo.getDate() - 7)
                  return date >= weekAgo
                }).length || 0}
              </p>
              <p className="text-xs text-muted-foreground">Journals</p>
            </div>
            <div>
              <p className="text-2xl font-serif font-medium text-foreground">
                {Math.round((user?.practices?.reduce((acc, p) => acc + p.duration, 0) || 180) / 60)}
              </p>
              <p className="text-xs text-muted-foreground">Minutes</p>
            </div>
          </div>
        </div>

        {/* Themes */}
        {topThemes.length > 0 && (
          <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
              Recurring Themes
            </h3>
            <div className="flex flex-wrap gap-2">
              {topThemes.map((theme) => (
                <span
                  key={theme}
                  className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium capitalize"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Insights */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
            Insights for You
          </h3>
          <div className="space-y-4">
            {insights.map((insight, index) => {
              const Icon = insight.icon
              return (
                <div
                  key={index}
                  className="bg-card rounded-2xl p-5 border border-border"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/30 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Coach Note */}
        <div className="bg-primary/10 rounded-2xl p-6 mb-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">A note for next week</h4>
              <p className="text-muted-foreground leading-relaxed">
                {"You're doing the work that most people avoid. Remember: small, consistent steps create profound change over time. Next week, try to notice one moment each day where you feel more present than before."}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="px-6 py-6 bg-background">
        <PrimaryCTAButton onClick={() => setScreen('home')}>
          Continue Your Journey
        </PrimaryCTAButton>
      </div>
    </div>
  )
}
