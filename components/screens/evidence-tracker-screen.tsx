"use client"

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { ActionButton } from '@/components/ui/action-button'
import { CreateButton } from '@/components/ui/create-button'
import { BackButton } from '@/components/ui/back-button'
import { SelectablePill } from '@/components/ui/selectable-pill'
import { ArrowLeft, Plus, Camera, Sparkles, TrendingUp, X } from 'lucide-react'

const moodLabels = ['Doubtful', 'Uncertain', 'Neutral', 'Hopeful', 'Certain']
const tagSuggestions = ['angel numbers', 'synchronicity', 'dream sign', 'overheard conversation', 'unexpected gift', 'perfect timing', 'deja vu', 'repeating pattern']

export function EvidenceTrackerScreen() {
  const { setScreen, user, addEvidence } = useApp()
  const [showNewEntry, setShowNewEntry] = useState(false)
  const [description, setDescription] = useState('')
  const [mood, setMood] = useState(3)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const entries = user?.evidenceEntries || []

  const handleSave = () => {
    addEvidence({
      id: Date.now().toString(),
      date: new Date(),
      description,
      mood,
      beliefLevel: mood,
      tags: selectedTags,
    })
    setDescription('')
    setMood(3)
    setSelectedTags([])
    setShowNewEntry(false)
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  // Group entries by date
  const groupedEntries = entries.reduce((acc, entry) => {
    const date = new Date(entry.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
    if (!acc[date]) acc[date] = []
    acc[date].push(entry)
    return acc
  }, {} as Record<string, typeof entries>)

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <header className="px-6 pt-8 pb-4 flex items-center justify-between">
        <BackButton onClick={() => setScreen('home')}>
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </BackButton>
        <h1 className="font-serif text-lg font-medium text-foreground">Evidence Log</h1>
        <button
          onClick={() => setShowNewEntry(true)}
          className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
          aria-label="Add evidence"
        >
          <Plus className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 px-6 pb-6 overflow-y-auto">
        {/* New Entry Form */}
        {showNewEntry && (
          <div className="bg-card rounded-3xl p-6 border-2 border-primary mb-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-foreground">New Evidence</h2>
              <button onClick={() => setShowNewEntry(false)} aria-label="Cancel">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What synchronicity or sign did you notice?"
              className="w-full h-24 bg-background border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4"
            />

            <div className="mb-4">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Belief level: {moodLabels[mood - 1]}
              </label>
              <input
                type="range"
                min={1}
                max={5}
                value={mood}
                onChange={(e) => setMood(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                {moodLabels.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tagSuggestions.map((tag) => (
                  <SelectablePill
                    key={tag}
                    size="sm"
                    unselectedVariant="muted"
                    selected={selectedTags.includes(tag)}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </SelectablePill>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <ActionButton icon={<Camera className="w-4 h-4" />}>
                Photo
              </ActionButton>
              <Button
                onClick={handleSave}
                disabled={!description.trim()}
                className="flex-1 h-11 rounded-xl"
              >
                Save Evidence
              </Button>
            </div>
          </div>
        )}

        {/* Stats */}
        {entries.length > 0 && (
          <div className="flex gap-3 mb-6 animate-fade-in-up">
            <div className="flex-1 bg-card rounded-2xl p-4 border border-border text-center">
              <p className="text-2xl font-serif font-medium text-foreground">{entries.length}</p>
              <p className="text-xs text-muted-foreground">Total Signs</p>
            </div>
            <div className="flex-1 bg-card rounded-2xl p-4 border border-border text-center">
              <p className="text-2xl font-serif font-medium text-foreground">
                {Math.round(entries.reduce((acc, e) => acc + e.mood, 0) / entries.length * 10) / 10}
              </p>
              <p className="text-xs text-muted-foreground">Avg Belief</p>
            </div>
            <div className="flex-1 bg-card rounded-2xl p-4 border border-border text-center">
              <p className="text-2xl font-serif font-medium text-foreground">
                {[...new Set(entries.flatMap(e => e.tags))].length}
              </p>
              <p className="text-xs text-muted-foreground">Patterns</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {entries.length === 0 && !showNewEntry && (
          <div className="flex flex-col items-center justify-center text-center pt-16 animate-fade-in-up">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <TrendingUp className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-serif text-2xl font-medium text-foreground mb-2">
              Track Your Signs
            </h2>
            <p className="text-muted-foreground max-w-[260px] mb-6">
              Log synchronicities, angel numbers, and signs from the universe. Watch your evidence grow.
            </p>
            <CreateButton icon={<Plus className="w-5 h-5" />} onClick={() => setShowNewEntry(true)}>
              Log First Evidence
            </CreateButton>
          </div>
        )}

        {/* Entries List */}
        {Object.entries(groupedEntries).reverse().map(([date, dateEntries]) => (
          <div key={date} className="mb-6 animate-fade-in-up">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">{date}</h3>
            <div className="space-y-3">
              {dateEntries.map((entry) => (
                <div key={entry.id} className="bg-card rounded-2xl p-4 border border-border">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground mb-2">{entry.description}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`w-2 h-2 rounded-full ${level <= entry.mood ? 'bg-primary' : 'bg-border'
                                }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{moodLabels[entry.mood - 1]}</span>
                      </div>
                      {entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {entry.tags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs capitalize">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Neville Quote */}
        {entries.length > 0 && (
          <div className="bg-muted/50 rounded-2xl p-5 text-center animate-fade-in-up">
            <p className="text-sm text-muted-foreground italic">
              {"\"Signs follow, they do not precede.\""}
              <span className="block mt-1 not-italic font-medium text-foreground">- Neville Goddard</span>
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
