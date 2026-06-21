import 'dart:async';

import 'package:flutter/material.dart';

import '../core/app_colors.dart';
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

enum _EveningRitualStep { intro, gratitude, revision, release, complete }

class EveningRitualScreen extends StatefulWidget {
  const EveningRitualScreen({super.key, required this.state});

  final AppState state;

  @override
  State<EveningRitualScreen> createState() => _EveningRitualScreenState();
}

class _EveningRitualScreenState extends State<EveningRitualScreen> {
  static const _gratitudePrompts = [
    'What is one thing that went well today?',
    'Who made you smile today?',
    'What small moment brought you peace?',
    'What are you thankful for right now?',
    'What progress did you notice today?',
  ];

  static const _revisionPrompts = [
    'Was there a moment today you would like to revise?',
    'Rewrite any challenging moment as you wished it happened.',
    'If you could replay one scene differently, what would it look like?',
  ];

  static const _releaseOptions = [
    'Worry about tomorrow',
    'Self-doubt',
    'Need for control',
    'Comparison to others',
    'Fear of failure',
    'Attachment to outcome',
  ];

  static const _background = Color(0xFF1D202B);
  static const _card = Color(0xFF2A2D3A);
  static const _border = Color(0xFF424656);
  static const _text = Color(0xFFF0EEF7);
  static const _muted = Color(0xFFA9A7B8);
  static const _accent = Color(0xFF8D82D8);

  final gratitudeController = TextEditingController();
  final revisionController = TextEditingController();
  final customReleaseController = TextEditingController();
  final releaseItems = <String>{};
  var step = _EveningRitualStep.intro;

  String get gratitudePrompt =>
      _gratitudePrompts[DateTime.now().weekday % _gratitudePrompts.length];

  String get revisionPrompt =>
      _revisionPrompts[DateTime.now().weekday % _revisionPrompts.length];

  @override
  void dispose() {
    gratitudeController.dispose();
    revisionController.dispose();
    customReleaseController.dispose();
    super.dispose();
  }

  void _goTo(_EveningRitualStep next) {
    FocusManager.instance.primaryFocus?.unfocus();
    setState(() => step = next);
  }

  void _toggleRelease(String item) {
    setState(() {
      if (releaseItems.contains(item)) {
        releaseItems.remove(item);
      } else {
        releaseItems.add(item);
      }
    });
  }

  void _addCustomRelease() {
    final value = customReleaseController.text.trim();
    if (value.isEmpty) return;
    _toggleRelease(value);
    customReleaseController.clear();
  }

  void _complete() {
    widget.state.addSession();
    _goTo(_EveningRitualStep.complete);
  }

