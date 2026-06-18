import 'package:flutter/material.dart';

import '../core/app_colors.dart';
import '../widgets/common_widgets.dart';
import '../widgets/responsive_page.dart';

class LoadingScreen extends StatelessWidget {
  const LoadingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(body: Center(child: CircularProgressIndicator()));
  }
}

class SetupRequiredScreen extends StatelessWidget {
  const SetupRequiredScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const ResponsivePage(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(height: 72),
        AppLogo(size: 112),
        SizedBox(height: 24),
        Text(
          'Manifestasia',
          style: TextStyle(
            fontSize: 34,
            fontWeight: FontWeight.w700,
            color: AppColors.text,
          ),
        ),
        SizedBox(height: 12),
        Text(
          'Build with --dart-define=SUPABASE_URL=... and --dart-define=SUPABASE_ANON_KEY=... before publishing.',
          style: TextStyle(fontSize: 16, height: 1.45, color: AppColors.muted),
        ),
      ],
    );
  }
}
