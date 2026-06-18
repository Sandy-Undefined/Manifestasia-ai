class UserProfile {
  const UserProfile({
    required this.id,
    required this.name,
    required this.email,
    required this.onboardingCompleted,
    required this.totalSessions,
    required this.currentStreak,
    required this.longestStreak,
    required this.journalEntries,
    required this.aiVisionsGenerated,
    required this.weeklyGenerationsUsed,
    required this.weeklyGenerationLimit,
    required this.premiumTier,
  });

  final String id;
  final String name;
  final String email;
  final bool onboardingCompleted;
  final int totalSessions;
  final int currentStreak;
  final int longestStreak;
  final int journalEntries;
  final int aiVisionsGenerated;
  final int weeklyGenerationsUsed;
  final int weeklyGenerationLimit;
  final String premiumTier;

  UserProfile copyWith({
    String? name,
    bool? onboardingCompleted,
    int? totalSessions,
    int? currentStreak,
    int? longestStreak,
    int? journalEntries,
    int? aiVisionsGenerated,
    int? weeklyGenerationsUsed,
    int? weeklyGenerationLimit,
    String? premiumTier,
  }) {
    return UserProfile(
      id: id,
      name: name ?? this.name,
      email: email,
      onboardingCompleted: onboardingCompleted ?? this.onboardingCompleted,
      totalSessions: totalSessions ?? this.totalSessions,
      currentStreak: currentStreak ?? this.currentStreak,
      longestStreak: longestStreak ?? this.longestStreak,
      journalEntries: journalEntries ?? this.journalEntries,
      aiVisionsGenerated: aiVisionsGenerated ?? this.aiVisionsGenerated,
      weeklyGenerationsUsed:
          weeklyGenerationsUsed ?? this.weeklyGenerationsUsed,
      weeklyGenerationLimit:
          weeklyGenerationLimit ?? this.weeklyGenerationLimit,
      premiumTier: premiumTier ?? this.premiumTier,
    );
  }
}