  @override
  Widget build(BuildContext context) {
    if (step == _EveningRitualStep.complete) {
      return _EveningScaffold(
        onClose: () => widget.state.go(AppScreen.home),
        showHeader: false,
        children: [
          const Spacer(),
          const Icon(Icons.nightlight_round, color: _accent, size: 68),
          const SizedBox(height: 28),
          const Text(
            'Evening complete',
            style: TextStyle(
              color: _text,
              fontSize: 30,
              fontWeight: FontWeight.w700,
              height: 1.15,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 12),
          const Text(
            "You've released the day and planted seeds for tomorrow. Rest well knowing all is unfolding perfectly.",
            style: TextStyle(color: _muted, fontSize: 16, height: 1.42),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 28),
          const _EveningCard(
            child: Text(
              '"Assume the feeling of your wish fulfilled and observe the route that your attention follows."\n\n- Neville Goddard',
              style: TextStyle(
                color: _muted,
                fontSize: 14,
                fontStyle: FontStyle.italic,
                height: 1.42,
              ),
              textAlign: TextAlign.center,
            ),
          ),
          const Spacer(),
          _EveningButton(
            label: 'Continue to SATS',
            icon: Icons.nightlight_round,
            onPressed: () => widget.state.go(AppScreen.sats),
          ),
          TextButton(
            onPressed: () => widget.state.go(AppScreen.home),
            child: const Text('Return Home', style: TextStyle(color: _muted)),
          ),
        ],
      );
    }

    return _EveningScaffold(
      onClose: () => widget.state.go(AppScreen.home),
      children: [
        if (step == _EveningRitualStep.intro) _buildIntro(),
        if (step == _EveningRitualStep.gratitude) _buildGratitude(),
        if (step == _EveningRitualStep.revision) _buildRevision(),
        if (step == _EveningRitualStep.release) _buildRelease(),
      ],
    );
  }

  Widget _buildIntro() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const SizedBox(height: 20),
        Container(
          width: 82,
          height: 82,
          decoration: BoxDecoration(
            color: _accent.withValues(alpha: 0.15),
            shape: BoxShape.circle,
          ),
          child: const Icon(Icons.nightlight_round, color: _accent, size: 42),
        ),
        const SizedBox(height: 24),
        const Text(
          'Time to Wind Down',
          style: TextStyle(
            color: _text,
            fontSize: 27,
            fontWeight: FontWeight.w700,
            height: 1.15,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 10),
        const Text(
          "Tonight's ritual includes gratitude, revision, and release. About 5 minutes.",
          style: TextStyle(color: _muted, fontSize: 16, height: 1.42),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 28),
        const _EveningStepCard(
          icon: Icons.favorite_border,
          title: 'Gratitude',
          subtitle: 'Give thanks for today',
        ),
        const _EveningStepCard(
          icon: Icons.edit_note,
          title: 'Revision',
          subtitle: 'Rewrite what needs rewriting',
        ),
        const _EveningStepCard(
          icon: Icons.auto_awesome,
          title: 'Release',
          subtitle: 'Let go and surrender',
        ),
        const SizedBox(height: 18),
        _EveningButton(
          label: 'Begin Evening Ritual',
          onPressed: () => _goTo(_EveningRitualStep.gratitude),
        ),
      ],
    );
  }

  Widget _buildGratitude() {
    return _EveningStep(
      icon: Icons.favorite_border,
      title: 'Gratitude',
      stepLabel: 'Step 1 of 3',
      prompt: gratitudePrompt,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          _EveningTextArea(
            controller: gratitudeController,
            hint: 'Write what you are grateful for...',
          ),
          const SizedBox(height: 20),
          _EveningButton(
            label: 'Next: Revision',
            onPressed: () => _goTo(_EveningRitualStep.revision),
          ),
        ],
      ),
    );
  }

  Widget _buildRevision() {
    return _EveningStep(
      icon: Icons.edit_note,
      title: 'Revision',
      stepLabel: 'Step 2 of 3',
      prompt: revisionPrompt,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          _EveningTextArea(
            controller: revisionController,
            hint: 'Rewrite the scene as you wish it happened...',
          ),
          const SizedBox(height: 14),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: _accent.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(18),
            ),
            child: const Text(
              'Neville Goddard taught that by revising our memories before sleep, we reshape our reality from within.',
              style: TextStyle(
                color: _muted,
                fontSize: 14,
                fontStyle: FontStyle.italic,
                height: 1.38,
              ),
            ),
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(
                child: _EveningButton(
                  label: 'Next: Release',
                  onPressed: () => _goTo(_EveningRitualStep.release),
                ),
              ),
              const SizedBox(width: 12),
              SizedBox(
                height: 54,
                child: TextButton(
                  onPressed: () => _goTo(_EveningRitualStep.release),
                  child: const Text('Skip', style: TextStyle(color: _muted)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRelease() {
    return _EveningStep(
      icon: Icons.auto_awesome,
      title: 'Release',
      stepLabel: 'Step 3 of 3',
      prompt: 'What are you ready to let go of tonight?',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          for (final item in _releaseOptions)
            _ReleaseTile(
              title: item,
              selected: releaseItems.contains(item),
              onTap: () => _toggleRelease(item),
            ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: customReleaseController,
                  style: const TextStyle(color: _text),
                  decoration: _eveningInputDecoration('Something else...'),
                  onSubmitted: (_) => _addCustomRelease(),
                ),
              ),
              AnimatedBuilder(
                animation: customReleaseController,
                builder: (context, _) {
                  return customReleaseController.text.trim().isEmpty
                      ? const SizedBox.shrink()
                      : Padding(
                          padding: const EdgeInsets.only(left: 10),
                          child: SizedBox(
                            height: 52,
                            child: FilledButton(
                              style: FilledButton.styleFrom(
                                backgroundColor: _accent,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(14),
                                ),
                              ),
                              onPressed: _addCustomRelease,
                              child: const Text('Add'),
                            ),
                          ),
                        );
                },
              ),
            ],
          ),
          const SizedBox(height: 22),
          _EveningButton(label: 'Release & Complete', onPressed: _complete),
        ],
      ),
    );
  }
}

class _EveningScaffold extends StatelessWidget {
  const _EveningScaffold({
    required this.children,
    required this.onClose,
    this.showHeader = true,
  });

  final List<Widget> children;
  final VoidCallback onClose;
  final bool showHeader;

