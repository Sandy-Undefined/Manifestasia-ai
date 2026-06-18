import { buildUserProfile, needsEmailConfirmation } from '@/lib/auth'

jest.mock('@/lib/supabase')

describe('auth', () => {
  describe('buildUserProfile', () => {
    it('uses full_name from profile when available', () => {
      const authUser = { id: '1', email: 'test@test.com', user_metadata: {} }
      const profile = { full_name: 'John Doe' }
      const result = buildUserProfile(authUser, profile)
      expect(result.name).toBe('John Doe')
      expect(result.email).toBe('test@test.com')
    })

    it('uses user_metadata full_name when profile full_name is null', () => {
      const authUser = { id: '1', email: 'test@test.com', user_metadata: { full_name: 'Jane' } }
      const profile = { full_name: null }
      const result = buildUserProfile(authUser, profile)
      expect(result.name).toBe('Jane')
    })

    it('derives name from email when no profile or metadata', () => {
      const authUser = { id: '1', email: 'jane.doe@example.com', user_metadata: {} }
      const profile = { full_name: null }
      const result = buildUserProfile(authUser, profile)
      expect(result.name).toMatch(/jane/i)
      expect(result.name).toMatch(/doe/i)
    })

    it('uses single char or fallback when email has minimal name part', () => {
      const authUser = { id: '1', email: 'x@y.z', user_metadata: {} }
      const profile = { full_name: null }
      const result = buildUserProfile(authUser, profile)
      expect(result.name).toBeTruthy()
      expect(typeof result.name).toBe('string')
    })

    it('capitalizes the first letter of the name', () => {
      const authUser = { id: '1', email: 'bob@test.com', user_metadata: {} }
      const profile = { full_name: null }
      const result = buildUserProfile(authUser, profile)
      expect(result.name).toBe('Bob')
    })
  })

  describe('needsEmailConfirmation', () => {
    it('returns true when user exists but no session', () => {
      expect(needsEmailConfirmation({ user: { id: '1' }, session: null })).toBe(true)
    })

    it('returns false when session exists', () => {
      expect(needsEmailConfirmation({ user: { id: '1' }, session: {} })).toBe(false)
    })

    it('returns false when user is null', () => {
      expect(needsEmailConfirmation({ user: null, session: null })).toBe(false)
    })
  })
})
