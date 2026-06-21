import 'package:flutter/material.dart';

import '../core/app_colors.dart';
import '../core/app_text_styles.dart';
import '../models/app_screen.dart';
import '../state/app_state.dart';
import '../widgets/common_widgets.dart';
import '../widgets/responsive_page.dart';

class WeeklySummaryScreen extends StatelessWidget {
  const WeeklySummaryScreen({super.key, required this.state});

  final AppState state;

  @override
  Widget build(BuildContext context) {
    final profile = state.user;
    final sessions = profile?.totalSessions ?? 1;
    final journals = profile?.journalEntries ?? state.journalNotes.length;
    final minutes = (sessions * 3).clamp(3, 999);
    final topThemes = _deriveThemes();

    return ResponsivePage(
      children: [
        Row(
          children: [
            IconButton.filledTonal(
              onPressed: () => state.go(AppScreen.progress),
              icon: const Icon(Icons.arrow_back),
            ),
            const SizedBox(width: 12),
            const Text(
              'Weekly Reflection',
              style: TextStyle(
                color: AppColors.text,
                fontSize: 22,
                fontWeight: FontWeight.w700,
              ),
            ),
          ],
        ),
        const SizedBox(height: 28),
        const Center(child: BreathingOrb(size: 84)),
        const SizedBox(height: 18),
        const Text(
          "Here's what you focused on",
          style: TextStyle(
            color: AppColors.text,
            fontSize: 25,
            fontWeight: FontWeight.w700,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 8),
        const Text(
          'A gentle look at your week',
          style: subtitleStyle,
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 24),
        InfoCard(
          child: Row(
            children: [
              Expanded(child: _WeekStat(value: '$sessions', label: 'Sessions')),
              Expanded(child: _WeekStat(value: '$journals', label: 'Journals')),
              Expanded(child: _WeekStat(value: '$minutes', label: 'Minutes')),
            ],
          ),
        ),
        if (topThemes.isNotEmpty) ...[
          const SizedBox(height: 22),
          const SectionLabel('Recurring Themes'),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              for (final theme in topThemes)
                Chip(
                  label: Text(theme),
                  backgroundColor: AppColors.primary.withValues(alpha: 0.1),
                  labelStyle: const TextStyle(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w700,
                  ),
                ),
            ],
          ),
        ],
        const SizedBox(height: 22),
        const SectionLabel('Insights for You'),
        const _WeeklyInsight(
          icon: Icons.trending_up,
          title: 'Growing Awareness',
          description:
              "You've become more attuned to your body's signals. This is the foundation of lasting change.",
        ),
        const _WeeklyInsight(
          icon: Icons.chat_bubble_outline,
          title: 'Finding Your Voice',
          description:
              'Your journal entries show increasing depth and self-reflection. Keep speaking your truth.',
        ),
        const _WeeklyInsight(
          icon: Icons.favorite_border,
          title: 'Showing Up Matters',
          description:
              'Every session, no matter how short, builds the neural pathways for lasting transformation.',
        ),
        const SizedBox(height: 12),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: AppColors.primary.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(18),
          ),
          child: const Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(Icons.auto_awesome, color: AppColors.primary),
              SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'A note for next week',
                      style: TextStyle(
                        color: AppColors.text,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    SizedBox(height: 6),
                    Text(
                      "You're doing the work that most people avoid. Remember: small, consistent steps create profound change over time. Next week, try to notice one moment each day where you feel more present than before.",
                      style: subtitleStyle,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 22),
        PrimaryButton(
          label: 'Continue Your Journey',
          onPressed: () => state.go(AppScreen.home),
        ),
        const SizedBox(height: 88),
      ],
    );
  }

  List<String> _deriveThemes() {
    final joined = state.journalNotes.join(' ').toLowerCase();
    final themes = <String>[];
    if (joined.contains('stress') || joined.contains('anxious')) {
      themes.add('stress');
    }
    if (joined.contains('grateful') || joined.contains('gratitude')) {
      themes.add('gratitude');
    }
    if (joined.contains('hope') || joined.contains('possible')) {
      themes.add('hope');
    }
    if (joined.contains('rest') || joined.contains('tired')) {
      themes.add('need for rest');
    }
    if (joined.contains('aware') || joined.contains('noticed')) {
      themes.add('awareness');
    }
    return themes.take(3).toList();
  }
}

class _WeekStat extends StatelessWidget {
  const _WeekStat({required this.value, required this.label});

  final String value;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            color: AppColors.text,
            fontSize: 25,
            fontWeight: FontWeight.w700,
          ),
        ),
        const SizedBox(height: 4),
        Text(label, style: subtitleStyle.copyWith(fontSize: 12)),
      ],
    );
  }
}

class _WeeklyInsight extends StatelessWidget {
  const _WeeklyInsight({
    required this.icon,
    required this.title,
    required this.description,
  });

  final IconData icon;
  final String title;
  final String description;

  @override
  Widget build(BuildContext context) {
    return InfoCard(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 42,
            height: 42,
            decoration: BoxDecoration(
              color: AppColors.accent.withValues(alpha: 0.35),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: AppColors.primary),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: AppColors.text,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 4),
                Text(description, style: subtitleStyle),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
