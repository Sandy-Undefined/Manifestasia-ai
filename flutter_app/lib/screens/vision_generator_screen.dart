import 'dart:convert';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../core/app_colors.dart';
import '../core/app_config.dart';
import '../core/app_text_styles.dart';
import '../data/onboarding_data.dart';
import '../models/app_screen.dart';
import '../state/app_state.dart';
import '../widgets/common_widgets.dart';
import '../widgets/responsive_page.dart';
import 'practice_screens.dart';

class VisionGeneratorScreen extends StatefulWidget {
  const VisionGeneratorScreen({super.key, required this.state});

  final AppState state;

  @override
  State<VisionGeneratorScreen> createState() => _VisionGeneratorScreenState();
}

class _VisionGeneratorScreenState extends State<VisionGeneratorScreen> {
  final prompt = TextEditingController();
  String area = 'Career & Purpose';
  bool generating = false;
  String? error;
  final generatedImages = <Uint8List>[];

  @override
  void dispose() {
    prompt.dispose();
    super.dispose();
  }

  Future<void> generateVision() async {
    final text = prompt.text.trim();
    if (text.isEmpty || generating) return;
    if (!AppConfig.apiConfigured) {
      setState(() => error = 'The image API is not configured.');
      return;
    }

    setState(() {
      generating = true;
      error = null;
      generatedImages.clear();
    });

    try {
      final baseUrl = AppConfig.apiBaseUrl.replaceFirst(RegExp(r'/$'), '');
      final uri = Uri.parse('$baseUrl/api/generate-image');
      final response = await http
          .post(
            uri,
            headers: const {'content-type': 'application/json'},
            body: jsonEncode({'prompt': '$area: $text', 'n': 1}),
          )
          .timeout(const Duration(seconds: 90));

      if (response.statusCode == 401 && response.body.contains('<html')) {
        throw Exception(
          'The hosted image API is protected by Vercel authentication. Disable deployment protection or use the public production URL.',
        );
      }
      if (response.statusCode < 200 || response.statusCode >= 300) {
        String message = 'Image generation failed.';
        try {
          final body = jsonDecode(response.body) as Map<String, dynamic>;
          message = body['error'] as String? ?? message;
        } catch (_) {
          message = 'Image generation failed with HTTP ${response.statusCode}.';
        }
        throw Exception(message);
      }

      final body = jsonDecode(response.body) as Map<String, dynamic>;
      final images = body['images'] as List<dynamic>? ?? const [];
      final decoded = images
          .whereType<String>()
          .map(_decodeImage)
          .whereType<Uint8List>()
          .toList();

      if (decoded.isEmpty) {
        throw Exception('The image API returned no images.');
      }

      final savedPrompt = '$area: $text';
      if (!widget.state.localVisionPrompts.contains(savedPrompt)) {
        widget.state.addVisionPrompt(savedPrompt);
      }
      setState(() {
        generatedImages
          ..clear()
          ..addAll(decoded);
      });
    } catch (err) {
      final message = err is Exception
          ? err.toString().replaceFirst('Exception: ', '')
          : 'Image generation failed. Try again.';
      setState(() => error = message);
    } finally {
      if (mounted) setState(() => generating = false);
    }
  }

  Uint8List? _decodeImage(String value) {
    try {
      final comma = value.indexOf(',');
      final base64Value = value.startsWith('data:') && comma != -1
          ? value.substring(comma + 1)
          : value;
      return base64Decode(base64Value);
    } catch (_) {
      return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    return ResponsivePage(
      children: [
        BackTextButton(onPressed: () => widget.state.go(AppScreen.home)),
        const SizedBox(height: 18),
        const Text('AI Vision Generator', style: screenTitle),
        const SizedBox(height: 8),
        Text(
          AppConfig.apiConfigured
              ? 'Connected API: ${AppConfig.apiBaseUrl}'
              : 'Native prompt builder. Add a public API_BASE_URL later to call the hosted image route.',
          style: subtitleStyle,
        ),
        const SizedBox(height: 20),
        DropdownButtonFormField<String>(
          initialValue: area,
          decoration: fieldDecoration('Life area'),
          items: OnboardingData.lifeAreas
              .map(
                (value) => DropdownMenuItem(value: value, child: Text(value)),
              )
              .toList(),
          onChanged: (value) => setState(() => area = value ?? area),
        ),
        const SizedBox(height: 14),
        TextField(
          controller: prompt,
          minLines: 4,
          maxLines: 6,
          decoration: fieldDecoration('Describe the fulfilled scene'),
        ),
        const SizedBox(height: 18),
        PrimaryButton(
          label: generating ? 'Generating...' : 'Generate vision image',
          onPressed: generating ? null : generateVision,
        ),
        if (error != null) ...[
          const SizedBox(height: 14),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AppColors.primary),
            ),
            child: Text(
              error!,
              style: const TextStyle(
                color: AppColors.primary,
                fontSize: 15,
                height: 1.35,
              ),
            ),
          ),
        ],
        if (generatedImages.isNotEmpty) ...[
          const SizedBox(height: 18),
          ...generatedImages.map(
            (image) => Padding(
              padding: const EdgeInsets.only(bottom: 14),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(18),
                child: Image.memory(
                  image,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  filterQuality: FilterQuality.high,
                ),
              ),
            ),
          ),
        ],
        const SizedBox(height: 18),
        NativeListBody(
          items: widget.state.localVisionPrompts,
          empty: 'No vision prompts yet.',
        ),
      ],
    );
  }
}
