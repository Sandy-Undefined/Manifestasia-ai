import 'dart:convert';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../core/app_colors.dart';
import '../core/app_config.dart';
import '../core/app_text_styles.dart';
import '../models/app_screen.dart';
import '../state/app_state.dart';
import '../widgets/common_widgets.dart';
import '../widgets/responsive_page.dart';
import 'practice_screens.dart';

enum VisionFlowStep { category, template, customize, generating, result }

class VisionGeneratorV2Screen extends StatefulWidget {
  const VisionGeneratorV2Screen({super.key, required this.state});

  final AppState state;

  @override
  State<VisionGeneratorV2Screen> createState() => _VisionGeneratorV2ScreenState();
}

class _VisionGeneratorV2ScreenState extends State<VisionGeneratorV2Screen> {
  static const templates = [
    PromptCategory('Wealth & Abundance', [
      'I am living in my dream home, a beautiful modern house with floor-to-ceiling windows',
      'I am checking my bank account and seeing abundant wealth flowing in',
      'I am driving my brand new luxury car along a scenic coastal road',
    ]),
    PromptCategory('Love & Relationships', [
      'I am having a wonderful evening with my perfect partner at an elegant restaurant',
      'I am surrounded by loving friends celebrating my success',
      'I am holding hands with my soulmate watching the sunset on the beach',
    ]),
    PromptCategory('Health & Vitality', [
      'I am radiating health and energy, jogging along a beach at sunrise',
      'I am looking in the mirror and feeling confident and strong',
      'I am practicing yoga on a peaceful mountaintop feeling completely at ease',
    ]),
    PromptCategory('Career & Purpose', [
      'I am on stage receiving an award for my incredible work',
      'I am in my beautiful office running my thriving business',
      'I am signing a deal for my dream role at a top company',
    ]),
    PromptCategory('Freedom & Travel', [
      'I am sitting at a cafe in Paris with my laptop, working from anywhere',
      'I am exploring the streets of Tokyo feeling completely free',
      'I am waking up in a luxury hotel suite overlooking the ocean',
    ]),
    PromptCategory('Implied Success Scenes', [
      'My friends are congratulating me on my incredible achievement',
      'I am reading a heartfelt letter of appreciation from someone I admire',
      'Someone is shaking my hand saying "I knew you would do it"',
    ]),
  ];

  static const boosters = [
    'golden hour lighting',
    'photorealistic detail',
    'natural skin texture',
    'cinematic composition',
    'warm color grading',
    'shallow depth of field',
    '8k ultra HD',
    'film grain texture',
  ];

  final prompt = TextEditingController();
  final selectedBoosters = <String>{};
  final generatedImages = <Uint8List>[];
  var step = VisionFlowStep.category;
  String? selectedCategory;
  String? error;
  String mediaType = 'Image';
  String modelQuality = 'Standard';
  bool usePhoto = false;
  int beliefLevel = 3;
  int selectedVariant = 0;

  int get remaining {
    final user = widget.state.user;
    return (user?.weeklyGenerationLimit ?? 5) -
        (user?.weeklyGenerationsUsed ?? 0);
  }

  bool get isPro => widget.state.user?.premiumTier != 'free';

  @override
  void dispose() {
    prompt.dispose();
    super.dispose();
  }

  void goTo(VisionFlowStep next) {
    FocusManager.instance.primaryFocus?.unfocus();
    setState(() => step = next);
  }

  void goBack() {
    switch (step) {
      case VisionFlowStep.category:
        widget.state.go(AppScreen.home);
      case VisionFlowStep.template:
        goTo(VisionFlowStep.category);
      case VisionFlowStep.customize:
      case VisionFlowStep.result:
        goTo(VisionFlowStep.template);
      case VisionFlowStep.generating:
        goTo(VisionFlowStep.customize);
    }
  }

