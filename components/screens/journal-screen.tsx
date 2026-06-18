"use client"

import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { X, Mic, ChevronRight } from 'lucide-react'

const prompts = [
  "What's on your mind right now?",
  "How are you feeling in this moment?",
  "What came up during your practice?",
  "What would you like to release today?",
  "What are you grateful for?",
]

export function JournalScreen() {
  const { setScreen, user } = useApp()

  const todaysPrompt = prompts[new Date().getDay() % prompts.length]
  const recentEntries = user?.journalEntries?.slice(-3) || []

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
        <h1 className="font-serif text-lg font-medium text-foreground">
          Voice Journal
        </h1>
        <div className="w-10" />
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 pb-6 overflow-y-auto">
        {/* Today's Prompt */}
        <div className="bg-card rounded-3xl p-6 border border-border mb-6 animate-fade-in-up">
          <p className="text-sm text-muted-foreground mb-2">{"Today's prompt"}</p>
          <h2 className="font-serif text-xl font-medium text-foreground mb-4">
            {todaysPrompt}
          </h2>

          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            Tap the button below and speak freely. {"There's"} no right or wrong way to do this.
          </p>

          <Button
            onClick={() => setScreen('journal-recording')}
            className="w-full h-14 text-lg font-medium rounded-2xl gap-3"
          >
            <Mic className="w-5 h-5" />
            Start Recording
          </Button>
        </div>

        {/* Tips */}
        <div className="bg-muted/50 rounded-2xl p-5 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="font-medium text-foreground mb-3">Tips for voice journaling</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>Speak for 30-90 seconds</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>{"Don't overthink — just let it flow"}</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>Your words stay private</span>
            </li>
          </ul>
        </div>

        {/* Recent Entries */}
        {recentEntries.length > 0 && (
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
              Recent Entries
            </h3>
            <div className="space-y-3">
              {recentEntries.map((entry) => (
                <button
                  key={entry.id}
                  className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl border border-border hover:border-primary/50 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mic className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="font-medium text-foreground truncate">
                      {entry.transcript.slice(0, 50)}...
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
