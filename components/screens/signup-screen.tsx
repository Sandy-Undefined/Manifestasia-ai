"use client"

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'

export function SignupScreen() {
  const { setScreen, signUp } = useApp()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isValid = name.trim().length > 0 && email.includes('@') && password.length >= 6

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    setError(null)
    setIsLoading(true)
    try {
      await signUp(email.trim(), password, name.trim())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background px-6 py-8">
      <button
        onClick={() => setScreen('welcome')}
        className="flex items-center gap-2 text-muted-foreground mb-8 -ml-1"
        aria-label="Go back to welcome screen"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="mb-10 animate-fade-in-up">
        <h1 className="font-serif text-3xl font-medium text-foreground mb-2">
          Create your account
        </h1>
        <p className="text-muted-foreground">
          Sign up first, then we personalize your onboarding
        </p>
      </div>

      <form onSubmit={handleSignup} className="flex-1 flex flex-col">
        <div className="space-y-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="space-y-2">
            <Label htmlFor="signup-name" className="text-foreground font-medium">
              Name
            </Label>
            <Input
              id="signup-name"
              type="text"
              placeholder="Your first name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-14 text-lg rounded-xl bg-card border-border"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email" className="text-foreground font-medium">
              Email
            </Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 text-lg rounded-xl bg-card border-border"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password" className="text-foreground font-medium">
              Password
            </Label>
            <Input
              id="signup-password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-14 text-lg rounded-xl bg-card border-border"
              minLength={6}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <div className="mt-auto space-y-4 pt-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Button
            type="submit"
            disabled={isLoading || !isValid}
            className="w-full h-14 text-lg font-medium rounded-2xl"
          >
            {isLoading ? 'Creating account...' : 'Continue'}
          </Button>
          <p className="text-center text-muted-foreground text-sm">
            Already have an account?{' '}
            <button type="button" onClick={() => setScreen('login')} className="text-primary font-medium">
              Sign in
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}
