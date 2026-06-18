import 'package:flutter/material.dart';

import '../core/app_colors.dart';
import '../core/app_text_styles.dart';
import '../models/app_screen.dart';
import '../state/app_state.dart';
import '../widgets/common_widgets.dart';
import '../widgets/responsive_page.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key, required this.state});

  final AppState state;

  @override
  Widget build(BuildContext context) {
    final profile = state.user;
    final hour = DateTime.now().hour;
    final evening = hour >= 18 || hour < 5;
    final greeting = hour < 12
        ? 'Good morning'
        : hour < 17
        ? 'Good afternoon'
        : 'Good evening';

    return ResponsivePage(
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(greeting, style: subtitleStyle),
                  Text(
                    profile?.name ?? 'Friend',
                    style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.w700,
                      color: AppColors.text,
                    ),
                  ),
                ],
              ),
            ),
            IconButton.filledTonal(
              onPressed: () => state.go(AppScreen.settings),
              icon: const Icon(Icons.settings_outlined),
            ),
          ],
        ),
        const SizedBox(height: 22),
        StatCard(
          label: 'Current streak',
          value: '${profile?.currentStreak ?? 0} days',
          icon: Icons.calendar_today,
        ),
        const SizedBox(height: 14),
        const QuoteCard(),
        const SizedBox(height: 18),
        FeatureCard(
          title: evening ? 'Release the Day' : 'Align Your Vision',
          subtitle: evening
              ? 'Gratitude, revision, and SATS before sleep.'
              : 'Breathwork, visualization, and a clear inner scene.',
          icon: evening ? Icons.nightlight_round : Icons.wb_sunny_outlined,
          button: evening ? 'Start Evening Ritual' : 'Start Morning Ritual',
          onPressed: () =>
              state.go(evening ? AppScreen.eveningRitual : AppScreen.practice),
        ),
        const SizedBox(height: 20),
        const SectionLabel('Quick Practices'),
        ActionTile(
          icon: Icons.air,
          title: 'Breathwork',
          subtitle: '3-5 min grounding',
          onTap: () => state.go(AppScreen.breathwork),
        ),
        ActionTile(
          icon: Icons.auto_awesome,
          title: 'Visualization',
          subtitle: 'Guided SATS imagery',
          onTap: () => state.go(AppScreen.visualization),
        ),
        ActionTile(
          icon: Icons.image_outlined,
          title: 'AI Vision Generator',
          subtitle: 'Native prompt builder',
          onTap: () => state.go(AppScreen.visionGenerator),
        ),
        ActionTile(
          icon: Icons.edit_note,
          title: 'Scripting Studio',
          subtitle: 'Rewrite your story',
          onTap: () => state.go(AppScreen.scripting),
        ),
        ActionTile(
          icon: Icons.trending_up,
          title: 'Evidence Tracker',
          subtitle: 'Track signs and movement',
          onTap: () => state.go(AppScreen.evidence),
        ),
        ActionTile(
          icon: Icons.grid_view,
          title: 'Vision Board',
          subtitle: 'Review your visions',
          onTap: () => state.go(AppScreen.visionBoard),
        ),
        ActionTile(
          icon: Icons.menu_book,
          title: 'Learning Modules',
          subtitle: 'Neville fundamentals',
          onTap: () => state.go(AppScreen.learning),
        ),
        const SizedBox(height: 88),
      ],
    );
  }
}

class StatCard extends StatelessWidget {
  const StatCard({
    super.key,
    required this.label,
    required this.value,
    required this.icon,
  });

  final String label;
  final String value;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return InfoCard(
      child: Row(
        children: [
          Icon(icon, color: AppColors.primary),
          const SizedBox(width: 14),
          Expanded(child: Text(label, style: subtitleStyle)),
          Text(
            value,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: AppColors.text,
            ),
          ),
        ],
      ),
    );
  }
}

class QuoteCard extends StatelessWidget {
  const QuoteCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.primary.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(18),
      ),
      child: const Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            '"Live in the feeling of the wish fulfilled."',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontStyle: FontStyle.italic,
              color: AppColors.text,
            ),
          ),
          SizedBox(height: 6),
          Text(
            '- Neville Goddard',
            style: TextStyle(
              color: AppColors.primary,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

class FeatureCard extends StatelessWidget {
  const FeatureCard({
    super.key,
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.button,
    required this.onPressed,
  });

  final String title;
  final String subtitle;
  final IconData icon;
  final String button;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return InfoCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: AppColors.primary, size: 34),
          const SizedBox(height: 12),
          Text(
            title,
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w700,
              color: AppColors.text,
            ),
          ),
          const SizedBox(height: 6),
          Text(subtitle, style: subtitleStyle),
          const SizedBox(height: 18),
          PrimaryButton(label: button, onPressed: onPressed),
        ],
      ),
    );
  }
}
