import { mergeAuthIdentityIntoUser } from '@/lib/merge-auth-identity'

describe('mergeAuthIdentityIntoUser', () => {
  it('updates name/email from auth but keeps client-only fields like hasAcceptedDisclaimer', () => {
    const prev = {
      name: 'Old',
      email: 'old@test.com',
      hasAcceptedDisclaimer: true,
      journalEntries: [{ id: '1' }],
    }
    const fromAuth = {
      name: 'New',
      email: 'new@test.com',
      hasAcceptedDisclaimer: false,
      journalEntries: [],
    }
    const merged = mergeAuthIdentityIntoUser(prev, fromAuth)
    expect(merged.name).toBe('New')
    expect(merged.email).toBe('new@test.com')
    expect(merged.hasAcceptedDisclaimer).toBe(true)
    expect(merged.journalEntries).toEqual([{ id: '1' }])
  })
})
