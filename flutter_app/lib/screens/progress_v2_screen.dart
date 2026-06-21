import 'package:flutter/material.dart';

import '../core/app_colors.dart';
import '../core/app_text_styles.dart';
import '../models/app_screen.dart';
import '../state/app_state.dart';
import '../widgets/common_widgets.dart';
import '../widgets/responsive_page.dart';

class ProgressV2Screen extends StatelessWidget {
  const ProgressV2Screen({super.key, required this.state});

  final AppState state;

  @override
  Widget build(BuildContext context) {
    final profile = state.user;
    final currentStreak = profile?.currentStreak ?? 0;
    final longestStreak = profile?.longestStreak ?? 0;
    final totalSessions = profile?.totalSessions ?? 0;
    final journalEntries = profile?.journalEntries ?? state.journalNotes.length;
    final aiVisions = profile?.aiVisionsGenerated ?? state.localVisionPrompts.length;
    final weeklyUsed = profile?.weeklyGenerationsUsed ?? 0;
    final weeklyLimit = profile?.weeklyGenerationLimit ?? 5;
    final activeDays = currentStreak.clamp(0, 7);

    final stats = [
      _Metric('Total sessions', '$totalSessions'),
      _Metric('Journal entries', '$journalEntries'),
      _Metric('AI visions', '$aiVisions'),
      _Metric('Evidence logged', '${state.evidenceItems.length}'),
      _Metric('Scripts written', '${state.scripts.length}'),
      _Metric('Weekly AI uses', '$weeklyUsed / $weeklyLimit'),
      const _Metric('Avg belief', '3.0'),
    ];

    final practices = [
      const _PracticeMetric(Icons.air, 'Breathwork', 0),
      const _PracticeMetric(Icons.auto_awesome, 'Visualization', 0),
      _PracticeMetric(Icons.mic_none, 'Journaling', journalEntries),
      _PracticeMetric(Icons.edit_note, 'Scripting', state.scripts.length),
      const _PracticeMetric(Icons.nightlight_round, 'SATS / Bedtime', 0),
      const _PracticeMetric(Icons.chat_bubble_outline, 'Inner Conversations', 0),
      _PracticeMetric(Icons.image_outlined, 'AI Visions', aiVisions),
      const _PracticeMetric(Icons.nightlight_outlined, 'Evening Ritual', 0),
      const _PracticeMetric(Icons.menu_book, 'Learning', 0),
    ];

    return ResponsivePage(
      children: [
        Row(
          children: [
            IconButton.filledTonal(
              onPressed: () => state.go(AppScreen.home),
              icon: const Icon(Icons.arrow_back),
            ),
            const SizedBox(width: 12),
            const Text(
              'Your Progress',
              style: TextStyle(
                color: AppColors.text,
                fontSize: 22,
                fontWeight: FontWeight.w700,
              ),
            ),
          ],
        ),
        const SizedBox(height: 22),
        InfoCard(
          child: Column(
            children: [
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Current streak', style: subtitleStyle),
                        Text(
                          '$currentStreak ${currentStreak == 1 ? 'day' : 'days'}',
                          style: const TextStyle(
                            color: AppColors.text,
                            fontSize: 30,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        Text(
                          'Longest: $longestStreak ${longestStreak == 1 ? 'day' : 'days'}',
                          style: subtitleStyle,
                        ),
                      ],
                    ),
                  ),
                  Container(
                    width: 56,
                    height: 56,
                    decoration: BoxDecoration(
                      color: AppColors.primary.withValues(alpha: 0.1),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.calendar_today,
                      color: AppColors.primary,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 22),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  for (var i = 0; i < 7; i++)
                    _DayBubble(index: i, activeDays: activeDays),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),
        GridView.count(
          crossAxisCount: 2,
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          childAspectRatio: 1.35,
          physics: const NeverScrollableScrollPhysics(),
          shrinkWrap: true,
          children: [
            for (final stat in stats)
              InfoCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      stat.value,
                      style: const TextStyle(
                        color: AppColors.text,
                        fontSize: 24,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(stat.label, style: subtitleStyle),
                  ],
                ),
              ),
          ],
        ),
        const SizedBox(height: 20),
        const SectionLabel('Belief Trend'),
        const InfoCard(
          child: SizedBox(
            height: 86,
            child: Center(
              child: Text(
                'Complete practices with belief sliders to see your trend',
                style: subtitleStyle,
                textAlign: TextAlign.center,
              ),
            ),
          ),
        ),
        const SizedBox(height: 20),
        const SectionLabel('AI Insights'),
        InsightCard(
          icon: Icons.psychology_outlined,
          title: aiVisions > 2
              ? 'You respond best to visual practices'
              : 'Try adding more visual practices',
          description: aiVisions > 2
              ? 'You have created $aiVisions visions. Keep pairing visualization with belief tracking.'
              : 'People who use AI vision generation and visualization see faster belief growth.',
        ),
        const InsightCard(
          icon: Icons.trending_up,
          title: 'Belief trend',
          description:
              'Your average belief level is 3.0/5. Try scripting and inner conversations to boost conviction.',
        ),
        InsightCard(
          icon: Icons.auto_awesome,
          title: 'Pattern detected',
          description: totalSessions > 3
              ? 'You are most consistent with morning practices. Consider adding evening rituals for compound results.'
              : 'Build your streak to unlock pattern insights. Every session adds to your data.',
        ),
        const SizedBox(height: 20),
        const SectionLabel('Practice Breakdown'),
        for (final practice in practices)
          InfoCard(
            child: Row(
              children: [
                Icon(practice.icon, color: AppColors.primary),
                const SizedBox(width: 14),
                Expanded(child: Text(practice.label, style: bodyStyle)),
                Text(
                  '${practice.count}',
                  style: const TextStyle(
                    color: AppColors.text,
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
        const SizedBox(height: 10),
        InkWell(
          borderRadius: BorderRadius.circular(18),
          onTap: () => state.go(AppScreen.weeklySummary),
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(18),
            ),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: const BoxDecoration(
                    color: AppColors.primary,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.auto_awesome, color: Colors.white),
                ),
                const SizedBox(width: 14),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Weekly Reflection',
                        style: TextStyle(
                          color: AppColors.text,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      SizedBox(height: 3),
                      Text(
                        'See your patterns and insights',
                        style: subtitleStyle,
                      ),
                    ],
                  ),
                ),
                const Icon(Icons.chevron_right, color: AppColors.primary),
              ],
            ),
          ),
        ),
        const SizedBox(height: 88),
      ],
    );
  }
}

