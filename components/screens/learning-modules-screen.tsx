"use client"

import { useState } from 'react'
import { useApp, type LearningModule } from '@/lib/app-context'
import { PrimaryCTAButton } from '@/components/ui/primary-cta-button'
import { BackButton } from '@/components/ui/back-button'
import { ArrowLeft, Lock, Check, ChevronRight, BookOpen, Brain, Sparkles, Zap, Award } from 'lucide-react'

const modules: LearningModule[] = [
  {
    id: 'loa-basics-1',
    title: 'Law of Assumption Basics',
    description: 'Understand the core principles of manifestation and consciousness.',
    category: 'loa-basics',
    requiredStreak: 0,
    isLocked: false,
    lessons: [
      { id: 'loa-1-1', title: 'What is the Law of Assumption?', content: 'The Law of Assumption, as taught by Neville Goddard, states that whatever you assume to be true becomes your reality. Unlike the Law of Attraction which focuses on "vibration", the Law of Assumption is about assuming the state of the wish fulfilled.\n\nKey principle: Your imagination creates reality. What you assume and feel to be true in your inner world must eventually manifest in your outer world.\n\nNeville said: "An assumption, though false, if persisted in, will harden into fact."', duration: '3 min', isComplete: false },
      { id: 'loa-1-2', title: 'Imagination vs. Visualization', content: 'Many people confuse visualization with imagination. Visualization is seeing pictures in your mind. Imagination, as Neville taught it, is much deeper - it is entering into the state with all your senses.\n\nWhen you imagine, you must:\n- Feel the texture of things\n- Hear the sounds around you\n- Smell the air\n- Experience the emotions\n\nThis is what Neville meant by "feeling it real." It is not about seeing pictures - it is about occupying the state.', duration: '4 min', isComplete: false },
      { id: 'loa-1-3', title: 'The Power of I AM', content: '"I AM" is the most powerful statement you can make. Neville taught that "I AM" is the name of God - it is your consciousness.\n\nWhenever you say "I AM wealthy," "I AM loved," or "I AM successful," you are not just making an affirmation. You are declaring a state of being.\n\nThe practice: Throughout the day, notice what follows your "I AM." If you catch yourself saying "I am tired" or "I am broke," gently revise it. Replace it with what you wish to be.\n\nRemember: You are always manifesting. The question is: what are you manifesting?', duration: '3 min', isComplete: false },
    ],
  },
  {
    id: 'neville-fund-1',
    title: 'Neville Goddard Fundamentals',
    description: 'Master the core techniques: SATS, Revision, and Living in the End.',
    category: 'neville-fundamentals',
    requiredStreak: 3,
    isLocked: true,
    lessons: [
      { id: 'nev-1-1', title: 'SATS: State Akin to Sleep', content: 'SATS (State Akin to Sleep) is Neville\'s most powerful technique. It is performed in the hypnagogic state - that drowsy state between waking and sleeping.\n\nThe technique:\n1. Lie down and relax completely\n2. Allow yourself to drift into drowsiness\n3. In this state, construct a short scene that implies your wish is fulfilled\n4. Loop this scene over and over with feeling\n5. Fall asleep in this state\n\nWhy it works: In this drowsy state, your conscious mind relaxes and your subconscious mind accepts the imaginal act as real.', duration: '5 min', isComplete: false },
      { id: 'nev-1-2', title: 'The Art of Revision', content: 'Revision is the technique of mentally rewriting past events as you wished they had happened.\n\nBefore sleep each night:\n1. Review the events of your day\n2. Identify any moments that did not go as you wished\n3. Mentally replay each scene, but change it to your desired outcome\n4. Feel the satisfaction of the revised version\n\nNeville said: "Revision is the key to forgiveness." By revising the past, you literally change its effect on your present and future reality.', duration: '4 min', isComplete: false },
      { id: 'nev-1-3', title: 'Living in the End', content: '"The end is where we begin." - Neville Goddard\n\nLiving in the end means occupying the mental state of having your desire fulfilled RIGHT NOW, not hoping it will come someday.\n\nPractice:\n- When you think about your desire, do not think FROM wanting. Think FROM having.\n- If you want a new home, do not imagine wanting a home. Imagine being IN your new home.\n- Feel the naturalness of it. It should feel as real as your current room.\n\nThe key distinction: You are not trying to GET something. You already HAVE it in imagination. Now just persist in that assumption.', duration: '5 min', isComplete: false },
    ],
  },
  {
    id: 'neuro-1',
    title: 'The Neuroscience of Visualization',
    description: 'How your brain cannot distinguish vivid imagination from reality.',
    category: 'neuroscience',
    requiredStreak: 7,
    isLocked: true,
    lessons: [
      { id: 'neuro-1-1', title: 'Your Brain on Imagination', content: 'Neuroscience research shows that the brain activates the same neural pathways whether you are physically doing something or vividly imagining it.\n\nStudies at Harvard showed that people who mentally practiced piano for 5 days developed nearly the same neural changes as those who physically practiced.\n\nThis means: When you vividly imagine your desired reality in SATS, your brain is literally rewiring itself as if the experience is happening now. Your subconscious mind cannot tell the difference.', duration: '4 min', isComplete: false },
      { id: 'neuro-1-2', title: 'Neuroplasticity and Belief', content: 'Your beliefs are literally neural pathways. The more you think a thought, the stronger that pathway becomes.\n\nThis is why Neville emphasized persistence: "An assumption, though false, if persisted in, will harden into fact."\n\nNeuroplasticity confirms this. Every time you assume your wish fulfilled, you strengthen that neural pathway. Eventually, it becomes your dominant thought pattern - your new identity.\n\nThe practical takeaway: Repetition is not just spiritual advice. It is neuroscience.', duration: '4 min', isComplete: false },
    ],
  },
  {
    id: 'advanced-1',
    title: 'Advanced Manifestation',
    description: 'Everyone Is You Pushed Out, multiple realities, and mastery techniques.',
    category: 'advanced',
    requiredStreak: 14,
    isLocked: true,
    lessons: [
      { id: 'adv-1-1', title: 'Everyone Is You Pushed Out (EIYPO)', content: 'One of Neville\'s most profound teachings: "Everyone is you pushed out."\n\nThis means that every person in your reality is reflecting your own assumptions and beliefs back to you. If someone treats you poorly, it is because you hold an assumption that allows that behavior.\n\nThe practice: Instead of trying to change others, change your assumption ABOUT them. See them as you wish them to be. Hold that assumption persistently.\n\nThis is not about blame. It is about recognizing your creative power and taking responsibility for your entire reality.', duration: '5 min', isComplete: false },
      { id: 'adv-1-2', title: 'The Sabbath: Resting in Faith', content: '"On the seventh day, God rested." Neville interpreted the Sabbath not as a day of the week, but as a state of consciousness.\n\nThe Sabbath is the state of complete satisfaction - the feeling that it is done. No more striving, no more effort, no more doubt.\n\nWhen you reach this state regarding a desire, the manifestation is inevitable. You have planted the seed and you rest in the knowing that it must grow.\n\nPractice: After your SATS session, if you feel a deep sense of peace and "doneness" - that is the Sabbath. Protect that feeling. Do not revisit doubt.', duration: '5 min', isComplete: false },
    ],
  },
]

