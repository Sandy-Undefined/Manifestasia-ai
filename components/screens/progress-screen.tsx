"use client"

import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { BackButton } from '@/components/ui/back-button'
import { ArrowLeft, Calendar, Wind, Sparkles, Mic, ChevronRight, PenLine, Moon, ImagePlus, TrendingUp, BarChart3, MessageCircle, BookOpen, Brain } from 'lucide-react'

export function ProgressScreen() {
  const { setScreen, user } = useApp()

  const ps = user?.progressStats
  const currentStreak = ps?.currentStreak ?? user?.currentStreak ?? 0
  const longestStreak = ps?.longestStreak ?? user?.longestStreak ?? 0
  const streakLevel = ps?.streakLevel ?? user?.streakLevel ?? 0

  const stats = {
    daysPracticed: user?.daysPracticed || 1,
    totalSessions: ps?.totalSessions ?? user?.totalSessions ?? 0,
    journalEntries: ps?.journalEntries ?? user?.journalEntries?.length ?? 0,
    currentStreak,
    aiVisions: ps?.aiVisionsGenerated ?? user?.visionImages?.length ?? 0,
    scriptsWritten: ps?.scriptsCreated ?? user?.scripts?.length ?? 0,
    weeklyUsed: ps?.weeklyGenerationsUsed ?? user?.weeklyGenerationsUsed ?? 0,
    weeklyLimit: ps?.weeklyGenerationLimit ?? user?.weeklyGenerationLimit ?? 5,
  }

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1),
      date: date.getDate(),
      isActive: i >= 7 - stats.daysPracticed,
      isToday: i === 6,
    }
  })

  const practiceTypes = [
    { type: 'Breathwork', icon: Wind, count: user?.practices?.filter(p => p.type === 'breathwork').length || 0 },
    { type: 'Visualization', icon: Sparkles, count: user?.practices?.filter(p => p.type === 'visualization').length || 0 },
    { type: 'Journaling', icon: Mic, count: user?.practices?.filter(p => p.type === 'journal').length || 0 },
    { type: 'Scripting', icon: PenLine, count: user?.practices?.filter(p => p.type === 'scripting').length || 0 },
    { type: 'SATS / Bedtime', icon: Moon, count: user?.practices?.filter(p => p.type === 'sats').length || 0 },
    { type: 'Inner Conversations', icon: MessageCircle, count: user?.innerConversations?.length || 0 },
    { type: 'AI Visions', icon: ImagePlus, count: stats.aiVisions },
    { type: 'Evening Ritual', icon: Moon, count: user?.practices?.filter(p => p.type === 'evening-ritual').length || 0 },
    { type: 'Learning', icon: BookOpen, count: user?.completedLessons?.length || 0 },
  ]

  // Belief trend (simulated from belief history or static demo)
  const beliefHistory = user?.beliefHistory || []
  const recentBelief = beliefHistory.slice(-7)
  const avgBelief = recentBelief.length > 0
    ? Math.round(recentBelief.reduce((a, b) => a + b.level, 0) / recentBelief.length * 10) / 10
    : 3.0

  // AI Insights
  const aiInsights = [
    {
      icon: Brain,
      title: user?.visionImages?.length && user.visionImages.length > 2
        ? 'You respond best to visual practices'
        : 'Try adding more visual practices',
      desc: user?.visionImages?.length && user.visionImages.length > 2
        ? `You have created ${user.visionImages.length} visions. Your belief levels tend to be higher after visualization sessions.`
        : 'People who use AI vision generation and visualization see faster belief growth.',
    },
    {
      icon: TrendingUp,
      title: 'Belief trend',
      desc: avgBelief >= 3.5
        ? `Your average belief level is ${avgBelief}/5. Strong belief precedes manifestation -- keep it up.`
        : `Your average belief level is ${avgBelief}/5. Try scripting and inner conversations to boost conviction.`,
    },
    {
      icon: Sparkles,
      title: 'Pattern detected',
      desc: (user?.practices?.length || 0) > 3
        ? 'You are most consistent with morning practices. Consider adding evening rituals for compound results.'
        : 'Build your streak to unlock pattern insights. Every session adds to your data.',
    },
  ]

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <header className="px-6 pt-8 pb-4 flex items-center gap-4">
        <BackButton onClick={() => setScreen('home')}>
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </BackButton>
        <h1 className="font-serif text-xl font-medium text-foreground">Your Progress</h1>
      </header>

      <main className="flex-1 px-6 pb-6 overflow-y-auto">
        {/* Streak Card */}
        <div className="bg-card rounded-3xl p-6 border border-border mb-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Current streak</p>
              <p className="text-3xl font-serif font-medium text-foreground">{stats.currentStreak} {stats.currentStreak === 1 ? 'day' : 'days'}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Longest: {longestStreak} {longestStreak === 1 ? 'day' : 'days'}
                {streakLevel > 0 && (
                  <span className="ml-2 text-primary font-medium">· Level {streakLevel}</span>
                )}
              </p>
            </div>
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="w-7 h-7 text-primary" />
            </div>
          </div>
          <div className="flex justify-between">
            {last7Days.map((day, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <span className="text-xs text-muted-foreground">{day.day}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${day.isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  } ${day.isToday ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}>
                  {day.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {[
            { label: 'Total sessions', value: stats.totalSessions },
            { label: 'Journal entries', value: stats.journalEntries },
            { label: 'AI visions', value: stats.aiVisions },
            { label: 'Evidence logged', value: user?.evidenceEntries?.length || 0 },
            { label: 'Scripts written', value: stats.scriptsWritten },
            { label: 'Weekly AI uses', value: `${stats.weeklyUsed} / ${stats.weeklyLimit}` },
            { label: 'Avg belief', value: avgBelief },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-2xl p-5 border border-border">
              <p className="text-2xl font-serif font-medium text-foreground mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Belief Trend Chart */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Belief Trend</h3>
          <div className="bg-card rounded-2xl p-5 border border-border">
            {recentBelief.length > 0 ? (
              <div className="flex items-end gap-2 h-20">
                {recentBelief.map((entry, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-primary/20 rounded-t-lg overflow-hidden" style={{ height: `${(entry.level / 5) * 100}%`, minHeight: '4px' }}>
                      <div className="w-full h-full bg-primary rounded-t-lg" />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{entry.level}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-20">
                <p className="text-sm text-muted-foreground">Complete practices with belief sliders to see your trend</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Insights */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">AI Insights</h3>
          <div className="space-y-3">
            {aiInsights.map((insight, i) => {
              const Icon = insight.icon
              return (
                <div key={i} className="bg-card rounded-2xl p-4 border border-border">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{insight.title}</p>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{insight.desc}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Practice Breakdown */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Practice Breakdown</h3>
          <div className="space-y-3">
            {practiceTypes.map((practice) => {
              const Icon = practice.icon
              return (
                <div key={practice.type} className="flex items-center gap-4 p-4 bg-card rounded-2xl border border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1"><p className="font-medium text-foreground">{practice.type}</p></div>
                  <p className="text-lg font-medium text-foreground">{practice.count}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Weekly Summary CTA */}
        <button onClick={() => setScreen('weekly-summary')} className="w-full flex items-center gap-4 p-5 bg-primary/10 rounded-2xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium text-foreground">Weekly Reflection</p>
            <p className="text-sm text-muted-foreground">See your patterns and insights</p>
          </div>
          <ChevronRight className="w-5 h-5 text-primary" />
        </button>
      </main>

      {/* Bottom Navigation */}
      <nav className="px-6 py-4 bg-card border-t border-border">
        <div className="flex justify-around">
          <button onClick={() => setScreen('home')} className="flex flex-col items-center gap-1 text-muted-foreground">
            <div className="w-6 h-6 rounded-full bg-muted" /><span className="text-xs">Home</span>
          </button>
          <button onClick={() => setScreen('vision-generator')} className="flex flex-col items-center gap-1 text-muted-foreground">
            <ImagePlus className="w-6 h-6" /><span className="text-xs">Visions</span>
          </button>
          <button onClick={() => setScreen('journal')} className="flex flex-col items-center gap-1 text-muted-foreground">
            <Mic className="w-6 h-6" /><span className="text-xs">Journal</span>
          </button>
          <button onClick={() => setScreen('evidence-tracker')} className="flex flex-col items-center gap-1 text-muted-foreground">
            <TrendingUp className="w-6 h-6" /><span className="text-xs">Evidence</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-primary">
            <div className="w-6 h-6 rounded-full bg-primary" /><span className="text-xs font-medium">Progress</span>
          </button>
        </div>
      </nav>
    </div>
  )
}