  @override
  Widget build(BuildContext context) {
    return ColoredBox(
      color: _EveningRitualScreenState._background,
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(24, 22, 24, 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              if (showHeader) ...[
                Row(
                  children: [
                    _RoundIconButton(
                      icon: Icons.close,
                      onPressed: onClose,
                    ),
                    const Spacer(),
                    const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.nightlight_round,
                          size: 16,
                          color: _EveningRitualScreenState._muted,
                        ),
                        SizedBox(width: 8),
                        Text(
                          'Evening Ritual',
                          style: TextStyle(
                            color: _EveningRitualScreenState._muted,
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                    const Spacer(),
                    const SizedBox(width: 42),
                  ],
                ),
                const SizedBox(height: 18),
              ],
              Expanded(
                child: SingleChildScrollView(
                  keyboardDismissBehavior:
                      ScrollViewKeyboardDismissBehavior.onDrag,
                  child: ConstrainedBox(
                    constraints: BoxConstraints(
                      minHeight:
                          MediaQuery.sizeOf(context).height -
                          MediaQuery.paddingOf(context).vertical -
                          120,
                    ),
                    child: Column(children: children),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _EveningStep extends StatelessWidget {
  const _EveningStep({
    required this.icon,
    required this.title,
    required this.stepLabel,
    required this.prompt,
    required this.child,
  });

  final IconData icon;
  final String title;
  final String stepLabel;
  final String prompt;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(
          children: [
            Container(
              width: 42,
              height: 42,
              decoration: BoxDecoration(
                color: _EveningRitualScreenState._accent.withValues(
                  alpha: 0.15,
                ),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: _EveningRitualScreenState._accent),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: _EveningRitualScreenState._text,
                    fontSize: 17,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                Text(
                  stepLabel,
                  style: const TextStyle(
                    color: _EveningRitualScreenState._muted,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ],
        ),
        const SizedBox(height: 28),
        Text(
          prompt,
          style: const TextStyle(
            color: _EveningRitualScreenState._text,
            fontSize: 22,
            fontWeight: FontWeight.w700,
            height: 1.22,
          ),
        ),
        const SizedBox(height: 18),
        child,
      ],
    );
  }
}

class _EveningStepCard extends StatelessWidget {
  const _EveningStepCard({
    required this.icon,
    required this.title,
    required this.subtitle,
  });

  final IconData icon;
  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return _EveningCard(
      margin: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Container(
            width: 42,
            height: 42,
            decoration: BoxDecoration(
              color: _EveningRitualScreenState._accent.withValues(alpha: 0.15),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: _EveningRitualScreenState._accent),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: _EveningRitualScreenState._text,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                Text(
                  subtitle,
                  style: const TextStyle(
                    color: _EveningRitualScreenState._muted,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
          const Icon(
            Icons.chevron_right,
            color: _EveningRitualScreenState._muted,
          ),
        ],
      ),
    );
  }
}

class _ReleaseTile extends StatelessWidget {
  const _ReleaseTile({
    required this.title,
    required this.selected,
    required this.onTap,
  });

  final String title;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: InkWell(
        borderRadius: BorderRadius.circular(18),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: selected
                ? _EveningRitualScreenState._accent.withValues(alpha: 0.14)
                : _EveningRitualScreenState._card,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(
              color: selected
                  ? _EveningRitualScreenState._accent
                  : _EveningRitualScreenState._border,
            ),
          ),
          child: Row(
            children: [
              Container(
                width: 26,
                height: 26,
                decoration: BoxDecoration(
                  color: selected
                      ? _EveningRitualScreenState._accent
                      : Colors.transparent,
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: selected
                        ? _EveningRitualScreenState._accent
                        : _EveningRitualScreenState._border,
                    width: 2,
                  ),
                ),
                child: selected
                    ? const Icon(Icons.check, color: Colors.white, size: 17)
                    : null,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(
                    color: _EveningRitualScreenState._text,
                    fontSize: 16,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _EveningTextArea extends StatelessWidget {
  const _EveningTextArea({required this.controller, required this.hint});

  final TextEditingController controller;
  final String hint;

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      minLines: 6,
      maxLines: 8,
      style: const TextStyle(color: _EveningRitualScreenState._text),
      textInputAction: TextInputAction.newline,
      decoration: _eveningInputDecoration(hint),
    );
  }
}

class _EveningCard extends StatelessWidget {
  const _EveningCard({required this.child, this.margin});

  final Widget child;
  final EdgeInsetsGeometry? margin;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: margin,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: _EveningRitualScreenState._card,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: _EveningRitualScreenState._border),
      ),
      child: child,
    );
  }
}

class _EveningButton extends StatelessWidget {
  const _EveningButton({required this.label, required this.onPressed, this.icon});

  final String label;
  final VoidCallback onPressed;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 54,
      child: FilledButton.icon(
        style: FilledButton.styleFrom(
          backgroundColor: _EveningRitualScreenState._accent,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
        ),
        onPressed: onPressed,
        icon: icon == null ? const SizedBox.shrink() : Icon(icon),
        label: Text(
          label,
          textAlign: TextAlign.center,
          style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w700),
        ),
      ),
    );
  }
}

class _RoundIconButton extends StatelessWidget {
  const _RoundIconButton({required this.icon, required this.onPressed});

  final IconData icon;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 42,
      height: 42,
      child: IconButton(
        style: IconButton.styleFrom(
          backgroundColor: _EveningRitualScreenState._card,
          foregroundColor: _EveningRitualScreenState._muted,
          shape: const CircleBorder(
            side: BorderSide(color: _EveningRitualScreenState._border),
          ),
        ),
        onPressed: onPressed,
        icon: Icon(icon, size: 20),
      ),
    );
  }
}

InputDecoration _eveningInputDecoration(String hint) {
  return InputDecoration(
    hintText: hint,
    hintStyle: const TextStyle(color: _EveningRitualScreenState._muted),
    filled: true,
    fillColor: _EveningRitualScreenState._card,
    contentPadding: const EdgeInsets.all(16),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(18),
      borderSide: const BorderSide(color: _EveningRitualScreenState._border),
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(18),
      borderSide: const BorderSide(color: _EveningRitualScreenState._border),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(18),
      borderSide: const BorderSide(color: _EveningRitualScreenState._accent),
    ),
  );
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
