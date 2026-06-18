import 'package:flutter/material.dart';

import '../core/app_colors.dart';
import '../core/app_text_styles.dart';
import '../widgets/common_widgets.dart';
import '../widgets/responsive_page.dart';
import 'practice_screens.dart';

class TextCaptureScreen extends StatefulWidget {
  const TextCaptureScreen({
    super.key,
    required this.title,
    required this.hint,
    required this.items,
    required this.onAdd,
    required this.onBack,
  });

  final String title;
  final String hint;
  final List<String> items;
  final ValueChanged<String> onAdd;
  final VoidCallback onBack;

  @override
  State<TextCaptureScreen> createState() => _TextCaptureScreenState();
}

class _TextCaptureScreenState extends State<TextCaptureScreen> {
  final controller = TextEditingController();

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ResponsivePage(
      children: [
        BackTextButton(onPressed: widget.onBack),
        const SizedBox(height: 18),
        Text(widget.title, style: screenTitle),
        const SizedBox(height: 16),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.card,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: AppColors.border),
          ),
          child: Text(widget.hint, style: bodyStyle),
        ),
        const SizedBox(height: 14),
        TextField(
          controller: controller,
          minLines: 4,
          maxLines: 7,
          textInputAction: TextInputAction.newline,
          decoration: fieldDecoration('Write here'),
        ),
        const SizedBox(height: 12),
        PrimaryButton(
          label: 'Save',
          onPressed: () {
            final text = controller.text.trim();
            if (text.isEmpty) return;
            widget.onAdd(text);
            controller.clear();
            FocusScope.of(context).unfocus();
          },
        ),
        const SizedBox(height: 20),
        NativeListBody(items: widget.items, empty: 'Nothing saved yet.'),
      ],
    );
  }
}