class _DayBubble extends StatelessWidget {
  const _DayBubble({required this.index, required this.activeDays});

  final int index;
  final int activeDays;

  @override
  Widget build(BuildContext context) {
    final date = DateTime.now().subtract(Duration(days: 6 - index));
    final active = index >= 7 - activeDays;
    final today = index == 6;
    final label = const ['M', 'T', 'W', 'T', 'F', 'S', 'S'][date.weekday - 1];

    return Column(
      children: [
        Text(label, style: subtitleStyle.copyWith(fontSize: 12)),
        const SizedBox(height: 8),
        Container(
          width: 34,
          height: 34,
          decoration: BoxDecoration(
            color: active ? AppColors.primary : AppColors.border,
            shape: BoxShape.circle,
            border: today ? Border.all(color: AppColors.primary, width: 2) : null,
          ),
          child: Center(
            child: Text(
              '${date.day}',
              style: TextStyle(
                color: active ? Colors.white : AppColors.muted,
                fontWeight: FontWeight.w700,
                fontSize: 13,
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _Metric {
  const _Metric(this.label, this.value);

  final String label;
  final String value;
}

class _PracticeMetric {
  const _PracticeMetric(this.icon, this.label, this.count);

  final IconData icon;
  final String label;
  final int count;
}

class InsightCard extends StatelessWidget {
  const InsightCard({
    super.key,
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
              color: AppColors.primary.withValues(alpha: 0.1),
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
