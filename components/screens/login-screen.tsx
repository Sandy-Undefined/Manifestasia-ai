"use client"

import React from "react"

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'
import { resetPassword } from '@/lib/auth'

export function LoginScreen() {
  const { setScreen, signIn } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      await signIn(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Enter your email first, then tap Forgot password')
      return
    }
    setError(null)
    setIsLoading(true)
    try {
      await resetPassword(email)
      setForgotPasswordSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background px-6 py-8">
      {/* Header */}
      <button
        onClick={() => setScreen('welcome')}
        className="flex items-center gap-2 text-muted-foreground mb-8 -ml-1"
        aria-label="Go back to welcome screen"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      {/* Title */}
      <div className="mb-10 animate-fade-in-up">
        <h1 className="font-serif text-3xl font-medium text-foreground mb-2">
          Welcome back
        </h1>
        <p className="text-muted-foreground">
          Continue your mindset journey
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="flex-1 flex flex-col">
        <div className="space-y-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 text-lg rounded-xl bg-card border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-14 text-lg rounded-xl bg-card border-border"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          {forgotPasswordSent ? (
            <p className="text-sm text-primary">Check your email for a password reset link.</p>
          ) : (
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={isLoading}
              className="text-primary text-sm font-medium"
            >
              Forgot password?
            </button>
          )}
        </div>

        <div className="mt-auto space-y-4 pt-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full h-14 text-lg font-medium rounded-2xl"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>

          <p className="text-center text-muted-foreground text-sm">
            {"Don't have an account? "}
            <button
              type="button"
              onClick={() => setScreen('signup')}
              className="text-primary font-medium"
            >
              Get started
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}