const categoryIcons: Record<string, typeof BookOpen> = {
  'loa-basics': BookOpen,
  'neville-fundamentals': Sparkles,
  'neuroscience': Brain,
  'advanced': Zap,
}

export function LearningModulesScreen() {
  const { setScreen, user, completeLesson, updateUser } = useApp()
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<typeof modules[0]['lessons'][0] | null>(null)
  const streak = user?.progressStats?.currentStreak ?? user?.currentStreak ?? 0
  const completedLessons = user?.completedLessons || []

  const isModuleUnlocked = (mod: LearningModule) => streak >= mod.requiredStreak

  const handleCompleteLesson = () => {
    if (!selectedLesson) return
    completeLesson(selectedLesson.id)
    if (user) {
      updateUser({
        totalSessions: (user.totalSessions || 0) + 1,
        practices: [...(user.practices || []), { id: Date.now().toString(), date: new Date(), type: 'learning', completed: true, duration: 180 }],
      })
    }
    setSelectedLesson(null)
  }

  // Lesson detail view
  if (selectedLesson) {
    const isComplete = completedLessons.includes(selectedLesson.id)
    return (
      <div className="flex flex-col min-h-dvh bg-background">
        <header className="px-6 pt-8 pb-4 flex items-center gap-4">
          <BackButton onClick={() => setSelectedLesson(null)}>
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </BackButton>
          <div className="flex-1">
            <h1 className="font-medium text-foreground text-base">{selectedLesson.title}</h1>
            <p className="text-xs text-muted-foreground">{selectedLesson.duration} read</p>
          </div>
        </header>
        <main className="flex-1 px-6 pb-6 overflow-y-auto">
          <div className="bg-card rounded-2xl p-6 border border-border animate-fade-in-up">
            {selectedLesson.content.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-foreground leading-relaxed mb-4 last:mb-0 whitespace-pre-line">{paragraph}</p>
            ))}
          </div>
        </main>
        <div className="px-6 py-6">
          {!isComplete ? (
            <PrimaryCTAButton icon={<Check className="w-5 h-5" />} onClick={handleCompleteLesson}>
              Mark as Complete
            </PrimaryCTAButton>
          ) : (
            <div className="flex items-center justify-center gap-2 text-primary py-4">
              <Award className="w-5 h-5" />
              <span className="font-medium">Lesson Complete</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Module detail view
  if (selectedModule) {
    const Icon = categoryIcons[selectedModule.category] || BookOpen
    const lessonsDone = selectedModule.lessons.filter(l => completedLessons.includes(l.id)).length
    return (
      <div className="flex flex-col min-h-dvh bg-background">
        <header className="px-6 pt-8 pb-4 flex items-center gap-4">
          <BackButton onClick={() => setSelectedModule(null)}>
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </BackButton>
          <h1 className="font-serif text-lg font-medium text-foreground">{selectedModule.title}</h1>
        </header>
        <main className="flex-1 px-6 pb-6 overflow-y-auto">
          <div className="text-center mb-6 animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Icon className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground max-w-[280px] mx-auto">{selectedModule.description}</p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="h-2 flex-1 max-w-[200px] rounded-full bg-border overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${(lessonsDone / selectedModule.lessons.length) * 100}%` }} />
              </div>
              <span className="text-xs text-muted-foreground">{lessonsDone}/{selectedModule.lessons.length}</span>
            </div>
          </div>
          <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {selectedModule.lessons.map((lesson, i) => {
              const done = completedLessons.includes(lesson.id)
              return (
                <button key={lesson.id} onClick={() => setSelectedLesson(lesson)} className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl border border-border hover:border-primary/50 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${done ? 'bg-primary' : 'bg-muted'}`}>
                    {done ? <Check className="w-5 h-5 text-primary-foreground" /> : <span className="text-sm font-medium text-muted-foreground">{i + 1}</span>}
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className={`font-medium ${done ? 'text-muted-foreground' : 'text-foreground'}`}>{lesson.title}</h4>
                    <p className="text-sm text-muted-foreground">{lesson.duration}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              )
            })}
          </div>
        </main>
      </div>
    )
  }

  // Module list
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <header className="px-6 pt-8 pb-4 flex items-center gap-4">
        <BackButton onClick={() => setScreen('home')}>
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </BackButton>
        <h1 className="font-serif text-xl font-medium text-foreground">Learn</h1>
      </header>
      <main className="flex-1 px-6 pb-6 overflow-y-auto">
        <div className="text-center mb-6 animate-fade-in-up">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-serif text-2xl font-medium text-foreground mb-2">Knowledge Library</h2>
          <p className="text-muted-foreground max-w-[280px] mx-auto">
            Learn the principles behind your practice. New modules unlock as your streak grows.
          </p>
        </div>

        <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {modules.map((mod) => {
            const Icon = categoryIcons[mod.category] || BookOpen
            const unlocked = isModuleUnlocked(mod)
            const lessonsDone = mod.lessons.filter(l => completedLessons.includes(l.id)).length
            return (
              <button
                key={mod.id}
                onClick={() => { if (unlocked) setSelectedModule(mod) }}
                className={`w-full flex items-center gap-4 p-4 bg-card rounded-2xl border border-border transition-colors ${unlocked ? 'hover:border-primary/50' : 'opacity-60'}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${unlocked ? 'bg-primary/10' : 'bg-muted'}`}>
                  {unlocked ? <Icon className="w-6 h-6 text-primary" /> : <Lock className="w-5 h-5 text-muted-foreground" />}
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-medium text-foreground">{mod.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {unlocked ? `${lessonsDone}/${mod.lessons.length} lessons` : `Unlocks at ${mod.requiredStreak}-day streak`}
                  </p>
                </div>
                {unlocked ? (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Lock className="w-3 h-3" />
                    {mod.requiredStreak}d
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <div className="bg-muted/50 rounded-2xl p-5 mt-6 text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-sm text-muted-foreground">
            Your current streak: <span className="font-medium text-foreground">{streak} days</span>.{' '}
            {streak < 3 ? 'Keep going to unlock more modules.' : streak < 7 ? 'Great progress! Neuroscience unlocks at 7 days.' : 'You are doing amazing!'}
          </p>
        </div>
      </main>
    </div>
  )
}
