import 'package:flutter/material.dart';

import '../core/app_text_styles.dart';
import '../state/app_state.dart';
import '../widgets/common_widgets.dart';
import '../widgets/responsive_page.dart';
import 'practice_screens.dart';

class LearningModule {
  const LearningModule({
    required this.title,
    required this.subtitle,
    required this.duration,
    required this.takeaway,
    required this.sections,
    required this.practice,
  });

  final String title;
  final String subtitle;
  final String duration;
  final String takeaway;
  final List<LearningSection> sections;
  final String practice;
}

class LearningSection {
  const LearningSection({required this.title, required this.body});

  final String title;
  final String body;
}

const learningModules = [
  LearningModule(
    title: 'Law of Assumption Basics',
    subtitle: 'The foundation of everything.',
    duration: '7 min',
    takeaway:
        'Your assumptions are the architects of your life. Choose them deliberately.',
    sections: [
      LearningSection(
        title: 'The Foundation of Everything',
        body:
            "Most people spend their lives reacting to reality. They see what exists and assume that's all that can exist. The Law of Assumption flips this completely.\n\nThe core principle: Your reality is a reflection of your assumptions. Whatever you consistently assume to be true - about yourself, others, and life - must manifest in your physical world.\n\nThis isn't wishful thinking. It's how consciousness works.\n\nNeville Goddard, the philosopher who popularized this law, taught one radical idea: consciousness is the only reality. The outer world - your job, relationships, bank account, health - is simply your inner world made visible.",
      ),
      LearningSection(
        title: 'What Is an Assumption?',
        body:
            "An assumption is any belief you hold as true, whether you consciously chose it or not. Most assumptions were formed in childhood and have been running on autopilot ever since.\n\nIf you assume you're unlucky with money, money stays elusive. If you assume relationships are hard, they are. If you assume good things always happen to you - they do.\n\nThe moment you accept this, you realize something powerful: you've been manifesting your entire life. You just didn't know you were doing it.",
      ),
      LearningSection(
        title: 'How to Apply It',
        body:
            "1. Identify your current assumptions. What do you believe about the area of life you want to change? Write it down honestly.\n\n2. Choose a new assumption. Decide what you want to be true. Not what seems possible - what you want.\n\n3. Live from the new assumption. Act, think, and feel as if it's already true. Not performing it for others - actually inhabiting it internally.\n\n4. Persist. The gap between assumption and manifestation is filled by consistency. Don't abandon your new assumption when the old reality tries to pull you back.",
      ),
      LearningSection(
        title: 'The Most Important Shift',
        body:
            'Stop asking "how will this happen?" That\'s not your job. Your job is to assume the end result. The universe arranges the circumstances.\n\nWhen you truly assume something is true, you stop chasing it. You stop worrying about it. You carry the quiet confidence of someone who knows. That energy is what attracts the physical equivalent.\n\nStart small if needed. Assume parking spots appear easily. Assume people are kind to you. Assume opportunities find you. Build the muscle. Then apply it to the big desires.',
      ),
    ],
    practice:
        'Identify one current assumption and choose the new assumption you want to live from today.',
  ),
  LearningModule(
    title: 'Feeling is the Secret',
    subtitle: 'You manifest what you feel.',
    duration: '5 min',
    takeaway: "You don't manifest what you think. You manifest what you feel.",
    sections: [
      LearningSection(
        title: 'How to Feel It Real',
        body:
            "1. Get still. You can't access deep feeling when you're stressed and distracted.\n\n2. Enter the scene. Close your eyes and imagine a specific moment that implies your desire is fulfilled. Make it small and real - a conversation, a view from a window, a handshake.\n\n3. Feel into it. Don't watch the scene like a movie. Step inside it. What do you hear? What's the texture of the moment? Let the feeling arise naturally.\n\n4. Soak in it. Stay in that feeling for 1-5 minutes. Let it fill your body.\n\n5. Release and trust. Open your eyes and go about your day. You've done the work.",
      ),
      LearningSection(
        title: 'One Practice That Changes Everything',
        body:
            'Before sleep each night, spend 3-5 minutes in the feeling of your wish fulfilled. The moments just before sleep are when your subconscious is most receptive. Plant the seed there, every night, until the harvest arrives.',
      ),
    ],
    practice:
        'Before sleep tonight, spend 3-5 minutes in the feeling of your wish fulfilled.',
  ),
  LearningModule(
    title: 'SATS and Identity',
    subtitle: 'The most powerful state for manifestation.',
    duration: '8 min',
    takeaway: "You don't rise to your desires. You fall to your identity.",
    sections: [
      LearningSection(
        title: 'The Most Powerful State for Manifestation',
        body:
            'SATS stands for State Akin to Sleep - the drowsy, hypnagogic state between waking and sleeping. In this state, the critical, logical mind relaxes its grip. The subconscious becomes wide open.\n\nNeville Goddard taught that this is the most fertile ground for planting new assumptions. What you impress upon your mind in this state bypasses resistance and goes directly into the deep programming that shapes your reality.',
      ),
      LearningSection(
        title: 'Why SATS Works',
        body:
            'In normal waking consciousness, your logical mind filters and rejects new beliefs. "That\'s not realistic. That\'s not who I am. That\'s not how things work."\n\nIn SATS, that guard is down. New assumptions slip in unopposed and take root in the subconscious - where all real change happens.',
      ),
      LearningSection(
        title: 'How to Enter SATS',
        body:
            "1. Lie down in a comfortable position.\n\n2. Take slow, deep breaths until your body relaxes completely.\n\n3. Let your mind drift - not forcing sleep, but not staying fully alert either.\n\n4. You'll notice your thoughts become more fluid, almost dreamlike. This is SATS.\n\n5. In this state, introduce your chosen scene or feeling.",
      ),
      LearningSection(
        title: 'The Identity Piece',
        body:
            'SATS is most powerful when combined with identity work - becoming the version of yourself who already has what you desire.\n\nMost people try to attract things from their current identity. But your current identity is what created your current reality. To get different results, you need to become a different person internally first.\n\nAsk yourself: Who would I be if this desire were already real?\n\n- How would that version of you think?\n- What would they assume about life?\n- How would they carry themselves?\n\nIn SATS, don\'t just visualize having the thing - be the person who has it. Feel their confidence, their ease, their certainty.',
      ),
      LearningSection(
        title: 'A Simple SATS Practice',
        body:
            'Each night as you drift toward sleep:\n\n1. Choose one scene that implies your desire is fulfilled (30 seconds of action maximum)\n\n2. Loop it slowly in your mind\n\n3. Feel the naturalness of being the person in that scene\n\n4. Let sleep take you while holding that feeling\n\nRepeat nightly. Consistency is everything.',
      ),
    ],
    practice:
        'Choose one fulfilled scene and loop it slowly as you drift toward sleep tonight.',
  ),
  LearningModule(
    title: 'Revision Practice',
    subtitle: 'Revise the past. Free the future.',
    duration: '7 min',
    takeaway:
        'Every master manifestor refuses to let an unwanted experience define their future story.',
    sections: [
      LearningSection(
        title: 'How to Revise',
        body:
            '1. Identify the event. Choose something recent - a conversation that went wrong, a rejection, a moment of bad news, an argument.\n\n2. Get into a relaxed state. Sit or lie down, close your eyes, breathe slowly.\n\n3. Replay it differently. In your mind, rewind the event and play it out the way you wished it had gone. Hear the words you wanted to hear. See the positive outcome. Feel the relief and satisfaction.\n\n4. Make it vivid. The more sensory detail, the more impact.\n\n5. Emotionally accept the revision as real. This is the key. Don\'t watch it as fantasy - feel it as the truth of what happened.',
      ),
      LearningSection(
        title: 'Revise Your Day Every Night',
        body:
            'Make it a nightly habit:\n\nBefore sleep, mentally review your day. Anything that felt off - a tense exchange, a missed opportunity, a moment of anxiety - revise it. Replace each negative moment with the ideal version.\n\nThis does two things:\n\n- Clears negative impressions before they compound\n- Trains your subconscious to expect better outcomes',
      ),
      LearningSection(
        title: 'Beyond Events: Revising Beliefs',
        body:
            "You can also revise longer patterns. If you've spent years believing you're bad with money, revise specific memories that reinforced that story. Replace them with memories of financial ease and good decisions.\n\nThe subconscious is remarkably literal. Give it new memories, and it creates a new future to match.",
      ),
      LearningSection(
        title: 'The Deeper Purpose',
        body:
            "Revision isn't denial. It's not pretending bad things didn't hurt. It's recognizing that the meaning you assign to events shapes what comes next - and you have the power to assign new meaning.\n\nEvery master manifestor has one thing in common: they refuse to let an unwanted experience define their future story.\n\nRevise the past. Free the future.",
      ),
    ],
    practice:
        'Before sleep, revise one moment from today and emotionally accept the new ending as real.',
  ),
];