  Future<void> generateVision() async {
    final text = prompt.text.trim();
    if (text.isEmpty || step == VisionFlowStep.generating) return;
    if (!AppConfig.apiConfigured) {
      setState(() => error = 'The image API is not configured.');
      return;
    }

    setState(() {
      step = VisionFlowStep.generating;
      error = null;
      generatedImages.clear();
      selectedVariant = 0;
    });

    try {
      final fullPrompt =
          '$text. ${selectedBoosters.isEmpty ? '' : selectedBoosters.join(', ')}';
      final baseUrl = AppConfig.apiBaseUrl.replaceFirst(RegExp(r'/$'), '');
      final response = await http
          .post(
            Uri.parse('$baseUrl/api/generate-image'),
            headers: const {'content-type': 'application/json'},
            body: jsonEncode({'prompt': fullPrompt, 'n': 4}),
          )
          .timeout(const Duration(seconds: 90));

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
      final decoded = (body['images'] as List<dynamic>? ?? const [])
          .whereType<String>()
          .map(decodeImage)
          .whereType<Uint8List>()
          .toList();
      if (decoded.isEmpty) throw Exception('The image API returned no images.');

      setState(() {
        generatedImages
          ..clear()
          ..addAll(decoded);
        step = VisionFlowStep.result;
      });
    } catch (err) {
      setState(() {
        error = err is Exception
            ? err.toString().replaceFirst('Exception: ', '')
            : 'Image generation failed. Try again.';
        step = VisionFlowStep.customize;
      });
    }
  }

  Uint8List? decodeImage(String value) {
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

  void saveVision() {
    final text = prompt.text.trim();
    if (text.isEmpty) return;
    final savedPrompt =
        '${selectedCategory ?? 'General'}: $text${selectedBoosters.isEmpty ? '' : ' -- ${selectedBoosters.join(', ')}'}';
    if (!widget.state.localVisionPrompts.contains(savedPrompt)) {
      widget.state.addVisionPrompt(savedPrompt);
    }
    widget.state.go(AppScreen.visionBoard);
  }

  @override
  Widget build(BuildContext context) {
    if (step == VisionFlowStep.generating) {
      return ResponsivePage(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const Spacer(),
          const BreathingOrb(size: 120),
          const SizedBox(height: 28),
          Text(
            mediaType == 'Video'
                ? 'Rendering cinematic loop...'
                : mediaType == 'Animated'
                ? 'Generating animated vision...'
                : 'Creating your vision...',
            style: sectionTitleStyle,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            usePhoto
                ? 'Blending your likeness into the scene'
                : 'Bringing your imagination to life',
            style: subtitleStyle,
            textAlign: TextAlign.center,
          ),
          const Spacer(),
        ],
      );
    }

    if (step == VisionFlowStep.result) return buildResult();

    return ResponsivePage(
      children: [
        HeaderRow(
          title: switch (step) {
            VisionFlowStep.category => 'AI Vision Generator',
            VisionFlowStep.template => selectedCategory ?? 'Templates',
            VisionFlowStep.customize => 'Customize Your Vision',
            VisionFlowStep.generating => 'Generating',
            VisionFlowStep.result => 'Your Vision',
          },
          onBack: goBack,
          onGallery: () => widget.state.go(AppScreen.visionBoard),
        ),
        const SizedBox(height: 22),
        if (step == VisionFlowStep.category) buildCategoryStep(),
        if (step == VisionFlowStep.template) buildTemplateStep(),
        if (step == VisionFlowStep.customize) buildCustomizeStep(),
        const SizedBox(height: 88),
      ],
    );
  }

