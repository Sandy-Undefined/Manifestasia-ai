import 'package:flutter/material.dart';

import '../core/app_colors.dart';
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
        Row(
          children: [
            IconButton.filledTonal(
              onPressed: () => state.go(AppScreen.home),
              icon: const Icon(Icons.arrow_back),
            ),
            const Expanded(
              child: Text(
                'Settings',
                style: TextStyle(
                  color: AppColors.text,
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                ),
                textAlign: TextAlign.center,
              ),
            ),
            const SizedBox(width: 48),
          ],
        ),
        const SizedBox(height: 24),
        if (profile != null)
          InfoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('Signed in as', style: subtitleStyle),
                const SizedBox(height: 4),
                Text(
                  profile.email,
                  style: const TextStyle(
                    color: AppColors.text,
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
        const SizedBox(height: 16),
        SizedBox(
          width: double.infinity,
          height: 48,
          child: OutlinedButton.icon(
            style: OutlinedButton.styleFrom(
              foregroundColor: AppColors.primary,
              side: BorderSide(
                color: AppColors.primary.withValues(alpha: 0.5),
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(14),
              ),
            ),
            onPressed: state.logout,
            icon: const Icon(Icons.logout, size: 18),
            label: const Text('Sign Out'),
          ),
        ),
      ],
    );
  }
}
