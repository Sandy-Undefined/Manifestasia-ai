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

  static const _quotes = [
    'Live in the feeling of the wish fulfilled.',
    'Assume the feeling of your wish fulfilled.',
    'Change your conception of yourself and you will automatically change the world in which you live.',
    'Dare to believe in the reality of your assumption.',
    'An awakened imagination works with a purpose.',
    'The world is yourself pushed out.',
    'To be transformed, the whole basis of your thoughts must change.',
  ];

  @override
  Widget build(BuildContext context) {
    final profile = state.user;
    final hour = DateTime.now().hour;
    final evening = hour >= 18 || hour < 5;
    final isPro = profile?.premiumTier != 'free';
    final greeting = hour < 12
        ? 'Good morning'
        : hour < 17
        ? 'Good afternoon'
        : 'Good evening';
    final quote = _quotes[DateTime.now().weekday % _quotes.length];
    final quickPractices = evening
        ? [
            _HomeAction(
              icon: Icons.nightlight_round,
              title: 'Evening Ritual',
              subtitle: 'Gratitude, revision, release',
              screen: AppScreen.eveningRitual,
            ),
            _HomeAction(
              icon: Icons.edit_note,
              title: 'Scripting Studio',
              subtitle: 'Rewrite your story',
              screen: AppScreen.scripting,
            ),
            _HomeAction(
              icon: Icons.bedtime_outlined,
              title: 'SATS Bedtime Mode',
              subtitle: 'Wind down with imagery',
              screen: AppScreen.sats,
            ),
          ]
        : [
            _HomeAction(
              icon: Icons.air,
              title: 'Breathwork',
              subtitle: '3-5 min grounding',
              screen: AppScreen.breathwork,
            ),
            _HomeAction(
              icon: Icons.auto_awesome,
              title: 'Visualization',
              subtitle: 'Guided SATS imagery',
              screen: AppScreen.visualization,
            ),
            _HomeAction(
              icon: Icons.image_outlined,
              title: 'AI Vision Generator',
              subtitle: 'See yourself in the end',
              screen: AppScreen.visionGenerator,
            ),
          ];

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
            if (!isPro) ...[
              FilledButton.icon(
                style: FilledButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  minimumSize: const Size(0, 34),
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(999),
                  ),
                ),
                onPressed: () => showUpgradePrompt(context, state),
                icon: const Icon(Icons.workspace_premium, size: 14),
                label: const Text(
                  'Pro',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700),
                ),
              ),
              const SizedBox(width: 8),
            ],
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
        QuoteCard(quote: quote),
        const SizedBox(height: 18),
        FeatureCard(
          title: evening ? 'Release the Day' : 'Align Your Vision',
          subtitle: evening
              ? 'Wind down with gratitude, revision, and release before sleep.'
              : 'Start your day with breathwork, visualization, and create an AI vision of your desired reality.',
          icon: evening ? Icons.nightlight_round : Icons.wb_sunny_outlined,
          button: evening ? 'Start Evening Ritual' : 'Start Morning Ritual',
          onPressed: () =>
              state.go(evening ? AppScreen.eveningRitual : AppScreen.practice),
        ),
        const SizedBox(height: 20),
        SectionLabel(evening ? 'Evening Practices' : 'Morning Practices'),
        for (final practice in quickPractices)
          ActionTile(
            icon: practice.icon,
            title: practice.title,
            subtitle: practice.subtitle,
            onTap: () => state.go(practice.screen),
          ),
        const SizedBox(height: 10),
        ActionTile(
          icon: Icons.bar_chart,
          title: 'Your Progress',
          subtitle:
              '${profile?.totalSessions ?? 0} sessions · ${profile?.journalEntries ?? 0} journal · ${profile?.aiVisionsGenerated ?? 0} AI visions',
          onTap: () => state.go(AppScreen.progress),
        ),
        const SizedBox(height: 88),
      ],
    );
  }
}

void showUpgradePrompt(BuildContext context, AppState state) {
  showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    backgroundColor: AppColors.background,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
    ),
    builder: (context) => UpgradePromptSheet(state: state),
  );
}

class UpgradePromptSheet extends StatelessWidget {
  const UpgradePromptSheet({super.key, required this.state});

  final AppState state;

  static const plans = [
    UpgradePlan(
      id: 'pro',
      name: 'Pro',
      price: r'$9.99/mo',
      features: [
        '25 AI generations per week',
        'Advanced realism model',
        'Animated vision loops',
        'Revision tool (photo-based)',
        'Priority generation speed',
      ],
    ),
    UpgradePlan(
      id: 'unlimited',
      name: 'Unlimited',
      price: r'$19.99/mo',
      bestValue: true,
      features: [
        'Unlimited AI generations',
        'Video loop generation',
        'Voice-cloned affirmations',
        'Exportable vision boards',
        'All Pro features included',
      ],
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: EdgeInsets.fromLTRB(
          24,
          20,
          24,
          24 + MediaQuery.viewInsetsOf(context).bottom,
        ),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(
                    Icons.workspace_premium,
                    color: AppColors.primary,
                    size: 28,
                  ),
                  const SizedBox(width: 10),
                  const Expanded(
                    child: Text(
                      'Unlock More',
                      style: TextStyle(
                        color: AppColors.text,
                        fontSize: 24,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                  IconButton.filledTonal(
                    onPressed: () => Navigator.of(context).pop(),
                    icon: const Icon(Icons.close),
                  ),
                ],
              ),
              const SizedBox(height: 18),
              for (final plan in plans)
                UpgradePlanCard(
                  plan: plan,
                  onChoose: () {
                    state.upgradeTier(plan.id);
                    Navigator.of(context).pop();
                  },
                ),
              const SizedBox(height: 8),
              const Center(
                child: Text(
                  'Cancel anytime. 7-day free trial included.',
                  style: subtitleStyle,
                  textAlign: TextAlign.center,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class UpgradePlan {
  const UpgradePlan({
    required this.id,
    required this.name,
    required this.price,
    required this.features,
    this.bestValue = false,
  });

  final String id;
  final String name;
  final String price;
  final List<String> features;
  final bool bestValue;
}

class UpgradePlanCard extends StatelessWidget {
  const UpgradePlanCard({
    super.key,
    required this.plan,
    required this.onChoose,
  });

  final UpgradePlan plan;
  final VoidCallback onChoose;

  @override
  Widget build(BuildContext context) {
    return InfoCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      plan.name,
                      style: const TextStyle(
                        color: AppColors.text,
                        fontSize: 20,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      plan.price,
                      style: const TextStyle(
                        color: AppColors.primary,
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
              if (plan.bestValue)
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.primary,
                    borderRadius: BorderRadius.circular(999),
                  ),
                  child: const Text(
                    'Best Value',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 16),
          for (final feature in plan.features)
            Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(
                    Icons.check,
                    color: AppColors.primary,
                    size: 18,
                  ),
                  const SizedBox(width: 10),
                  Expanded(child: Text(feature, style: bodyStyle)),
                ],
              ),
            ),
          const SizedBox(height: 8),
          PrimaryButton(label: 'Choose ${plan.name}', onPressed: onChoose),
        ],
      ),
    );
  }
}

class _HomeAction {
  const _HomeAction({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.screen,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final AppScreen screen;
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
  const QuoteCard({super.key, required this.quote});

  final String quote;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.primary.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(18),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            '"$quote"',
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontStyle: FontStyle.italic,
              color: AppColors.text,
            ),
          ),
          const SizedBox(height: 6),
          const Text(
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