class LearningModulesScreen extends StatelessWidget {
  const LearningModulesScreen({super.key, required this.state});

  final AppState state;

  @override
  Widget build(BuildContext context) {
    return NativeListScreen(
      title: 'Learning Modules',
      empty: 'Learning modules are ready to expand here.',
      items: learningModules.map((module) => module.title).toList(),
      onBack: () => state.goHome(),
      onItemTap: state.openLearningModule,
    );
  }
}

class LearningModuleDetailScreen extends StatelessWidget {
  const LearningModuleDetailScreen({super.key, required this.state});

  final AppState state;

  LearningModule get module {
    final selected = state.selectedLearningModule;
    return learningModules.firstWhere(
      (module) => module.title == selected,
      orElse: () => learningModules.first,
    );
  }

  @override
  Widget build(BuildContext context) {
    final current = module;
    return ResponsivePage(
      children: [
        BackTextButton(onPressed: () => state.goLearningList()),
        const SizedBox(height: 18),
        Text(current.title, style: screenTitle),
        const SizedBox(height: 8),
        Text(
          '${current.duration} lesson - ${current.subtitle}',
          style: subtitleStyle,
        ),
        const SizedBox(height: 22),
        InfoCard(child: Text(current.takeaway, style: bodyStyle)),
        const SizedBox(height: 8),
        for (final section in current.sections)
          InfoCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(section.title, style: sectionTitleStyle),
                const SizedBox(height: 10),
                Text(section.body, style: bodyStyle),
              ],
            ),
          ),
        const SizedBox(height: 8),
        Text('Practice', style: sectionTitleStyle),
        const SizedBox(height: 10),
        InfoCard(child: Text(current.practice, style: bodyStyle)),
        const SizedBox(height: 22),
        PrimaryButton(
          label: 'Complete lesson',
          onPressed: () {
            state.addSession();
            state.goLearningList();
          },
        ),
      ],
    );
  }
}
