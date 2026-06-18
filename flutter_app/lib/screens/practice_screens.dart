import 'dart:async';

import 'package:flutter/material.dart';

import '../core/app_text_styles.dart';
import '../models/app_screen.dart';
import '../state/app_state.dart';
import '../widgets/common_widgets.dart';
import '../widgets/responsive_page.dart';

class PracticeScreen extends StatelessWidget {
  const PracticeScreen({super.key, required this.state});

  final AppState state;

  @override
  Widget build(BuildContext context) {
    return NativeListScreen(
      title: 'Morning Ritual',
      empty: 'Choose a step to begin.',
      items: const [
        'Breathwork',
        'Visualization',
        'Journal',
        'AI Vision Generator',
      ],
      onBack: () => state.go(AppScreen.home),
      onItemTap: (item) {
        switch (item) {
          case 'Breathwork':
            state.go(AppScreen.breathwork);
          case 'Visualization':
            state.go(AppScreen.visualization);
          case 'Journal':
            state.go(AppScreen.journal);
          default:
            state.go(AppScreen.visionGenerator);
        }
      },
    );
  }
}

class BreathworkScreen extends StatefulWidget {
  const BreathworkScreen({super.key, required this.state});

  final AppState state;

  @override
  State<BreathworkScreen> createState() => _BreathworkScreenState();
}

class _BreathworkScreenState extends State<BreathworkScreen> {
  static const phases = ['Inhale', 'Hold', 'Exhale', 'Rest'];
  int seconds = 0;
  Timer? timer;

  @override
  void dispose() {
    timer?.cancel();
    super.dispose();
  }

  void toggle() {
    if (timer == null) {
      timer = Timer.periodic(
        const Duration(seconds: 1),
        (_) => setState(() => seconds++),
      );
    } else {
      timer?.cancel();
      timer = null;
    }
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    final phase = phases[(seconds ~/ 4) % phases.length];
    return ResponsivePage(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Align(
          alignment: Alignment.centerLeft,
          child: BackTextButton(
            onPressed: () => widget.state.go(AppScreen.home),
          ),
        ),
        const SizedBox(height: 42),
        BreathingOrb(size: phase == 'Inhale' ? 230 : 170),
        const SizedBox(height: 32),
        Text(phase, style: screenTitle, textAlign: TextAlign.center),
        const SizedBox(height: 6),
        Text(
          '${seconds ~/ 60}:${(seconds % 60).toString().padLeft(2, '0')}',
          style: subtitleStyle,
        ),
        const SizedBox(height: 42),
        PrimaryButton(
          label: timer == null ? 'Start breathing' : 'Pause',
          onPressed: toggle,
        ),
        TextButton(
          onPressed: () {
            widget.state.addSession();
            widget.state.go(AppScreen.journal);
          },
          child: const Text('Complete and journal'),
        ),
      ],
    );
  }
}

class GuidedTextScreen extends StatelessWidget {
  const GuidedTextScreen({
    super.key,
    required this.title,
    required this.subtitle,
    required this.paragraphs,
    required this.primaryLabel,
    required this.onPrimary,
    required this.onBack,
  });

  factory GuidedTextScreen.visualization({required AppState state}) {
    return GuidedTextScreen(
      title: 'Visualization',
      subtitle: 'Assume the feeling of your wish fulfilled.',
      paragraphs: const [
        'Close your eyes and enter the scene that implies your desire is already real.',
        'Notice where you are, who is with you, what you hear, and what feels naturally true.',
        'Rest in the fulfilled state for a few minutes. Let it become familiar.',
      ],
      primaryLabel: 'Complete practice',
      onPrimary: () {
        state.addSession();
        state.go(AppScreen.home);
      },
      onBack: () => state.go(AppScreen.home),
    );
  }

  factory GuidedTextScreen.sats({required AppState state}) {
    return GuidedTextScreen(
      title: 'SATS Bedtime Mode',
      subtitle: 'Drift into sleep from the wish fulfilled.',
      paragraphs: const [
        'Slow your breathing and let your body become heavy.',
        'Replay one short fulfilled scene again and again.',
        'Keep it simple. Let the feeling carry you toward sleep.',
      ],
      primaryLabel: 'Finish',
      onPrimary: () {
        state.addSession();
        state.go(AppScreen.home);
      },
      onBack: () => state.go(AppScreen.home),
    );
  }

  factory GuidedTextScreen.eveningRitual({required AppState state}) {
    return GuidedTextScreen(
      title: 'Evening Ritual',
      subtitle: 'Gratitude, revision, and release.',
      paragraphs: const [
        'Name three moments you can appreciate from today.',
        'Revise one moment by imagining it ending in your favor.',
        'Release the day and return to the identity you are choosing.',
      ],
      primaryLabel: 'Open SATS',
      onPrimary: () => state.go(AppScreen.sats),
      onBack: () => state.go(AppScreen.home),
    );
  }

  factory GuidedTextScreen.conversations({required AppState state}) {
    return GuidedTextScreen(
      title: 'Inner Conversations',
      subtitle: 'Practice hearing support from the future you.',
      paragraphs: const [
        'Ask your future self what assumption would change today.',
        'Answer in a calm, certain voice. Keep it short and believable.',
      ],
      primaryLabel: 'Return home',
      onPrimary: () => state.go(AppScreen.home),
      onBack: () => state.go(AppScreen.home),
    );
  }

  final String title;
  final String subtitle;
  final List<String> paragraphs;
  final String primaryLabel;
  final VoidCallback onPrimary;
  final VoidCallback onBack;

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
        for (final paragraph in paragraphs)
          InfoCard(child: Text(paragraph, style: bodyStyle)),
        const SizedBox(height: 28),
        PrimaryButton(label: primaryLabel, onPressed: onPrimary),
      ],
    );
  }
}

class NativeListScreen extends StatelessWidget {
  const NativeListScreen({
    super.key,
    required this.title,
    required this.empty,
    required this.items,
    required this.onBack,
    this.onItemTap,
  });

  final String title;
  final String empty;
  final List<String> items;
  final VoidCallback onBack;
  final ValueChanged<String>? onItemTap;

  @override
  Widget build(BuildContext context) {
    return ResponsivePage(
      children: [
        BackTextButton(onPressed: onBack),
        const SizedBox(height: 18),
        Text(title, style: screenTitle),
        const SizedBox(height: 20),
        NativeListBody(items: items, empty: empty, onItemTap: onItemTap),
      ],
    );
  }
}

class NativeListBody extends StatelessWidget {
  const NativeListBody({
    super.key,
    required this.items,
    required this.empty,
    this.onItemTap,
  });

  final List<String> items;
  final String empty;
  final ValueChanged<String>? onItemTap;

  @override
  Widget build(BuildContext context) {
    if (items.isEmpty) {
      return Padding(
        padding: const EdgeInsets.symmetric(vertical: 48),
        child: Center(
          child: Text(empty, style: subtitleStyle, textAlign: TextAlign.center),
        ),
      );
    }

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        for (final item in items)
          ActionTile(
            icon: Icons.circle_outlined,
            title: item,
            subtitle: '',
            onTap: onItemTap == null ? null : () => onItemTap!(item),
          ),
      ],
    );
  }
}
