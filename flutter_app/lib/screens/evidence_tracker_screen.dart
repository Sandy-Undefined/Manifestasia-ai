import 'package:flutter/material.dart';

import '../core/app_colors.dart';
import '../core/app_text_styles.dart';
import '../models/app_screen.dart';
import '../state/app_state.dart';
import '../widgets/common_widgets.dart';
import '../widgets/responsive_page.dart';

class EvidenceTrackerScreen extends StatefulWidget {
  const EvidenceTrackerScreen({super.key, required this.state});

  final AppState state;

  @override
  State<EvidenceTrackerScreen> createState() => _EvidenceTrackerScreenState();
}

class _EvidenceTrackerScreenState extends State<EvidenceTrackerScreen> {
  static const moodLabels = [
    'Doubtful',
    'Uncertain',
    'Neutral',
    'Hopeful',
    'Certain',
  ];

  static const tagSuggestions = [
    'angel numbers',
    'synchronicity',
    'dream sign',
    'overheard conversation',
    'unexpected gift',
    'perfect timing',
    'deja vu',
    'repeating pattern',
  ];

  final controller = TextEditingController();
  final selectedTags = <String>{};
  bool showNewEntry = false;
  int mood = 3;

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  void saveEvidence() {
    final text = controller.text.trim();
    if (text.isEmpty) return;
    final tags = selectedTags.isEmpty ? '' : ' #${selectedTags.join(' #')}';
    widget.state.addEvidence('${moodLabels[mood - 1]}: $text$tags');
    controller.clear();
    selectedTags.clear();
    setState(() {
      mood = 3;
      showNewEntry = false;
    });
    FocusScope.of(context).unfocus();
  }

  @override
  Widget build(BuildContext context) {
    final entries = widget.state.evidenceItems;
    final averageBelief = entries.isEmpty ? 0.0 : 3.0;
    final patterns = selectedTags.length;

    return ResponsivePage(
      children: [
        Row(
          children: [
            IconButton.filledTonal(
              onPressed: () => widget.state.go(AppScreen.home),
              icon: const Icon(Icons.arrow_back),
            ),
            const Expanded(
              child: Text(
                'Evidence Log',
                style: TextStyle(
                  color: AppColors.text,
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                ),
                textAlign: TextAlign.center,
              ),
            ),
            IconButton.filled(
              onPressed: () => setState(() => showNewEntry = true),
              icon: const Icon(Icons.add),
            ),
          ],
        ),
        const SizedBox(height: 22),
        if (showNewEntry) buildNewEntryForm(),
        if (entries.isNotEmpty) ...[
          Row(
            children: [
              Expanded(child: _EvidenceStat(value: '${entries.length}', label: 'Total Signs')),
              const SizedBox(width: 10),
              Expanded(
                child: _EvidenceStat(
                  value: averageBelief.toStringAsFixed(1),
                  label: 'Avg Belief',
                ),
              ),
              const SizedBox(width: 10),
              Expanded(child: _EvidenceStat(value: '$patterns', label: 'Patterns')),
            ],
          ),
          const SizedBox(height: 20),
        ],
        if (entries.isEmpty && !showNewEntry) buildEmptyState(),
        if (entries.isNotEmpty) ...[
          SectionLabel(_dateLabel(DateTime.now())),
          for (final entry in entries)
            InfoCard(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 42,
                    height: 42,
                    decoration: BoxDecoration(
                      color: AppColors.primary.withValues(alpha: 0.1),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.auto_awesome,
                      color: AppColors.primary,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(child: Text(entry, style: bodyStyle)),
                ],
              ),
            ),
          const SizedBox(height: 12),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: AppColors.border.withValues(alpha: 0.45),
              borderRadius: BorderRadius.circular(18),
            ),
            child: const Text(
              '"Signs follow, they do not precede."\n- Neville Goddard',
              style: TextStyle(
                color: AppColors.muted,
                fontStyle: FontStyle.italic,
                height: 1.38,
              ),
              textAlign: TextAlign.center,
            ),
          ),
        ],
        const SizedBox(height: 88),
      ],
    );
  }

  Widget buildNewEntryForm() {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 20),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.primary, width: 2),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Expanded(
                child: Text(
                  'New Evidence',
                  style: TextStyle(
                    color: AppColors.text,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
              IconButton(
                onPressed: () => setState(() => showNewEntry = false),
                icon: const Icon(Icons.close),
              ),
            ],
          ),
          TextField(
            controller: controller,
            minLines: 4,
            maxLines: 5,
            onChanged: (_) => setState(() {}),
            textInputAction: TextInputAction.newline,
            decoration: fieldDecoration(
              'What synchronicity or sign did you notice?',
            ),
          ),
          const SizedBox(height: 16),
          Text('Belief level: ${moodLabels[mood - 1]}', style: subtitleStyle),
          Slider(
            min: 1,
            max: 5,
            divisions: 4,
            value: mood.toDouble(),
            label: moodLabels[mood - 1],
            onChanged: (value) => setState(() => mood = value.round()),
          ),
          const SizedBox(height: 8),
          const Text('Tags', style: subtitleStyle),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              for (final tag in tagSuggestions)
                FilterChip(
                  label: Text(tag),
                  selected: selectedTags.contains(tag),
                  onSelected: (_) => setState(() {
                    if (selectedTags.contains(tag)) {
                      selectedTags.remove(tag);
                    } else {
                      selectedTags.add(tag);
                    }
                  }),
                ),
            ],
          ),
          const SizedBox(height: 18),
          Row(
            children: [
              OutlinedButton.icon(
                onPressed: null,
                icon: const Icon(Icons.camera_alt_outlined),
                label: const Text('Photo'),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: PrimaryButton(
                  label: 'Save Evidence',
                  onPressed: controller.text.trim().isEmpty ? null : saveEvidence,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget buildEmptyState() {
    return Padding(
      padding: const EdgeInsets.only(top: 48),
      child: Column(
        children: [
          Container(
            width: 84,
            height: 84,
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.trending_up,
              color: AppColors.primary,
              size: 42,
            ),
          ),
          const SizedBox(height: 22),
          const Text(
            'Track Your Signs',
            style: TextStyle(
              color: AppColors.text,
              fontSize: 25,
              fontWeight: FontWeight.w700,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          const Text(
            'Log synchronicities, angel numbers, and signs from the universe. Watch your evidence grow.',
            style: subtitleStyle,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 22),
          PrimaryButton(
            label: 'Log First Evidence',
            onPressed: () => setState(() => showNewEntry = true),
          ),
        ],
      ),
    );
  }

  static String _dateLabel(DateTime date) {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return '${months[date.month - 1]} ${date.day}';
  }
}

class _EvidenceStat extends StatelessWidget {
  const _EvidenceStat({required this.value, required this.label});

  final String value;
  final String label;

  @override
  Widget build(BuildContext context) {
    return InfoCard(
      child: Column(
        children: [
          Text(
            value,
            style: const TextStyle(
              color: AppColors.text,
              fontSize: 24,
              fontWeight: FontWeight.w700,
            ),
          ),
          Text(label, style: subtitleStyle.copyWith(fontSize: 12)),
        ],
      ),
    );
  }
}
