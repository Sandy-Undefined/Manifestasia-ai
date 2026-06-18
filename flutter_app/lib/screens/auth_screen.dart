import 'package:flutter/material.dart';

import '../core/app_colors.dart';
import '../core/app_text_styles.dart';
import '../widgets/common_widgets.dart';
import '../widgets/responsive_page.dart';

enum AuthMode { login, signup }

class AuthScreen extends StatefulWidget {
  const AuthScreen({
    super.key,
    required this.mode,
    required this.error,
    required this.notice,
    required this.onResendConfirmation,
    required this.onBack,
    required this.onSwitch,
    required this.onLogin,
    required this.onSignup,
  });

  final AuthMode mode;
  final String? error;
  final String? notice;
  final Future<void> Function()? onResendConfirmation;
  final VoidCallback onBack;
  final VoidCallback onSwitch;
  final Future<void> Function(String email, String password) onLogin;
  final Future<void> Function(String name, String email, String password)
  onSignup;

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  final name = TextEditingController();
  final email = TextEditingController();
  final password = TextEditingController();
  bool busy = false;
  bool resending = false;

  bool get signup => widget.mode == AuthMode.signup;

  bool get hasTyped =>
      name.text.isNotEmpty || email.text.isNotEmpty || password.text.isNotEmpty;

  bool get validEmail =>
      RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$').hasMatch(email.text.trim());

  bool get valid =>
      validEmail &&
      password.text.length >= 6 &&
      (!signup || name.text.trim().isNotEmpty);

  String? get validationWarning {
    if (!hasTyped || valid) return null;
    if (signup && name.text.trim().isEmpty) {
      return 'Enter your name to continue.';
    }
    if (email.text.trim().isEmpty) {
      return 'Enter your email address to continue.';
    }
    if (!validEmail) {
      return 'Enter a valid email address, like name@example.com.';
    }
    if (password.text.isNotEmpty && password.text.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    return null;
  }

  @override
  void dispose() {
    name.dispose();
    email.dispose();
    password.dispose();
    super.dispose();
  }

  Future<void> submit() async {
    if (!valid || busy) return;
    setState(() => busy = true);
    if (signup) {
      await widget.onSignup(name.text, email.text, password.text);
    } else {
      await widget.onLogin(email.text, password.text);
    }
    if (mounted) setState(() => busy = false);
  }

  Future<void> resendConfirmation() async {
    final resend = widget.onResendConfirmation;
    if (resend == null || resending) return;
    setState(() => resending = true);
    await resend();
    if (mounted) setState(() => resending = false);
  }

  @override
  Widget build(BuildContext context) {
    return ResponsivePage(
      children: [
        BackTextButton(onPressed: widget.onBack),
        const SizedBox(height: 28),
        Text(
          signup ? 'Create your account' : 'Welcome back',
          style: screenTitle,
        ),
        const SizedBox(height: 8),
        Text(
          signup
              ? 'Sign up first, then personalize onboarding'
              : 'Continue your mindset journey',
          style: subtitleStyle,
        ),
        const SizedBox(height: 36),
        if (signup)
          NativeTextField(
            label: 'Name',
            controller: name,
            onChanged: (_) => setState(() {}),
          ),
        NativeTextField(
          label: 'Email',
          controller: email,
          keyboardType: TextInputType.emailAddress,
          onChanged: (_) => setState(() {}),
        ),
        NativeTextField(
          label: 'Password',
          controller: password,
          obscureText: true,
          onChanged: (_) => setState(() {}),
        ),
        if (validationWarning != null) ...[
          const SizedBox(height: 4),
          Text(
            validationWarning!,
            style: const TextStyle(color: AppColors.primary, fontSize: 14),
          ),
        ],
        if (widget.error != null) ...[
          const SizedBox(height: 4),
          Text(widget.error!, style: const TextStyle(color: Colors.red)),
        ],
        if (widget.notice != null) ...[
          const SizedBox(height: 4),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.accent.withValues(alpha: 0.35),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AppColors.accent),
            ),
            child: Text(
              widget.notice!,
              style: const TextStyle(
                color: AppColors.text,
                fontSize: 15,
                height: 1.35,
              ),
            ),
          ),
          if (widget.onResendConfirmation != null)
            Align(
              alignment: Alignment.centerLeft,
              child: TextButton(
                onPressed: resending ? null : resendConfirmation,
                child: Text(resending ? 'Sending...' : 'Resend code'),
              ),
            ),
        ],
        const SizedBox(height: 42),
        PrimaryButton(
          label: busy ? 'Please wait...' : (signup ? 'Continue' : 'Sign In'),
          onPressed: valid && !busy ? submit : null,
        ),
        Center(
          child: TextButton(
            onPressed: widget.onSwitch,
            child: Text(
              signup
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Get started",
            ),
          ),
        ),
      ],
    );
  }
}
