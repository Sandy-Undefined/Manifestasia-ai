"use client"

import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import {
  Wind,
  Sparkles,
  Mic,
  ChevronRight,
  Settings,
  ImagePlus,
  TrendingUp,
  BarChart3,
  Calendar,
  PenLine,
  Moon,
  Crown,
} from 'lucide-react'
const nevilleQuotes = [
  "Live in the feeling of the wish fulfilled.",
  "Assume the feeling of your wish fulfilled.",
  "Change your conception of yourself and you will automatically change the world in which you live.",
  "Dare to believe in the reality of your assumption.",
  "An awakened imagination works with a purpose.",
  "The world is yourself pushed out.",
  "To be transformed, the whole basis of your thoughts must change.",
]

export function HomeScreen() {
  const { user, setScreen, getVisualForRitual, setShowUpgradePrompt } = useApp()

  const hour = new Date().getHours()
  const isEvening = hour >= 18 || hour < 5

  const greeting = () => {
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const todaysQuote = nevilleQuotes[new Date().getDay() % nevilleQuotes.length]
  const ritualVisual = getVisualForRitual()

  const isPro = user?.premiumTier !== 'free'

  const ps = user?.progressStats
  const streakDays = ps?.currentStreak ?? user?.currentStreak ?? 0
  const totalSessionsDisplay = ps?.totalSessions ?? user?.totalSessions ?? 0

  const contextualActions = isEvening
    ? [
      { id: 'evening-ritual', title: 'Evening Ritual', description: 'Gratitude, revision, release', icon: Moon, color: 'bg-primary/10 text-primary', action: () => setScreen('evening-ritual') },
      { id: 'scripting', title: 'Scripting Studio', description: 'Rewrite your story', icon: PenLine, color: 'bg-accent/20 text-accent-foreground', action: () => setScreen('scripting-studio') },
      { id: 'sats', title: 'SATS Bedtime Mode', description: 'Wind down with imagery', icon: Moon, color: 'bg-primary/10 text-primary', action: () => setScreen('sats-bedtime') },
    ]
    : [
      { id: 'breathwork', title: 'Breathwork', description: '3-5 min grounding', icon: Wind, color: 'bg-primary/10 text-primary', action: () => setScreen('breathwork') },
      { id: 'visualization', title: 'Visualization', description: 'Guided SATS imagery', icon: Sparkles, color: 'bg-accent/20 text-accent-foreground', action: () => setScreen('visualization') },
      { id: 'vision-gen', title: 'AI Vision Generator', description: 'See yourself in the end', icon: ImagePlus, color: 'bg-primary/10 text-primary', action: () => setScreen('vision-generator') },
    ]

  return (
    <div className="flex flex-col min-h-dvh bg-background relative">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">{greeting()}</p>
          <h1 className="font-serif text-2xl font-medium text-foreground">{user?.name || 'Friend'}</h1>
        </div>
        <div className="flex items-center gap-2">
          {!isPro && (
            <button
              onClick={() => setShowUpgradePrompt(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium"
            >
              <Crown className="w-3 h-3" /> Pro
            </button>
          )}
          <button
            onClick={() => setScreen('settings')}
            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 pb-24 overflow-y-auto">
        {/* Streak Card */}
        <div className="bg-card rounded-3xl p-5 border border-border mb-4 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current streak</p>
              <p className="text-2xl font-serif font-medium text-foreground">
                {streakDays} {streakDays === 1 ? 'day' : 'days'}
              </p>
              {(ps?.longestStreak != null && ps.longestStreak > 0) && (
                <p className="text-xs text-muted-foreground mt-1">
                  Best: {ps.longestStreak} {ps.longestStreak === 1 ? 'day' : 'days'}
                  {ps.streakLevel > 0 && ` · Level ${ps.streakLevel}`}
                </p>
              )}
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        {/* Neville Quote */}
        <div className="bg-primary/10 rounded-2xl p-4 mb-6 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          <p className="text-sm text-foreground italic text-center text-balance">
            {'"'}
            {todaysQuote}
            {'"'}
          </p>
          <p className="text-xs text-primary text-center mt-1 font-medium">- Neville Goddard</p>
        </div>

        {/* Ritual CTA */}
        <div
          className="bg-card rounded-3xl border border-border mb-6 animate-fade-in-up overflow-hidden"
          style={{ animationDelay: '0.1s' }}
        >
          {ritualVisual && (
            <div className="w-full h-24 relative" style={{ background: ritualVisual.imageUrl }}>
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to bottom, transparent 0%, var(--card) 100%)' }}
              />
            </div>
          )}
          <div className="p-6 pt-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="breathing-orb w-12 h-12" />
              <div>
                <p className="text-sm text-muted-foreground">{isEvening ? 'Evening Ritual' : 'Morning Ritual'}</p>
                <h2 className="font-medium text-foreground">
                  {isEvening ? 'Release the Day' : 'Align Your Vision'}
                </h2>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
              {isEvening
                ? 'Wind down with gratitude, revision, and release before sleep.'
                : 'Start your day with breathwork, visualization, and create an AI vision of your desired reality.'}
            </p>
            <Button
              onClick={() => setScreen(isEvening ? 'evening-ritual' : 'practice')}
              className="w-full h-12 text-base font-medium rounded-2xl"
            >
              {isEvening ? 'Start Evening Ritual' : 'Start Morning Ritual'}
            </Button>
          </div>
        </div>

        {/* Contextual Quick Actions */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
            {isEvening ? 'Evening Practices' : 'Morning Practices'}
          </h3>
          <div className="space-y-3">
            {contextualActions.map((practice) => {
              const Icon = practice.icon
              return (
                <button
                  key={practice.id}
                  onClick={practice.action}
                  className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl border border-border hover:border-primary/50 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${practice.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-medium text-foreground">{practice.title}</h4>
                    <p className="text-sm text-muted-foreground">{practice.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              )
            })}
          </div>
        </div>

      <button
        onClick={() => setScreen('progress')}
        className="w-full bg-muted/50 rounded-2xl p-5 flex items-center gap-4 animate-fade-in-up"
        style={{ animationDelay: '0.2s' }}
      >
        <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 text-left">
          <h4 className="font-medium text-foreground">Your Progress</h4>
          <p className="text-sm text-muted-foreground">
            {totalSessionsDisplay} sessions
            {ps != null && (
              <>
                {' · '}
                {ps.journalEntries} journal
                {' · '}
                {ps.aiVisionsGenerated} AI visions
              </>
            )}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </button>
      </main>

      {/* Bottom Navigation */}
      <nav className="px-6 py-4 bg-card border-t border-border">
        <div className="flex justify-around">
          <button className="flex flex-col items-center gap-1 text-primary">
            <div className="w-6 h-6 rounded-full bg-primary" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button
            onClick={() => setScreen('vision-generator')}
            className="flex flex-col items-center gap-1 text-muted-foreground"
          >
            <ImagePlus className="w-6 h-6" />
            <span className="text-xs">Visions</span>
          </button>
          <button
            onClick={() => setScreen('journal')}
            className="flex flex-col items-center gap-1 text-muted-foreground"
          >
            <Mic className="w-6 h-6" />
            <span className="text-xs">Journal</span>
          </button>
          <button
            onClick={() => setScreen('evidence-tracker')}
            className="flex flex-col items-center gap-1 text-muted-foreground"
          >
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs">Evidence</span>
          </button>
          <button
            onClick={() => setScreen('progress')}
            className="flex flex-col items-center gap-1 text-muted-foreground"
          >
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs">Progress</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
