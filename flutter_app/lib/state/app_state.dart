import 'dart:async';

import 'package:flutter/widgets.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../core/app_config.dart';
import '../models/app_screen.dart';
import '../models/user_profile.dart';

class AppState extends ChangeNotifier {
  AppState();

  AppScreen screen = AppScreen.welcome;
  UserProfile? user;
  bool loading = AppConfig.supabaseConfigured;
  String? authError;
  String? authNotice;
  String? pendingConfirmationEmail;
  String? pendingSignupName;

  final selectedAreas = <String>{};
  String? selectedEmotion;
  final selectedIntentions = <String>{};
  final selectedChallenges = <String>{};

  final localVisionPrompts = <String>[];
  final journalNotes = <String>[];
  final evidenceItems = <String>[];
  final scripts = <String>[];
  String? selectedLearningModule;

  StreamSubscription<AuthState>? _authSubscription;

  bool get supabaseReady => AppConfig.supabaseConfigured;
  bool get hasUser => user != null;
  SupabaseClient get _client => Supabase.instance.client;

  Future<void> initialize() async {
    if (!supabaseReady) {
      loading = false;
      notifyListeners();
      return;
    }

    _authSubscription = _client.auth.onAuthStateChange.listen((event) {
      if (event.event == AuthChangeEvent.signedOut) {
        user = null;
        screen = AppScreen.welcome;
        authError = null;
        authNotice = null;
        notifyListeners();
      } else {
        unawaited(loadCurrentUser());
      }
    });

    if (_client.auth.currentSession == null) {
      loading = false;
      notifyListeners();
      return;
    }
    await loadCurrentUser();
  }

  @override
  void dispose() {
    _authSubscription?.cancel();
    super.dispose();
  }

  void go(AppScreen next) {
    screen = next;
    authError = null;
    authNotice = null;
    if (next != AppScreen.login && next != AppScreen.emailOtp) {
      pendingConfirmationEmail = null;
      pendingSignupName = null;
    }
    notifyListeners();
  }

  void openLearningModule(String module) {
    selectedLearningModule = module;
    go(AppScreen.learningModule);
  }

  void goHome() {
    selectedLearningModule = null;
    go(AppScreen.home);
  }

  void goLearningList() {
    selectedLearningModule = null;
    go(AppScreen.learning);
  }

  void toggleSelection(Set<String> selected, String value) {
    if (selected.contains(value)) {
      selected.remove(value);
    } else {
      selected.add(value);
    }
    notifyListeners();
  }

  void setEmotion(String value) {
    selectedEmotion = value;
    notifyListeners();
  }

  Future<void> loadCurrentUser() async {
    final authUser = _client.auth.currentSession?.user;
    if (authUser == null) {
      loading = false;
      notifyListeners();
      return;
    }

    final profile = await _fetchProfile(authUser);
    user = profile;
    screen = profile.onboardingCompleted
        ? AppScreen.home
        : AppScreen.onboardingIntro;
    loading = false;
    notifyListeners();
  }

