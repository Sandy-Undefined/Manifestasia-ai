import 'package:flutter/material.dart';

import '../core/app_text_styles.dart';
import '../data/onboarding_data.dart';
import '../models/app_screen.dart';
import '../state/app_state.dart';
import '../widgets/common_widgets.dart';
import '../widgets/responsive_page.dart';

class IntroScreen extends StatelessWidget {
  const IntroScreen({super.key, required this.onNext});

  final VoidCallback onNext;

  @override
  Widget build(BuildContext context) {
    return ResponsivePage(
      children: [
        const BreathingOrb(size: 120),
        const SizedBox(height: 32),
        const Text("Let's personalize your experience", style: screenTitle),
        const SizedBox(height: 12),
        const Text(
          'A few quick choices help Manifestasia shape your daily rituals, prompts, and progress.',
          style: subtitleStyle,
        ),
        const SizedBox(height: 56),
        PrimaryButton(label: 'Begin', onPressed: onNext),
      ],
    );
  }
}

class AreasScreen extends StatelessWidget {
  const AreasScreen({super.key, required this.state});

  final AppState state;

  @override
  Widget build(BuildContext context) {
    return SelectionScreen(
      title: 'What areas of life are you manifesting?',
      subtitle: 'Choose the themes you want your practice to support.',
      options: OnboardingData.lifeAreas,
      selected: state.selectedAreas,
      onBack: () => state.go(AppScreen.onboardingIntro),
      onNext: () => state.go(AppScreen.onboardingEmotional),
    );
  }
}

class EmotionalScreen extends StatelessWidget {
  const EmotionalScreen({super.key, required this.state});

  final AppState state;

  @override
  Widget build(BuildContext context) {
    return SingleSelectionScreen(
      title: 'How do you want to feel?',
      subtitle: 'Pick the emotional state you want to practice embodying.',
      options: OnboardingData.emotions,
      selected: state.selectedEmotion,
      onChanged: state.setEmotion,
      onBack: () => state.go(AppScreen.onboardingAreas),
      onNext: () => state.go(AppScreen.onboardingIntentions),
    );
  }
}

class IntentionsScreen extends StatelessWidget {
  const IntentionsScreen({super.key, required this.state});

  final AppState state;

  @override
  Widget build(BuildContext context) {
    return SelectionScreen(
      title: 'Set your intentions',
      subtitle: 'These guide your daily ritual prompts.',
      options: OnboardingData.intentions,
      selected: state.selectedIntentions,
      onBack: () => state.go(AppScreen.onboardingEmotional),
      onNext: () => state.go(AppScreen.onboardingChallenges),
    );
  }
}

class ChallengesScreen extends StatelessWidget {
  const ChallengesScreen({super.key, required this.state});

  final AppState state;

  @override
  Widget build(BuildContext context) {
    return SelectionScreen(
      title: 'What gets in the way?',
      subtitle: 'We will help you work gently with these patterns.',
      options: OnboardingData.challenges,
      selected: state.selectedChallenges,
      onBack: () => state.go(AppScreen.onboardingIntentions),
      onNext: () => state.go(AppScreen.roadmap),
    );
  }
}

class SelectionScreen extends StatelessWidget {
  const SelectionScreen({
    super.key,
    required this.title,
    required this.subtitle,
    required this.options,
    required this.selected,
    required this.onBack,
    required this.onNext,
  });

  final String title;
  final String subtitle;
  final List<String> options;
  final Set<String> selected;
  final VoidCallback onBack;
  final VoidCallback onNext;

  @override
  Widget build(BuildContext context) {
    return ResponsivePage(
      children: [
        BackTextButton(onPressed: onBack),
        const SizedBox(height: 24),
        Text(title, style: screenTitle),
        const SizedBox(height: 8),
        Text(subtitle, style: subtitleStyle),
        const SizedBox(height: 24),
        ...options.map(
          (option) => Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: SelectableTile(
              title: option,
              selected: selected.contains(option),
              onTap: () =>
                  AppStateScope.of(context).toggleSelection(selected, option),
            ),
          ),
        ),
        const SizedBox(height: 20),
        PrimaryButton(
          label: 'Continue',
          onPressed: selected.isEmpty ? null : onNext,
        ),
      ],
    );
  }
}

class SingleSelectionScreen extends StatelessWidget {
  const SingleSelectionScreen({
    super.key,
    required this.title,
    required this.subtitle,
    required this.options,
    required this.selected,
    required this.onChanged,
    required this.onBack,
    required this.onNext,
  });

  final String title;
  final String subtitle;
  final List<String> options;
  final String? selected;
  final ValueChanged<String> onChanged;
  final VoidCallback onBack;
  final VoidCallback onNext;

  @override
  Widget build(BuildContext context) {
    return ResponsivePage(
      children: [
        BackTextButton(onPressed: onBack),
        const SizedBox(height: 24),
        Text(title, style: screenTitle),
        const SizedBox(height: 8),
        Text(subtitle, style: subtitleStyle),
        const SizedBox(height: 24),
        ...options.map(
          (option) => Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: SelectableTile(
              title: option,
              selected: selected == option,
              onTap: () => onChanged(option),
            ),
          ),
        ),
        const SizedBox(height: 20),
        PrimaryButton(
          label: 'Continue',
          onPressed: selected == null ? null : onNext,
        ),
      ],
    );
  }
}

class RoadmapScreen extends StatelessWidget {
  const RoadmapScreen({super.key, required this.onComplete});

  final Future<void> Function() onComplete;

  @override
  Widget build(BuildContext context) {
    return ResponsivePage(
      children: [
        const Text('Your daily roadmap', style: screenTitle),
        const SizedBox(height: 12),
        const Text(
          'Start simple: breathe, visualize, journal, and notice evidence.',
          style: subtitleStyle,
        ),
        const SizedBox(height: 30),
        const RoadmapStep(
          icon: Icons.air,
          title: 'Ground',
          subtitle: 'Use breathwork to settle the nervous system.',
        ),
        const RoadmapStep(
          icon: Icons.auto_awesome,
          title: 'Assume',
          subtitle: 'Practice the feeling of the wish fulfilled.',
        ),
        const RoadmapStep(
          icon: Icons.edit_note,
          title: 'Integrate',
          subtitle: 'Journal, script, and track evidence.',
        ),
        const SizedBox(height: 34),
        PrimaryButton(label: 'Enter Manifestasia', onPressed: onComplete),
      ],
    );
  }
}

class RoadmapStep extends StatelessWidget {
  const RoadmapStep({
    super.key,
    required this.icon,
    required this.title,
    required this.subtitle,
  });

  final IconData icon;
  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return InfoCard(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: Theme.of(context).colorScheme.primary),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontWeight: FontWeight.w700,
                    fontSize: 17,
                  ),
                ),
                Text(subtitle, style: subtitleStyle),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
