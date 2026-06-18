import 'package:flutter/material.dart';

import '../core/app_colors.dart';
import '../widgets/common_widgets.dart';
import '../widgets/responsive_page.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({
    super.key,
    required this.onLogin,
    required this.onSignup,
  });

  final VoidCallback onLogin;
  final VoidCallback onSignup;

  @override
  Widget build(BuildContext context) {
    return ResponsivePage(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        const SizedBox(height: 44),
        const AppLogo(size: 148),
        const SizedBox(height: 24),
        const Text(
          'Manifestasia',
          style: TextStyle(
            fontSize: 40,
            fontWeight: FontWeight.w700,
            color: AppColors.text,
          ),
        ),
        const SizedBox(height: 10),
        const Text(
          'A personal mindset coach powered by AI',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 18, color: AppColors.muted),
        ),
        const SizedBox(height: 46),
        const FeatureBullet('AI vision generator to see yourself in the end'),
        const FeatureBullet(
          'Guided SATS, scripting, and Neville-style rituals',
        ),
        const FeatureBullet('Evidence tracking and vision board builder'),
        const SizedBox(height: 24),
        PrimaryButton(label: 'Get Started', onPressed: onSignup),
        TextButton(
          onPressed: onLogin,
          child: const Text('I already have an account'),
        ),
      ],
    );
  }
}