  Future<UserProfile> _fetchProfile(User authUser) async {
    Map<String, dynamic>? profile;
    Map<String, dynamic>? streak;

    try {
      profile = await _client
          .from('profiles')
          .select()
          .eq('id', authUser.id)
          .maybeSingle();
    } catch (_) {
      profile = null;
    }

    try {
      streak = await _client
          .from('streaks')
          .select('current_streak,longest_streak')
          .eq('user_id', authUser.id)
          .maybeSingle();
    } catch (_) {
      streak = null;
    }

    final metadataName = authUser.userMetadata?['full_name'] as String?;
    final emailName = (authUser.email ?? 'Friend').split('@').first;
    final derivedName = emailName
        .replaceAll(RegExp('[^a-zA-Z]'), ' ')
        .trim()
        .split(RegExp(r'\s+'))
        .where((part) => part.isNotEmpty)
        .map((part) => part[0].toUpperCase() + part.substring(1))
        .join(' ');

    return UserProfile(
      id: authUser.id,
      name:
          (profile?['full_name'] as String?) ??
          (profile?['name'] as String?) ??
          metadataName ??
          (derivedName.isEmpty ? 'Friend' : derivedName),
      email: authUser.email ?? '',
      onboardingCompleted: _readBool(
        profile,
        authUser.userMetadata,
        const [
          'onboarding_completed',
          'onboardingCompleted',
          'completed_onboarding',
        ],
      ),
      totalSessions:
          _readInt(profile, const ['total_sessions', 'totalSessions']) ?? 0,
      currentStreak: (streak?['current_streak'] as num?)?.toInt() ?? 0,
      longestStreak: (streak?['longest_streak'] as num?)?.toInt() ?? 0,
      journalEntries:
          _readInt(profile, const ['journal_entries', 'journalEntries']) ?? 0,
      aiVisionsGenerated:
          _readInt(profile, const ['ai_visions_generated', 'aiVisionsGenerated']) ??
          0,
      weeklyGenerationsUsed:
          _readInt(
            profile,
            const ['weekly_generations_used', 'weeklyGenerationsUsed'],
          ) ??
          0,
      weeklyGenerationLimit:
          _readInt(
            profile,
            const ['weekly_generation_limit', 'weeklyGenerationLimit'],
          ) ??
          5,
      premiumTier:
          (profile?['premium_tier'] as String?) ??
          (profile?['premiumTier'] as String?) ??
          'free',
    );
  }

  bool _readBool(
    Map<String, dynamic>? profile,
    Map<String, dynamic>? metadata,
    List<String> keys,
  ) {
    for (final source in [profile, metadata]) {
      if (source == null) continue;
      for (final key in keys) {
        final value = source[key];
        if (value is bool) return value;
        if (value is String) return value.toLowerCase() == 'true';
        if (value is num) return value != 0;
      }
    }
    return false;
  }

  int? _readInt(Map<String, dynamic>? source, List<String> keys) {
    if (source == null) return null;
    for (final key in keys) {
      final value = source[key];
      if (value is num) return value.toInt();
      if (value is String) return int.tryParse(value);
      if (value is List) return value.length;
    }
    return null;
  }

  Future<void> signIn(String email, String password) async {
    authError = null;
    authNotice = null;
    notifyListeners();

    try {
      await _client.auth.signInWithPassword(
        email: email.trim(),
        password: password,
      );
      authError = null;
      authNotice = null;
      pendingConfirmationEmail = null;
      pendingSignupName = null;
      await loadCurrentUser();
    } on AuthException catch (error) {
      authError = error.message;
      authNotice = null;
      notifyListeners();
    } catch (_) {
      authError = 'Sign in failed. Try again.';
      authNotice = null;
      notifyListeners();
    }
  }

  Future<void> signUp(String name, String email, String password) async {
    authError = null;
    authNotice = null;
    notifyListeners();

    try {
      final normalizedEmail = email.trim();
      final normalizedName = name.trim();
      final response = await _client.auth.signUp(
        email: normalizedEmail,
        password: password,
        data: {'full_name': normalizedName},
      );
      final createdUser = response.user;
      if (createdUser?.identities?.isEmpty == true) {
        screen = AppScreen.login;
        pendingConfirmationEmail = null;
        pendingSignupName = null;
        authNotice =
            'An account already exists for $normalizedEmail. Sign in instead.';
        notifyListeners();
        return;
      }
      if (response.session == null) {
        screen = AppScreen.emailOtp;
        pendingConfirmationEmail = normalizedEmail;
        pendingSignupName = normalizedName;
        authNotice =
            'We sent an ${AppConfig.signupOtpCodeLength}-digit confirmation code to $normalizedEmail.';
        notifyListeners();
        return;
      }
      if (createdUser != null) {
        await _client
            .from('profiles')
            .update({'full_name': normalizedName})
            .eq('id', createdUser.id);
      }
      await loadCurrentUser();
    } on AuthException catch (error) {
      authError = error.message;
      authNotice = null;
      notifyListeners();
    } catch (_) {
      authError = 'Sign up failed. Try again.';
      authNotice = null;
      notifyListeners();
    }
  }

