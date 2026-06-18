import 'package:flutter/material.dart';

import '../models/app_screen.dart';
import '../state/app_state.dart';

class AppShell extends StatelessWidget {
  const AppShell({super.key, required this.state, required this.child});

  final AppState state;
  final Widget child;

  bool get _showNav {
    if (!state.hasUser) return false;
    return !{
      AppScreen.welcome,
      AppScreen.login,
      AppScreen.signup,
      AppScreen.onboardingIntro,
      AppScreen.onboardingAreas,
      AppScreen.onboardingEmotional,
      AppScreen.onboardingIntentions,
      AppScreen.onboardingChallenges,
      AppScreen.roadmap,
    }.contains(state.screen);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: true,
      body: child,
      bottomNavigationBar: _showNav
          ? NavigationBar(
              selectedIndex: switch (state.screen) {
                AppScreen.home => 0,
                AppScreen.visionGenerator => 1,
                AppScreen.journal => 2,
                AppScreen.progress => 3,
                _ => 0,
              },
              onDestinationSelected: (index) {
                state.go(
                  [
                    AppScreen.home,
                    AppScreen.visionGenerator,
                    AppScreen.journal,
                    AppScreen.progress,
                  ][index],
                );
              },
              destinations: const [
                NavigationDestination(
                  icon: Icon(Icons.home_outlined),
                  label: 'Home',
                ),
                NavigationDestination(
                  icon: Icon(Icons.auto_awesome),
                  label: 'Vision',
                ),
                NavigationDestination(
                  icon: Icon(Icons.mic_none),
                  label: 'Journal',
                ),
                NavigationDestination(
                  icon: Icon(Icons.bar_chart),
                  label: 'Progress',
                ),
              ],
            )
          : null,
    );
  }
}
