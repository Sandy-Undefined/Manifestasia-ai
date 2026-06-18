import 'package:flutter/material.dart';

import '../core/app_theme.dart';
import '../models/app_screen.dart';
import '../screens/auth_screen.dart';
import '../screens/capture_screens.dart';
import '../screens/email_otp_screen.dart';
import '../screens/home_screen.dart';
import '../screens/learning_modules_screen.dart';
import '../screens/onboarding_screens.dart';
import '../screens/practice_screens.dart';
import '../screens/progress_screen.dart';
import '../screens/setup_screen.dart';
import '../screens/settings_screen.dart';
import '../screens/vision_generator_screen.dart';
import '../screens/welcome_screen.dart';
import '../state/app_state.dart';
import '../widgets/app_shell.dart';

class ManifestasiaApp extends StatefulWidget {
  const ManifestasiaApp({super.key});

  @override
  State<ManifestasiaApp> createState() => _ManifestasiaAppState();
}

class _ManifestasiaAppState extends State<ManifestasiaApp> {
  late final AppState appState;

  @override
  void initState() {
    super.initState();
    appState = AppState();
    appState.initialize();
  }

  @override
  void dispose() {
    appState.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AppStateScope(
      state: appState,
      child: AnimatedBuilder(
        animation: appState,
        builder: (context, _) {
          return MaterialApp(
            title: 'Manifestasia',
            debugShowCheckedModeBanner: false,
            theme: buildAppTheme(),
            home: appState.loading
                ? const LoadingScreen()
                : AppShell(state: appState, child: _buildScreen(appState)),
          );
        },
      ),
    );
  }

  Widget _buildScreen(AppState state) {
    if (!state.supabaseReady) return const SetupRequiredScreen();

    switch (state.screen) {
      case AppScreen.welcome:
        return WelcomeScreen(
          onLogin: () => state.go(AppScreen.login),
          onSignup: () => state.go(AppScreen.signup),
        );
      case AppScreen.login:
        return AuthScreen(
          mode: AuthMode.login,
          error: state.authError,
          notice: state.authNotice,
          onResendConfirmation: state.pendingConfirmationEmail == null
              ? null
              : state.resendConfirmationEmail,
          onBack: () => state.go(AppScreen.welcome),
          onSwitch: () => state.go(AppScreen.signup),
          onLogin: state.signIn,
          onSignup: state.signUp,
        );
      case AppScreen.signup:
        return AuthScreen(
          mode: AuthMode.signup,
          error: state.authError,
          notice: state.authNotice,
          onResendConfirmation: null,
          onBack: () => state.go(AppScreen.welcome),
          onSwitch: () => state.go(AppScreen.login),
          onLogin: state.signIn,
          onSignup: state.signUp,
        );
      case AppScreen.emailOtp:
        return EmailOtpScreen(
          email: state.pendingConfirmationEmail ?? '',
          error: state.authError,
          notice: state.authNotice,
          onBack: () => state.go(AppScreen.signup),
          onVerify: state.verifySignupOtp,
          onResend: state.resendConfirmationEmail,
        );
      case AppScreen.onboardingIntro:
        return IntroScreen(onNext: () => state.go(AppScreen.onboardingAreas));
      case AppScreen.onboardingAreas:
        return AreasScreen(state: state);
      case AppScreen.onboardingEmotional:
        return EmotionalScreen(state: state);
      case AppScreen.onboardingIntentions:
        return IntentionsScreen(state: state);
      case AppScreen.onboardingChallenges:
        return ChallengesScreen(state: state);
      case AppScreen.roadmap:
        return RoadmapScreen(onComplete: state.completeOnboarding);
      case AppScreen.home:
        return HomeScreen(state: state);
      case AppScreen.practice:
        return PracticeScreen(state: state);
      case AppScreen.breathwork:
        return BreathworkScreen(state: state);
      case AppScreen.visualization:
        return GuidedTextScreen.visualization(state: state);
      case AppScreen.journal:
        return TextCaptureScreen(
          title: 'Voice Journal',
          hint: 'Write what you noticed, felt, or assumed today.',
          items: state.journalNotes,
          onAdd: state.addJournalNote,
          onBack: () => state.go(AppScreen.home),
        );
      case AppScreen.progress:
        return ProgressScreen(state: state);
      case AppScreen.visionGenerator:
        return VisionGeneratorScreen(state: state);
      case AppScreen.scripting:
        return TextCaptureScreen(
          title: 'Scripting Studio',
          hint:
              "Write from the version of you who already has what you desire. Use first person, present tense. Describe your day, your feelings, your life - as if it's already real.",
          items: state.scripts,
          onAdd: state.addScript,
          onBack: () => state.go(AppScreen.home),
        );
      case AppScreen.evidence:
        return TextCaptureScreen(
          title: 'Evidence Tracker',
          hint:
              'Log any sign, movement, synchronicity, or shift that feels like confirmation your desire is already on its way to you.',
          items: state.evidenceItems,
          onAdd: state.addEvidence,
          onBack: () => state.go(AppScreen.home),
        );
      case AppScreen.sats:
        return GuidedTextScreen.sats(state: state);
      case AppScreen.visionBoard:
        return NativeListScreen(
          title: 'Vision Board',
          empty: 'Generated visions and chosen prompts will appear here.',
          items: state.localVisionPrompts,
          onBack: () => state.go(AppScreen.home),
        );
      case AppScreen.eveningRitual:
        return GuidedTextScreen.eveningRitual(state: state);
      case AppScreen.conversations:
        return GuidedTextScreen.conversations(state: state);
      case AppScreen.learning:
        return LearningModulesScreen(state: state);
      case AppScreen.learningModule:
        return LearningModuleDetailScreen(state: state);
      case AppScreen.settings:
        return SettingsScreen(state: state);
    }
  }
}
