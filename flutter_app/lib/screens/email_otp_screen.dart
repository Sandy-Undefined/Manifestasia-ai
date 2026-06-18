import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../core/app_colors.dart';
import '../core/app_config.dart';
import '../core/app_text_styles.dart';
import '../widgets/common_widgets.dart';
import '../widgets/responsive_page.dart';

class EmailOtpScreen extends StatefulWidget {
  const EmailOtpScreen({
    super.key,
    required this.email,
    required this.error,
    required this.notice,
    required this.onBack,
    required this.onVerify,
    required this.onResend,
  });

  final String email;
  final String? error;
  final String? notice;
  final VoidCallback onBack;
  final Future<void> Function(String code) onVerify;
  final Future<void> Function() onResend;

  @override
  State<EmailOtpScreen> createState() => _EmailOtpScreenState();
}

class _EmailOtpScreenState extends State<EmailOtpScreen> {
  final code = TextEditingController();
  bool busy = false;
  bool resending = false;

  bool get valid => code.text.trim().length == AppConfig.signupOtpCodeLength;

  @override
  void dispose() {
    code.dispose();
    super.dispose();
  }

  Future<void> verify() async {
    if (!valid || busy) return;
    setState(() => busy = true);
    await widget.onVerify(code.text);
    if (mounted) setState(() => busy = false);
  }

  Future<void> resend() async {
    if (resending) return;
    setState(() => resending = true);
    await widget.onResend();
    if (mounted) setState(() => resending = false);
  }

  @override
  Widget build(BuildContext context) {
    return ResponsivePage(
      children: [
        BackTextButton(onPressed: widget.onBack),
        const SizedBox(height: 28),
        const Text('Enter confirmation code', style: screenTitle),
        const SizedBox(height: 8),
        Text(
          'We sent an ${AppConfig.signupOtpCodeLength}-digit code to ${widget.email}',
          style: subtitleStyle,
        ),
        const SizedBox(height: 36),
        TextField(
          controller: code,
          keyboardType: TextInputType.number,
          textInputAction: TextInputAction.done,
          maxLength: AppConfig.signupOtpCodeLength,
          textAlign: TextAlign.center,
          style: const TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.w700,
            letterSpacing: 8,
          ),
          inputFormatters: [
            FilteringTextInputFormatter.digitsOnly,
            LengthLimitingTextInputFormatter(AppConfig.signupOtpCodeLength),
          ],
          decoration: fieldDecoration('Code').copyWith(counterText: ''),
          onChanged: (_) => setState(() {}),
          onSubmitted: (_) => verify(),
        ),
        if (widget.error != null) ...[
          const SizedBox(height: 12),
          Text(widget.error!, style: const TextStyle(color: Colors.red)),
        ],
        if (widget.notice != null) ...[
          const SizedBox(height: 12),
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
        ],
        const SizedBox(height: 34),
        PrimaryButton(
          label: busy ? 'Checking...' : 'Verify Email',
          onPressed: valid && !busy ? verify : null,
        ),
        Center(
          child: TextButton(
            onPressed: resending ? null : resend,
            child: Text(resending ? 'Sending...' : 'Resend code'),
          ),
        ),
      ],
    );
  }
}
