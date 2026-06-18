import 'package:flutter/material.dart';

import '../core/app_text_styles.dart';
import '../models/app_screen.dart';
import '../state/app_state.dart';
import '../widgets/common_widgets.dart';
import '../widgets/responsive_page.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key, required this.state});

  final AppState state;

  @override
  Widget build(BuildContext context) {
    final profile = state.user;
    return ResponsivePage(
      children: [
        BackTextButton(onPressed: () => state.go(AppScreen.home)),
        const SizedBox(height: 24),
        const Text('Settings', style: screenTitle),
        const SizedBox(height: 24),
        InfoCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                profile?.name ?? 'Friend',
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 4),
              Text(profile?.email ?? '', style: subtitleStyle),
              const SizedBox(height: 8),
              Text('Tier: ${profile?.premiumTier ?? 'free'}', style: bodyStyle),
            ],
          ),
        ),
        const SizedBox(height: 34),
        PrimaryButton(label: 'Sign out', onPressed: state.logout),
      ],
    );
  }
}
