"use client"

import { useState, useCallback, useRef } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { PrimaryCTAButton } from '@/components/ui/primary-cta-button'
import { BackButton } from '@/components/ui/back-button'
import { ArrowLeft, MessageCircle, Send, Sparkles, User, Heart, Star, Users, Wand2, Volume2 } from 'lucide-react'

const personas = [
  { id: 'mentor' as const, name: 'Wise Mentor', icon: Sparkles, desc: 'A loving guide who sees your highest potential', color: 'bg-primary/10 text-primary' },
  { id: 'partner' as const, name: 'Ideal Partner', icon: Heart, desc: 'Your perfect soulmate speaking with love', color: 'bg-accent/20 text-accent-foreground' },
  { id: 'future-self' as const, name: 'Future You', icon: Star, desc: 'The version of you who already has it all', color: 'bg-primary/10 text-primary' },
  { id: 'friend' as const, name: 'Best Friend', icon: Users, desc: 'A friend celebrating your success', color: 'bg-accent/20 text-accent-foreground' },
]

// Opening messages for each persona
const openingMessages: Record<string, string> = {
  'mentor': "I am so proud of you. You have always had this power within you, and now you are finally using it.",
  'partner': "I have been waiting for you, and here you are. You are everything I ever dreamed of.",
  'future-self': "I remember when I was where you are right now. Keep going. Everything works out beautifully.",
  'friend': "I cannot believe how well everything is going for you! Seriously, I am so happy for you.",
}

