"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { X, Mic, Square, Check } from 'lucide-react'

const SpeechRecognition =
  typeof window !== 'undefined' &&
  (window.SpeechRecognition || window.webkitSpeechRecognition)

export function JournalRecordingScreen() {
  const { setScreen, setCurrentJournalEntry } = useApp()
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [speechError, setSpeechError] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const recognitionRef = useRef<{ stop: () => void; abort: () => void } | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const transcriptRef = useRef('')

  const startRecording = useCallback(async () => {
    setSpeechError(null)
    setIsRecording(true)
    setDuration(0)
    setTranscript('')
    transcriptRef.current = ''

    timerRef.current = setInterval(() => {
      setDuration(d => d + 1)
    }, 1000)

    try {
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'en-US'

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let newFinal = ''
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i]
            const text = result[0].transcript
            if (result.isFinal) {
              newFinal += text + ' '
            }
          }
          if (newFinal) {
            const updated = (transcriptRef.current + newFinal).trim()
            transcriptRef.current = updated
            setTranscript(updated)
          }
        }

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          if (event.error !== 'no-speech' && event.error !== 'aborted') {
            setSpeechError(`Speech recognition: ${event.error}`)
          }
        }

        recognition.start()
        recognitionRef.current = recognition
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream

      const audioContext = new AudioContext()
      const analyser = audioContext.createAnalyser()
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.8
      audioContextRef.current = audioContext
      analyserRef.current = analyser

      const dataArray = new Uint8Array(analyser.frequencyBinCount)

      audioIntervalRef.current = setInterval(() => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray)
          const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
          setAudioLevel(Math.min(1, average / 128))
        }
      }, 100)
    } catch (err) {
      setSpeechError(err instanceof Error ? err.message : 'Could not access microphone')
      setAudioLevel(0.3)
    }
  }, [])

  const stopRecording = useCallback(() => {
    setIsRecording(false)

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (audioIntervalRef.current) {
      clearInterval(audioIntervalRef.current)
      audioIntervalRef.current = null
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop())
      mediaStreamRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    analyserRef.current = null
    setAudioLevel(0)
  }, [])

  const handleSave = useCallback(() => {
    const finalTranscript = (transcriptRef.current || transcript).trim()
    if (!finalTranscript && SpeechRecognition) {
      setSpeechError('No speech detected. Try recording again or speak closer to the microphone.')
      return
    }

    setCurrentJournalEntry({
      id: Date.now().toString(),
      date: new Date(),
      transcript: finalTranscript || '[Voice recording - transcription not available in this browser]',
      duration,
    })

    setScreen('journal-reflection')
  }, [transcript, duration, setCurrentJournalEntry, setScreen])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current)
      if (recognitionRef.current) recognitionRef.current.abort()
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop())
      }
      if (audioContextRef.current) audioContextRef.current.close()
    }
  }, [])

  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between">
        <button
          onClick={() => {
            stopRecording()
            setScreen('journal')
          }}
          className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {isRecording ? 'Recording' : 'Voice Journal'}
          </p>
          <p className="font-medium text-foreground font-mono">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </p>
        </div>
        <div className="w-10" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Recording Visualization */}
        <div className="relative mb-8">
          {/* Outer ring */}
          <div
            className="absolute inset-0 rounded-full border-4 border-primary/20 transition-transform duration-100"
            style={{
              transform: `scale(${1 + audioLevel * 0.3})`,
            }}
          />
          {/* Middle ring */}
          <div
            className="absolute inset-4 rounded-full border-4 border-primary/30 transition-transform duration-100"
            style={{
              transform: `scale(${1 + audioLevel * 0.2})`,
            }}
          />
          {/* Inner orb */}
          <div
            className="w-40 h-40 rounded-full flex items-center justify-center transition-all duration-100"
            style={{
              background: isRecording
                ? 'radial-gradient(circle at 30% 30%, oklch(0.88 0.06 60 / 0.9), oklch(0.55 0.12 35 / 0.8))'
                : 'radial-gradient(circle at 30% 30%, oklch(0.88 0.06 60 / 0.5), oklch(0.55 0.12 35 / 0.4))',
              boxShadow: isRecording
                ? '0 0 60px oklch(0.55 0.12 35 / 0.4), 0 0 100px oklch(0.55 0.12 35 / 0.2)'
                : '0 0 30px oklch(0.55 0.12 35 / 0.2)',
              transform: `scale(${1 + audioLevel * 0.1})`,
            }}
          >
            <Mic className={`w-12 h-12 ${isRecording ? 'text-primary-foreground' : 'text-primary'}`} />
          </div>
        </div>

        {/* Instructions / Transcript Preview */}
        <div className="text-center max-w-[300px]">
          {!SpeechRecognition && (
            <p className="text-amber-600 dark:text-amber-500 text-sm mb-4">
              Voice transcription works best in Chrome or Edge. Other browsers will record but not transcribe.
            </p>
          )}
          {speechError && (
            <p className="text-destructive text-sm mb-4">{speechError}</p>
          )}
          {!isRecording && duration === 0 && (
            <div className="animate-fade-in-up">
              <h2 className="font-serif text-2xl font-medium text-foreground mb-2">
                Ready when you are
              </h2>
              <p className="text-muted-foreground">
                Tap the button below and speak freely about {"what's"} on your mind.
              </p>
            </div>
          )}

          {isRecording && (
            <div className="animate-fade-in-up">
              <h2 className="font-serif text-xl font-medium text-foreground mb-2">
                {"I'm listening..."}
              </h2>
              <p className="text-muted-foreground text-sm">
                {transcript ? `"${transcript.slice(-80)}..."` : 'Speak freely'}
              </p>
            </div>
          )}

          {!isRecording && duration > 0 && (
            <div className="animate-fade-in-up">
              <h2 className="font-serif text-xl font-medium text-foreground mb-2">
                Recording complete
              </h2>
              <p className="text-muted-foreground text-sm">
                {transcript ? `"${transcript.slice(0, 100)}${transcript.length > 100 ? '...' : ''}"` : 'No speech detected.'}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Controls */}
      <div className="px-6 py-8">
        {!isRecording && duration === 0 && (
          <Button
            onClick={startRecording}
            className="w-full h-14 text-lg font-medium rounded-2xl gap-3"
          >
            <Mic className="w-5 h-5" />
            Start Recording
          </Button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="w-20 h-20 mx-auto rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-lg"
            aria-label="Stop recording"
          >
            <Square className="w-8 h-8" fill="currentColor" />
          </button>
        )}

        {!isRecording && duration > 0 && (
          <div className="space-y-3">
            <Button
              onClick={handleSave}
              className="w-full h-14 text-lg font-medium rounded-2xl gap-3"
            >
              <Check className="w-5 h-5" />
              Save & Get Reflection
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setDuration(0)
                setTranscript('')
              }}
              className="w-full h-12 text-muted-foreground"
            >
              Record Again
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
