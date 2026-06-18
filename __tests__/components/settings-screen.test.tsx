import { render, screen, userEvent, waitFor } from '@/test-utils'
import Page from '@/app/page'

const goToSettings = async () => {
  const user = userEvent.setup()
  // Home screen switches morning vs evening practices by clock; tests assume morning CTAs.
  jest.spyOn(Date.prototype, 'getHours').mockReturnValue(10)
  render(<Page />)
  await waitFor(() => expect(screen.getByText('Manifestasia')).toBeInTheDocument())
  await user.click(screen.getByRole('button', { name: /get started/i }))
  await user.click(screen.getByRole('button', { name: /^begin$/i }))
  await waitFor(() => expect(screen.getByText(/what areas of life/i)).toBeInTheDocument())
  await user.click(screen.getByText(/career & purpose/i))
  await user.click(screen.getByRole('button', { name: /continue/i }))
  await waitFor(() => expect(screen.getByText(/how are you feeling/i)).toBeInTheDocument())
  await user.click(screen.getByText(/hopeful/i))
  await user.click(screen.getByRole('button', { name: /continue/i }))
  await waitFor(() => expect(screen.getByText(/what do you hope to achieve/i)).toBeInTheDocument())
  await user.click(screen.getByText(/find clarity on what i want/i))
  await user.click(screen.getByRole('button', { name: /continue/i }))
  await user.click(screen.getByText(/finding time/i))
  await user.type(screen.getByPlaceholderText(/your first name/i), 'Test')
  await user.type(screen.getByPlaceholderText(/your@email\.com/i), 'test@test.com')
  await user.type(screen.getByPlaceholderText(/at least 6 characters/i), 'password123')
  await user.click(screen.getByRole('button', { name: /see my personalized path/i }))
  await waitFor(() => expect(screen.getByRole('button', { name: /start today's practice/i })).toBeInTheDocument(), { timeout: 5000 })
  await user.click(screen.getByRole('button', { name: /start today's practice/i }))
  await waitFor(() => expect(screen.getByText(/start morning ritual/i)).toBeInTheDocument(), { timeout: 3000 })
  await user.click(screen.getByRole('button', { name: /settings/i }))
}

describe('SettingsScreen', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })
  it('renders Settings and Sign Out', async () => {
    await goToSettings()
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
  })

  it('shows signed in email', async () => {
    await goToSettings()
    expect(screen.getByText(/test@test\.com/i)).toBeInTheDocument()
  })

  it('Sign Out returns to welcome', async () => {
    await goToSettings()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /sign out/i }))
    await waitFor(() => expect(screen.getByText('Manifestasia')).toBeInTheDocument())
  })
})
