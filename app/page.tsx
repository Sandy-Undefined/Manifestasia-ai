"use client"

import type { AppScreen } from '@/lib/app-context'
import { AppProvider, useApp } from '@/lib/app-context'

// Import all screens
import { WelcomeScreen } from '@/components/screens/welcome-screen'
import { LoginScreen } from '@/components/screens/login-screen'
import { SignupScreen } from '@/components/screens/signup-screen'
import { OnboardingIntroScreen } from '@/components/screens/onboarding/intro-screen'
import { OnboardingAreasScreen } from '@/components/screens/onboarding/areas-screen'
import { OnboardingEmotionalScreen } from '@/components/screens/onboarding/emotional-screen'
import { OnboardingIntentionsScreen } from '@/components/screens/onboarding/intentions-screen'
import { OnboardingChallengesScreen } from '@/components/screens/onboarding/challenges-screen'
import { RoadmapScreen } from '@/components/screens/onboarding/roadmap-screen'
import { HomeScreen } from '@/components/screens/home-screen'
import { PracticeScreen } from '@/components/screens/practice-screen'
import { BreathworkScreen } from '@/components/screens/breathwork-screen'
import { VisualizationScreen } from '@/components/screens/visualization-screen'
import { JournalScreen } from '@/components/screens/journal-screen'
import { JournalRecordingScreen } from '@/components/screens/journal-recording-screen'
import { JournalReflectionScreen } from '@/components/screens/journal-reflection-screen'
import { ProgressScreen } from '@/components/screens/progress-screen'
import { WeeklySummaryScreen } from '@/components/screens/weekly-summary-screen'
import { VisionGeneratorScreen } from '@/components/screens/vision-generator-screen'
import { VisionGalleryScreen } from '@/components/screens/vision-gallery-screen'
import { ScriptingStudioScreen } from '@/components/screens/scripting-studio-screen'
import { EvidenceTrackerScreen } from '@/components/screens/evidence-tracker-screen'
import { SatsBedtimeScreen } from '@/components/screens/sats-bedtime-screen'
import { VisionBoardScreen } from '@/components/screens/vision-board-screen'
import { EveningRitualScreen } from '@/components/screens/evening-ritual-screen'
import { InnerConversationsScreen } from '@/components/screens/inner-conversations-screen'
import { LearningModulesScreen } from '@/components/screens/learning-modules-screen'
import { SettingsScreen } from '@/components/screens/settings-screen'
import { UpgradePrompt } from '@/components/upgrade-prompt'
import { DisclaimerModal } from '@/components/disclaimer-modal'
import { ToolsFab } from '@/components/tools-fab'

function AppContent() {
  const { currentScreen, showUpgradePrompt, setShowUpgradePrompt, user, authLoading } = useApp()

  if (authLoading) {
    return (
      <div className="mobile-container bg-background flex flex-col items-center justify-center min-h-dvh">
        <div className="breathing-orb w-24 h-24 mb-4" />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    )
  }

  const screens: Partial<Record<AppScreen, React.ReactNode>> = {
    'welcome': <WelcomeScreen />,
    'login': <LoginScreen />,
    'signup': <SignupScreen />,
    'onboarding-intro': <OnboardingIntroScreen />,
    'onboarding-areas': <OnboardingAreasScreen />,
    'onboarding-emotional': <OnboardingEmotionalScreen />,
    'onboarding-intentions': <OnboardingIntentionsScreen />,
    'onboarding-challenges': <OnboardingChallengesScreen />,
    'roadmap': <RoadmapScreen />,
    'home': <HomeScreen />,
    'practice': <PracticeScreen />,
    'breathwork': <BreathworkScreen />,
    'visualization': <VisualizationScreen />,
    'journal': <JournalScreen />,
    'journal-recording': <JournalRecordingScreen />,
    'journal-reflection': <JournalReflectionScreen />,
    'progress': <ProgressScreen />,
    'weekly-summary': <WeeklySummaryScreen />,
    'vision-generator': <VisionGeneratorScreen />,
    'vision-gallery': <VisionGalleryScreen />,
    'scripting-studio': <ScriptingStudioScreen />,
    'evidence-tracker': <EvidenceTrackerScreen />,
    'sats-bedtime': <SatsBedtimeScreen />,
    'vision-board': <VisionBoardScreen />,
    'evening-ritual': <EveningRitualScreen />,
    'inner-conversations': <InnerConversationsScreen />,
    'learning-modules': <LearningModulesScreen />,
    'settings': <SettingsScreen />,
  }

  const preAuthScreens = ['welcome', 'login', 'signup', 'onboarding-intro', 'onboarding-areas', 'onboarding-emotional', 'onboarding-intentions', 'onboarding-challenges', 'roadmap']
  const showFab = user && !preAuthScreens.includes(currentScreen)

  return (
    <div className="mobile-container bg-background">
      {(screens[currentScreen] ?? <WelcomeScreen />)}
      {showFab && <ToolsFab />}
      {showUpgradePrompt && <UpgradePrompt onClose={() => setShowUpgradePrompt(false)} />}
      {user && !user.hasAcceptedDisclaimer && currentScreen === 'home' && <DisclaimerModal />}
    </div>
  )
}

export default function Page() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