  Widget buildCategoryStep() {
    return Column(
      children: [
        const Icon(Icons.image_outlined, color: AppColors.primary, size: 56),
        const SizedBox(height: 12),
        const Text(
          'See Yourself in the End',
          style: TextStyle(
            color: AppColors.text,
            fontSize: 25,
            fontWeight: FontWeight.w700,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 8),
        const Text(
          'Choose a life area and we will create a vivid image, video, or animation of your desired reality.',
          style: subtitleStyle,
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 18),
        InfoCard(
          child: Row(
            children: [
              const Icon(Icons.auto_awesome, color: AppColors.primary),
              const SizedBox(width: 12),
              Expanded(
                child: Text('$remaining generations left\nResets weekly'),
              ),
              if (!isPro) const Chip(label: Text('Upgrade')),
            ],
          ),
        ),
        const SizedBox(height: 8),
        for (final category in templates)
          ActionTile(
            icon: Icons.auto_awesome,
            title: category.name,
            subtitle: '${category.templates.length} templates',
            onTap: () {
              selectedCategory = category.name;
              goTo(VisionFlowStep.template);
            },
          ),
        if (widget.state.localVisionPrompts.isNotEmpty)
          ActionTile(
            icon: Icons.visibility_outlined,
            title: 'My Vision Gallery',
            subtitle: '${widget.state.localVisionPrompts.length} saved visions',
            onTap: () => widget.state.go(AppScreen.visionBoard),
          ),
      ],
    );
  }

  Widget buildTemplateStep() {
    final category = templates.firstWhere(
      (item) => item.name == selectedCategory,
      orElse: () => templates.first,
    );
    return Column(
      children: [
        for (final template in category.templates)
          Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: InkWell(
              borderRadius: BorderRadius.circular(18),
              onTap: () {
                prompt.text = template;
                goTo(VisionFlowStep.customize);
              },
              child: InfoCard(
                child: Text(
                  '"$template"',
                  style: const TextStyle(
                    color: AppColors.text,
                    fontStyle: FontStyle.italic,
                    height: 1.38,
                  ),
                ),
              ),
            ),
          ),
        InkWell(
          borderRadius: BorderRadius.circular(18),
          onTap: () {
            prompt.clear();
            goTo(VisionFlowStep.customize);
          },
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: AppColors.primary),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Write your own',
                  style: TextStyle(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  'Describe your desired reality in your own words',
                  style: subtitleStyle,
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget buildCustomizeStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (error != null) ...[ErrorBox(error!), const SizedBox(height: 16)],
        const SectionLabel('Output type'),
        Row(
          children: [
            for (final type in ['Image', 'Animated', 'Video'])
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: SegmentButtonCard(
                    label: type,
                    selected: mediaType == type,
                    locked: type != 'Image' && !isPro,
                    onTap: () {
                      if (type != 'Image' && !isPro) return;
                      setState(() => mediaType = type);
                    },
                  ),
                ),
              ),
          ],
        ),
        const SizedBox(height: 18),
        const SectionLabel('Model quality'),
        Row(
          children: [
            Expanded(
              child: SegmentButtonCard(
                label: 'Standard',
                selected: modelQuality == 'Standard',
                onTap: () => setState(() => modelQuality = 'Standard'),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: SegmentButtonCard(
                label: 'Advanced Realism',
                selected: modelQuality == 'Advanced Realism',
                locked: !isPro,
                onTap: () {
                  if (isPro) setState(() => modelQuality = 'Advanced Realism');
                },
              ),
            ),
          ],
        ),
        const SizedBox(height: 18),
        InfoCard(
          child: Row(
            children: [
              const Icon(Icons.camera_alt_outlined, color: AppColors.primary),
              const SizedBox(width: 12),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Use my photo',
                      style: TextStyle(
                        color: AppColors.text,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    Text('Blend your likeness into the scene', style: subtitleStyle),
                  ],
                ),
              ),
              Switch(
                value: usePhoto,
                onChanged: (value) => setState(() => usePhoto = value),
              ),
            ],
          ),
        ),
        const SectionLabel('Describe your vision (present tense)'),
        TextField(
          controller: prompt,
          minLines: 5,
          maxLines: 7,
          textInputAction: TextInputAction.newline,
          onChanged: (_) => setState(() {}),
          decoration: fieldDecoration('I am living in my dream home...'),
        ),
        const SizedBox(height: 18),
        const SectionLabel('Realism boosters'),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            for (final booster in boosters)
              FilterChip(
                label: Text(booster),
                selected: selectedBoosters.contains(booster),
                onSelected: (_) => setState(() {
                  if (selectedBoosters.contains(booster)) {
                    selectedBoosters.remove(booster);
                  } else {
                    selectedBoosters.add(booster);
                  }
                }),
              ),
          ],
        ),
        TextButton.icon(
          onPressed: () => setState(() {
            selectedBoosters
              ..clear()
              ..addAll(boosters.take(4));
          }),
          icon: const Icon(Icons.bolt_outlined),
          label: const Text('Auto-select'),
        ),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.border.withValues(alpha: 0.45),
            borderRadius: BorderRadius.circular(18),
          ),
          child: const Text(
            '"Assume the feeling of your wish fulfilled."\n- Neville Goddard',
            style: TextStyle(
              color: AppColors.muted,
              fontStyle: FontStyle.italic,
              height: 1.38,
            ),
          ),
        ),
        const SizedBox(height: 18),
        PrimaryButton(
          label: 'Generate My Vision',
          onPressed: prompt.text.trim().isEmpty ? null : generateVision,
        ),
      ],
    );
  }

  Widget buildResult() {
    final selectedImage = generatedImages.isEmpty
        ? null
        : generatedImages[selectedVariant.clamp(0, generatedImages.length - 1)];

    return ResponsivePage(
      children: [
        HeaderRow(
          title: 'Your Vision',
          onBack: () => goTo(VisionFlowStep.customize),
          trailing: Chip(label: Text('${remaining <= 0 ? 0 : remaining} left')),
        ),
        const SizedBox(height: 18),
        if (selectedImage != null)
          ClipRRect(
            borderRadius: BorderRadius.circular(24),
            child: Image.memory(
              selectedImage,
              width: double.infinity,
              fit: BoxFit.cover,
              filterQuality: FilterQuality.high,
            ),
          ),
        if (generatedImages.length > 1) ...[
          const SizedBox(height: 16),
          const SectionLabel('Variants'),
          Row(
            children: [
              for (var i = 0; i < generatedImages.length; i++)
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: InkWell(
                      borderRadius: BorderRadius.circular(14),
                      onTap: () => setState(() => selectedVariant = i),
                      child: Container(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(
                            color: selectedVariant == i
                                ? AppColors.primary
                                : Colors.transparent,
                            width: 2,
                          ),
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: Image.memory(
                            generatedImages[i],
                            height: 76,
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ],
        const SizedBox(height: 18),
        SectionLabel(
          'How real does this feel? (${[
            'Not yet',
            'Slightly',
            'Possible',
            'Likely',
            'Absolutely',
          ][beliefLevel - 1]})',
        ),
        Slider(
          value: beliefLevel.toDouble(),
          min: 1,
          max: 5,
          divisions: 4,
          label: '$beliefLevel',
          onChanged: (value) => setState(() => beliefLevel = value.round()),
        ),
        Row(
          children: [
            Expanded(
              child: OutlinedButton.icon(
                onPressed: generateVision,
                icon: const Icon(Icons.refresh),
                label: const Text('Regenerate'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: OutlinedButton.icon(
                onPressed: () => setState(() {
                  selectedBoosters
                    ..clear()
                    ..addAll(boosters.take(4));
                }),
                icon: const Icon(Icons.bolt_outlined),
                label: const Text('Enhance'),
              ),
            ),
          ],
        ),
        const SizedBox(height: 14),
        const Text(
          '"It is done. It is finished. The vision is already mine."',
          style: TextStyle(
            color: AppColors.muted,
            fontStyle: FontStyle.italic,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 18),
        PrimaryButton(label: 'Save to My Gallery', onPressed: saveVision),
        TextButton(
          onPressed: () => widget.state.go(AppScreen.visionBoard),
          child: const Text('Add to Vision Board'),
        ),
        const SizedBox(height: 88),
      ],
    );
  }
}

class PromptCategory {
  const PromptCategory(this.name, this.templates);

  final String name;
  final List<String> templates;
}

class HeaderRow extends StatelessWidget {
  const HeaderRow({
    super.key,
    required this.title,
    required this.onBack,
    this.onGallery,
    this.trailing,
  });

  final String title;
  final VoidCallback onBack;
  final VoidCallback? onGallery;
  final Widget? trailing;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        IconButton.filledTonal(onPressed: onBack, icon: const Icon(Icons.close)),
        Expanded(
          child: Text(
            title,
            style: const TextStyle(
              color: AppColors.text,
              fontSize: 20,
              fontWeight: FontWeight.w700,
            ),
            textAlign: TextAlign.center,
          ),
        ),
        trailing ??
            IconButton.filledTonal(
              onPressed: onGallery,
              icon: const Icon(Icons.visibility_outlined),
            ),
      ],
    );
  }
}

class SegmentButtonCard extends StatelessWidget {
  const SegmentButtonCard({
    super.key,
    required this.label,
    required this.selected,
    required this.onTap,
    this.locked = false,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;
  final bool locked;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(14),
      onTap: onTap,
      child: Container(
        constraints: const BoxConstraints(minHeight: 58),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
        decoration: BoxDecoration(
          color: selected ? AppColors.primary : AppColors.card,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: selected ? AppColors.primary : AppColors.border,
          ),
        ),
        child: Stack(
          children: [
            Center(
              child: Text(
                label,
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: selected ? Colors.white : AppColors.text,
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
            if (locked)
              const Positioned(
                right: 0,
                top: 0,
                child: Icon(Icons.lock_outline, size: 14, color: AppColors.muted),
              ),
          ],
        ),
      ),
    );
  }
}

class ErrorBox extends StatelessWidget {
  const ErrorBox(this.message, {super.key});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.primary.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.primary),
      ),
      child: Text(
        message,
        style: const TextStyle(
          color: AppColors.primary,
          fontSize: 15,
          height: 1.35,
        ),
      ),
    );
  }
}