  Future<void> resendConfirmationEmail() async {
    final email = pendingConfirmationEmail;
    if (email == null || email.isEmpty) return;

    authError = null;
    authNotice = null;
    notifyListeners();

    try {
      await _client.auth.resend(email: email, type: OtpType.signup);
      authNotice =
          'We sent another ${AppConfig.signupOtpCodeLength}-digit confirmation code to $email. Check inbox and spam.';
      notifyListeners();
    } on AuthException catch (error) {
      authError = error.message;
      notifyListeners();
    } catch (_) {
      authError = 'Could not resend the confirmation email. Try again later.';
      notifyListeners();
    }
  }

  Future<void> verifySignupOtp(String token) async {
    final email = pendingConfirmationEmail;
    if (email == null || email.isEmpty) {
      authError = 'Start signup again to request a fresh code.';
      notifyListeners();
      return;
    }

    authError = null;
    authNotice = null;
    notifyListeners();

    try {
      final response = await _client.auth.verifyOTP(
        email: email,
        token: token.trim(),
        type: OtpType.signup,
      );
      final verifiedUser = response.user ?? _client.auth.currentUser;
      final name = pendingSignupName;
      if (verifiedUser != null && name != null && name.isNotEmpty) {
        try {
          await _client
              .from('profiles')
              .update({'full_name': name})
              .eq('id', verifiedUser.id);
        } catch (_) {
          // Profile naming is helpful, but it should not block account entry.
        }
      }

      pendingConfirmationEmail = null;
      pendingSignupName = null;
      await loadCurrentUser();
    } on AuthException catch (error) {
      authError = error.message;
      notifyListeners();
    } catch (_) {
      authError = 'Could not verify the code. Check it and try again.';
      notifyListeners();
    }
  }

  Future<void> completeOnboarding() async {
    final current = user;
    if (current == null) return;
    try {
      await _client
          .from('profiles')
          .update({'full_name': current.name, 'onboarding_completed': true})
          .eq('id', current.id);
    } catch (_) {
      // Optional profile persistence should not block the native flow.
    }

    try {
      await _client.auth.updateUser(
        UserAttributes(data: {'onboarding_completed': true}),
      );
    } catch (_) {
      // Auth metadata persistence is a fallback and should not block entry.
    }

    user = current.copyWith(onboardingCompleted: true);
    screen = AppScreen.home;
    notifyListeners();
  }

  Future<void> logout() async {
    if (supabaseReady) await _client.auth.signOut();
    user = null;
    screen = AppScreen.welcome;
    notifyListeners();
  }

  void addSession() {
    final current = user;
    if (current == null) return;
    user = current.copyWith(
      totalSessions: current.totalSessions + 1,
      currentStreak: current.currentStreak == 0 ? 1 : current.currentStreak,
      longestStreak: current.longestStreak == 0 ? 1 : current.longestStreak,
    );
    notifyListeners();
  }

  void addJournalNote(String note) {
    journalNotes.insert(0, note);
    final current = user;
    if (current != null) {
      user = current.copyWith(journalEntries: current.journalEntries + 1);
    }
    notifyListeners();
  }

  void addVisionPrompt(String prompt) {
    localVisionPrompts.insert(0, prompt);
    final current = user;
    if (current != null) {
      user = current.copyWith(
        aiVisionsGenerated: current.aiVisionsGenerated + 1,
      );
    }
    notifyListeners();
  }

  void upgradeTier(String tier) {
    final current = user;
    if (current == null) return;
    user = current.copyWith(
      premiumTier: tier,
      weeklyGenerationLimit: tier == 'unlimited' ? 999 : 25,
    );
    notifyListeners();
  }

  void addScript(String value) {
    scripts.insert(0, value);
    notifyListeners();
  }

  void addEvidence(String value) {
    evidenceItems.insert(0, value);
    notifyListeners();
  }
}

class AppStateScope extends InheritedNotifier<AppState> {
  const AppStateScope({
    super.key,
    required AppState state,
    required super.child,
  }) : super(notifier: state);

  static AppState of(BuildContext context) {
    final scope = context.dependOnInheritedWidgetOfExactType<AppStateScope>();
    assert(scope != null, 'No AppStateScope found in context');
    return scope!.notifier!;
  }
}