export function InnerConversationsScreen() {
  const { setScreen, addInnerConversation, trackBelief, user, updateUser } = useApp()
  const [step, setStep] = useState<'select' | 'chat' | 'complete'>('select')
  const [selectedPersona, setSelectedPersona] = useState<typeof personas[0] | null>(null)
  const [localMessages, setLocalMessages] = useState<{ role: 'self' | 'other'; text: string }[]>([])
  const [inputText, setInputText] = useState('')
  const [beliefLevel, setBeliefLevel] = useState(3)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // AI Chat hook
  const { messages: aiMessages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      prepareSendMessagesRequest: ({ messages }) => ({
        body: {
          messages,
          persona: selectedPersona?.id || 'mentor',
        },
      }),
    }),
  })

  const isTyping = status === 'streaming' || status === 'submitted'

  // Convert AI messages to local format for display
  const displayMessages = [
    ...localMessages,
    ...aiMessages.slice(1).map(m => ({
      role: (m.role === 'user' ? 'self' : 'other') as 'self' | 'other',
      text: m.parts?.filter(p => p.type === 'text').map(p => (p as { type: 'text'; text: string }).text).join('') || '',
    })),
  ]

  const handleSelectPersona = (persona: typeof personas[0]) => {
    setSelectedPersona(persona)
    const opening = openingMessages[persona.id]
    setLocalMessages([{ role: 'other', text: opening }])
    setStep('chat')
  }

  const handleSend = useCallback(() => {
    if (!inputText.trim() || !selectedPersona || isTyping) return
    const userMsg = inputText.trim()
    setInputText('')
    sendMessage({ text: userMsg })
  }, [inputText, selectedPersona, isTyping, sendMessage])

  // Text-to-speech for AI responses
  const speakText = useCallback(async (text: string) => {
    if (isSpeaking) {
      audioRef.current?.pause()
      setIsSpeaking(false)
      return
    }

    try {
      setIsSpeaking(true)
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'nova' }),
      })

      if (!response.ok) throw new Error('TTS failed')

      const { audio, contentType } = await response.json()
      const audioBlob = new Blob(
        [Uint8Array.from(atob(audio), c => c.charCodeAt(0))],
        { type: contentType }
      )
      const audioUrl = URL.createObjectURL(audioBlob)

      if (audioRef.current) {
        audioRef.current.pause()
      }
      audioRef.current = new Audio(audioUrl)
      audioRef.current.onended = () => setIsSpeaking(false)
      audioRef.current.play()
    } catch (err) {
      console.error('[v0] TTS error:', err)
      setIsSpeaking(false)
    }
  }, [isSpeaking])

  const handleComplete = useCallback(() => {
    if (selectedPersona) {
      addInnerConversation({
        id: Date.now().toString(),
        date: new Date(),
        persona: selectedPersona.id,
        personaName: selectedPersona.name,
        messages: displayMessages,
        beliefLevel,
      })
      trackBelief(beliefLevel, 'inner-conversation')
      if (user) {
        updateUser({
          totalSessions: (user.totalSessions || 0) + 1,
          practices: [
            ...(user.practices || []),
            { id: Date.now().toString(), date: new Date(), type: 'inner-conversation', completed: true, duration: 120 },
          ],
        })
      }
    }
    // Stop any playing audio
    audioRef.current?.pause()
    setStep('complete')
  }, [selectedPersona, displayMessages, beliefLevel, addInnerConversation, trackBelief, user, updateUser])

  if (step === 'complete') {
    return (
      <div className="flex flex-col min-h-dvh bg-background px-6 py-8">
        <div className="flex-1 flex flex-col items-center justify-center animate-fade-in-up">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <MessageCircle className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-serif text-3xl font-medium text-foreground mb-3 text-center">Conversation Complete</h1>
          <p className="text-muted-foreground text-center mb-6 max-w-[280px]">
            Neville taught that inner speech is the most powerful form of prayer. You just rehearsed your desired reality.
          </p>
          <div className="bg-muted/50 rounded-2xl p-5 w-full max-w-sm text-center">
            <p className="text-sm text-muted-foreground italic">
              {"\"Inner speech is the voice of God. What you say within yourself shapes the outer world.\""}
              <span className="block mt-1 not-italic font-medium text-foreground">- Neville Goddard</span>
            </p>
          </div>
        </div>
        <PrimaryCTAButton onClick={() => setScreen('home')}>Return Home</PrimaryCTAButton>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <header className="px-6 pt-8 pb-4 flex items-center justify-between">
        <BackButton onClick={() => { if (step === 'chat') setStep('select'); else setScreen('home') }}>
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </BackButton>
        <h1 className="font-serif text-lg font-medium text-foreground">
          {step === 'select' ? 'Inner Conversations' : selectedPersona?.name}
        </h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 px-6 pb-6 overflow-y-auto">
        {/* Persona Selection */}
        {step === 'select' && (
          <>
            <div className="text-center mb-6 animate-fade-in-up">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-serif text-2xl font-medium text-foreground mb-2">Rehearse Your Future</h2>
              <p className="text-muted-foreground max-w-[280px] mx-auto">
                Have a conversation with someone who already sees you living in the end.
              </p>
            </div>
            <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              {personas.map((persona) => {
                const Icon = persona.icon
                return (
                  <button key={persona.id} onClick={() => handleSelectPersona(persona)} className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl border border-border hover:border-primary/50 transition-colors">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${persona.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-medium text-foreground">{persona.name}</h4>
                      <p className="text-sm text-muted-foreground">{persona.desc}</p>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Past conversations */}
            {(user?.innerConversations?.length || 0) > 0 && (
              <div className="mt-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Recent Conversations</h3>
                <div className="space-y-2">
                  {user?.innerConversations?.slice(-3).reverse().map((c) => (
                    <div key={c.id} className="p-3 bg-card rounded-xl border border-border">
                      <p className="text-xs text-muted-foreground">{new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {c.personaName}</p>
                      <p className="text-sm text-foreground truncate mt-1">{c.messages[c.messages.length - 1]?.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Chat */}
        {step === 'chat' && (
          <div className="flex flex-col h-full">
            <div className="flex-1 space-y-4 pb-4">
              {displayMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'self' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'self'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-card border border-border text-foreground rounded-bl-sm'
                    }`}>
                    {msg.role === 'other' && (
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-medium opacity-70">{selectedPersona?.name}</p>
                        <button
                          onClick={() => speakText(msg.text)}
                          className="p-1 rounded-full hover:bg-foreground/10 transition-colors"
                          aria-label="Listen to message"
                        >
                          <Volume2 className={`w-3 h-3 ${isSpeaking ? 'text-primary animate-pulse' : 'opacity-50'}`} />
                        </button>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start animate-fade-in-up">
                  <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
                    <p className="text-sm text-muted-foreground animate-pulse-soft">typing...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Chat Input or Complete */}
      {step === 'chat' && (
        <div className="px-6 py-4 bg-background border-t border-border">
          {displayMessages.length >= 5 && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-muted-foreground">Belief level: {['Low', 'Slight', 'Medium', 'Strong', 'Absolute'][beliefLevel - 1]}</p>
              </div>
              <input type="range" min={1} max={5} value={beliefLevel} onChange={(e) => setBeliefLevel(Number(e.target.value))} className="w-full accent-primary mb-2" />
              <Button onClick={handleComplete} variant="outline" className="w-full h-10 rounded-xl text-sm bg-transparent">
                End & Save Conversation
              </Button>
            </div>
          )}
          <div className="flex items-center gap-3">
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }}
              placeholder="Speak from your desired state..."
              className="flex-1 h-12 bg-card border border-border rounded-xl px-4 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button onClick={handleSend} disabled={!inputText.trim()} className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
