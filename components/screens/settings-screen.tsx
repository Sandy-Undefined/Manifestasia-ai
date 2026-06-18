"use client"

import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { BackButton } from '@/components/ui/back-button'
import { ArrowLeft, LogOut } from 'lucide-react'

export function SettingsScreen() {
  const { setScreen, logout, user } = useApp()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <header className="px-6 pt-8 pb-4 flex items-center justify-between">
        <BackButton onClick={() => setScreen('home')}>
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </BackButton>
        <h1 className="font-serif text-lg font-medium text-foreground">Settings</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 px-6 pb-6">
        <div className="space-y-4">
          {user && (
            <div className="bg-card rounded-2xl p-5 border border-border">
              <p className="text-sm text-muted-foreground">Signed in as</p>
              <p className="font-medium text-foreground">{user.email}</p>
            </div>
          )}

          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full h-12 rounded-xl gap-2 text-destructive border-destructive/50 hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </main>
    </div>
  )
}
