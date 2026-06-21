import 'package:flutter/material.dart';
import 'package:speech_to_text/speech_recognition_result.dart';
import 'package:speech_to_text/speech_to_text.dart';

import '../core/app_colors.dart';
import '../core/app_text_styles.dart';
import '../models/app_screen.dart';
import '../state/app_state.dart';
import '../widgets/common_widgets.dart';
import '../widgets/responsive_page.dart';
import 'practice_screens.dart';

class JournalScreen extends StatefulWidget {
  const JournalScreen({super.key, required this.state});

  final AppState state;

  @override
  State<JournalScreen> createState() => _JournalScreenState();
}

class _JournalScreenState extends State<JournalScreen> {
  static const _prompts = [
    "What's on your mind right now?",
    'How are you feeling in this moment?',
    'What came up during your practice?',
    'What would you like to release today?',
    'What are you grateful for?',
  ];

  final controller = TextEditingController();
  final speech = SpeechToText();
  final stopwatch = Stopwatch();
  String? speechError;
  bool recordingMode = false;
  bool speechReady = false;

  String get todaysPrompt => _prompts[DateTime.now().weekday % _prompts.length];
  String get elapsedLabel {
    final elapsed = stopwatch.elapsed;
    final minutes = elapsed.inMinutes;
    final seconds = elapsed.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '$minutes:$seconds';
  }

  @override
  void dispose() {
    speech.stop();
    controller.dispose();
    super.dispose();
  }

  Future<void> _startRecording() async {
    setState(() {
      speechError = null;
      recordingMode = true;
    });

    final available = await speech.initialize(
      onError: (error) {
        if (!mounted) return;
        setState(() => speechError = error.errorMsg);
      },
      onStatus: (status) {
        if (!mounted) return;
        if (status == 'done' || status == 'notListening') {
          setState(() => recordingMode = speech.isListening);
        }
      },
    );

    if (!available) {
      setState(() {
        speechReady = false;
        speechError =
            'Speech recognition is not available. You can still type your entry below.';
      });
      return;
    }

    speechReady = true;
    stopwatch
      ..reset()
      ..start();
    _tickTimer();

    await speech.listen(
      listenOptions: SpeechListenOptions(
        listenMode: ListenMode.dictation,
        partialResults: true,
      ),
      onResult: _onSpeechResult,
    );
  }

  void _tickTimer() {
    Future<void>.delayed(const Duration(seconds: 1), () {
      if (!mounted || !recordingMode) return;
      setState(() {});
      _tickTimer();
    });
  }

  void _onSpeechResult(SpeechRecognitionResult result) {
    controller.text = result.recognizedWords;
    controller.selection = TextSelection.collapsed(
      offset: controller.text.length,
    );
    setState(() {});
  }

  Future<void> _stopRecording() async {
    stopwatch.stop();
    await speech.stop();
    if (!mounted) return;
    setState(() => recordingMode = false);
  }

  void _saveEntry() {
    final text = controller.text.trim();
    if (text.isEmpty) return;
    if (recordingMode) {
      _stopRecording();
    }
    widget.state.addJournalNote(text);
    controller.clear();
    FocusScope.of(context).unfocus();
    setState(() {
      recordingMode = false;
      speechError = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    final recentEntries = widget.state.journalNotes.take(3).toList();

    return ResponsivePage(
      children: [
        Row(
          children: [
            IconButton.filledTonal(
              onPressed: () => widget.state.go(AppScreen.home),
              icon: const Icon(Icons.close),
            ),
            const Expanded(
              child: Text(
                'Voice Journal',
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
        if (recordingMode || stopwatch.elapsed.inSeconds > 0) ...[
          const SizedBox(height: 12),
          Center(
            child: Text(
              recordingMode ? 'Recording  $elapsedLabel' : elapsedLabel,
              style: const TextStyle(
                color: AppColors.primary,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ],
        const SizedBox(height: 22),
        InfoCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text("Today's prompt", style: subtitleStyle),
              const SizedBox(height: 8),
              Text(
                todaysPrompt,
                style: const TextStyle(
                  color: AppColors.text,
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                  height: 1.2,
                ),
              ),
              const SizedBox(height: 14),
              const Text(
                "Tap the button below and speak freely. There's no right or wrong way to do this.",
                style: subtitleStyle,
              ),
              const SizedBox(height: 18),
              PrimaryButton(
                label: recordingMode ? 'Stop Recording' : 'Start Recording',
                onPressed: () {
                  if (recordingMode) {
                    _stopRecording();
                  } else {
                    _startRecording();
                  }
                },
              ),
              if (speechError != null) ...[
                const SizedBox(height: 12),
                Text(
                  speechError!,
                  style: const TextStyle(color: AppColors.primary),
                ),
              ],
              if (recordingMode || controller.text.isNotEmpty || !speechReady) ...[
                const SizedBox(height: 14),
                TextField(
                  controller: controller,
                  minLines: 4,
                  maxLines: 7,
                  autofocus: true,
                  textInputAction: TextInputAction.newline,
                  onChanged: (_) => setState(() {}),
                  decoration: fieldDecoration(
                    recordingMode
                        ? 'Listening... your words will appear here'
                        : 'Edit or type your reflection here',
                  ),
                ),
                const SizedBox(height: 12),
                PrimaryButton(
                  label: 'Save & Get Reflection',
                  onPressed: controller.text.trim().isEmpty ? null : _saveEntry,
                ),
              ],
            ],
          ),
        ),
        const SizedBox(height: 16),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: AppColors.border.withValues(alpha: 0.45),
            borderRadius: BorderRadius.circular(18),
          ),
          child: const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Tips for voice journaling',
                style: TextStyle(
                  color: AppColors.text,
                  fontWeight: FontWeight.w700,
                ),
              ),
              SizedBox(height: 12),
              FeatureBullet('Speak for 30-90 seconds'),
              FeatureBullet("Don't overthink - just let it flow"),
              FeatureBullet('Your words stay private'),
            ],
          ),
        ),
        if (recentEntries.isNotEmpty) ...[
          const SizedBox(height: 20),
          const SectionLabel('Recent Entries'),
          for (final entry in recentEntries)
            ActionTile(
              icon: Icons.mic_none,
              title: entry.length > 50 ? '${entry.substring(0, 50)}...' : entry,
              subtitle: 'Saved journal entry',
            ),
        ],
        const SizedBox(height: 88),
      ],
    );
  }
}

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
