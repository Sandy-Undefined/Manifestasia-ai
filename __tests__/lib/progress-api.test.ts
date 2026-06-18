import { progressResponseToStats, progressResponseToUserUpdates } from '@/lib/progress-api'

describe('progress-api', () => {
  const sample = {
    total_sessions: 1,
    journal_entries: 0,
    ai_visions_generated: 1,
    scripts_created: 0,
    weekly_generations_used: 1,
    weekly_generation_limit: 5,
    current_streak: 1,
    longest_streak: 1,
    streak_level: 0,
  }

  it('maps API response to ProgressStats', () => {
    const stats = progressResponseToStats(sample)
    expect(stats.totalSessions).toBe(1)
    expect(stats.journalEntries).toBe(0)
    expect(stats.aiVisionsGenerated).toBe(1)
    expect(stats.currentStreak).toBe(1)
    expect(stats.longestStreak).toBe(1)
    expect(stats.streakLevel).toBe(0)
  })

  it('maps API response to user updates', () => {
    const u = progressResponseToUserUpdates(sample)
    expect(u.totalSessions).toBe(1)
    expect(u.currentStreak).toBe(1)
    expect(u.progressStats?.weeklyGenerationsUsed).toBe(1)
    expect(u.progressStats?.weeklyGenerationLimit).toBe(5)
  })
})
