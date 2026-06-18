import 'package:flutter/material.dart';

import '../core/app_text_styles.dart';
import '../models/app_screen.dart';
import '../state/app_state.dart';
import '../widgets/common_widgets.dart';
import '../widgets/responsive_page.dart';
import 'home_screen.dart';

class ProgressScreen extends StatelessWidget {
  const ProgressScreen({super.key, required this.state});

  final AppState state;

  @override
  Widget build(BuildContext context) {
    final profile = state.user;
    return ResponsivePage(
      children: [
        BackTextButton(onPressed: () => state.go(AppScreen.home)),
        const SizedBox(height: 20),
        const Text('Your Progress', style: screenTitle),
        const SizedBox(height: 20),
        StatCard(
          label: 'Current streak',
          value: '${profile?.currentStreak ?? 0} days',
          icon: Icons.local_fire_department,
        ),
        StatCard(
          label: 'Total sessions',
          value: '${profile?.totalSessions ?? 0}',
          icon: Icons.check_circle_outline,
        ),
        StatCard(
          label: 'Journal entries',
          value: '${profile?.journalEntries ?? 0}',
          icon: Icons.edit_note,
        ),
        StatCard(
          label: 'AI visions',
          value: '${profile?.aiVisionsGenerated ?? 0}',
          icon: Icons.image_outlined,
        ),
        StatCard(
          label: 'Weekly generations',
          value:
              '${profile?.weeklyGenerationsUsed ?? 0}/${profile?.weeklyGenerationLimit ?? 5}',
          icon: Icons.auto_awesome,
        ),
      ],
    );
  }
}
