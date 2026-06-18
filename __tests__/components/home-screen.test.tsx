import { render, screen, userEvent, waitFor } from '@/test-utils'
import Page from '@/app/page'

const completeOnboarding = async () => {
  const user = userEvent.setup()
  render(<Page />)
  await waitFor(() => expect(screen.getByText('Manifestasia')).toBeInTheDocument())
  await user.click(screen.getByRole('button', { name: /get started/i }))
  await waitFor(() => expect(screen.getByText(/create your account/i)).toBeInTheDocument())
  await user.type(screen.getByPlaceholderText(/your first name/i), 'Test')
  await user.type(screen.getByPlaceholderText(/your@email\.com/i), 'test@test.com')
  await user.type(screen.getByPlaceholderText(/at least 6 characters/i), 'password123')
  await user.click(screen.getByRole('button', { name: /continue/i }))
  await waitFor(() => expect(screen.getByText(/let's personalize your experience/i)).toBeInTheDocument())
  await user.click(screen.getByRole('button', { name: /^begin$/i }))
  await waitFor(() => expect(screen.getByText(/what areas of life/i)).toBeInTheDocument())
  await waitFor(() => expect(screen.getByRole('button', { name: /career & purpose/i })).toBeInTheDocument())
  await user.click(screen.getByRole('button', { name: /career & purpose/i }))
  await user.click(screen.getByRole('button', { name: /continue/i }))
  await waitFor(() => expect(screen.getByText(/how are you feeling/i)).toBeInTheDocument())
  await waitFor(() => expect(screen.getByRole('button', { name: /hopeful/i })).toBeInTheDocument())
  await user.click(screen.getByRole('button', { name: /hopeful/i }))
  await user.click(screen.getByRole('button', { name: /continue/i }))
  await waitFor(() => expect(screen.getByText(/what do you hope to achieve/i)).toBeInTheDocument())
  await waitFor(() => expect(screen.getByRole('button', { name: /find clarity on what i want/i })).toBeInTheDocument())
  await user.click(screen.getByRole('button', { name: /find clarity on what i want/i }))
  await user.click(screen.getByRole('button', { name: /continue/i }))
  await waitFor(() => expect(screen.getByText(/what challenges do you face/i)).toBeInTheDocument())
  await waitFor(() => expect(screen.getByRole('button', { name: /finding time/i })).toBeInTheDocument())
  await user.click(screen.getByRole('button', { name: /finding time/i }))
  await user.click(screen.getByRole('button', { name: /see my personalized path/i }))
  await waitFor(() => expect(screen.getByText(/creating your personal path/i)).toBeInTheDocument(), { timeout: 500 })
  await waitFor(() => expect(screen.getByRole('button', { name: /start today's practice/i })).toBeInTheDocument(), { timeout: 5000 })
  await user.click(screen.getByRole('button', { name: /start today's practice/i }))
  await waitFor(() => {
    const startMorning = screen.queryByRole('button', { name: /start morning ritual/i })
    const startEvening = screen.queryByRole('button', { name: /start evening ritual/i })
    expect(startMorning || startEvening).toBeTruthy()
  }, { timeout: 3000 })
}

describe('HomeScreen', () => {
  it('renders home with morning ritual CTA when user completes onboarding', async () => {
    await completeOnboarding()
    const startMorning = screen.queryByRole('button', { name: /start morning ritual/i })
    const startEvening = screen.queryByRole('button', { name: /start evening ritual/i })
    expect(startMorning || startEvening).toBeTruthy()

    expect(screen.getByText(/(morning practices|evening practices)/i)).toBeInTheDocument()
  })

  it('navigates to the ritual flow when ritual CTA is clicked', async () => {
    await completeOnboarding()
    const user = userEvent.setup()
    const startMorning = screen.queryByRole('button', { name: /start morning ritual/i })
    const startEvening = screen.queryByRole('button', { name: /start evening ritual/i })
    expect(startMorning || startEvening).toBeTruthy()

    await user.click(startMorning || startEvening!)
    await waitFor(() => {
      // Morning route: Practice screen
      if (screen.queryByText(/today's practice/i)) return
      // Evening route: Evening Ritual intro (unique heading; avoid matching multiple "Evening Ritual" labels)
      expect(screen.getByText(/time to wind down/i)).toBeInTheDocument()
    })
  })

  it('has Settings button', async () => {
    await completeOnboarding()
    expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument()
  })

  it('shows Progress and Evidence quick nav buttons', async () => {
    await completeOnboarding()
    expect(screen.getByRole('button', { name: /evidence/i })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /progress/i }).length).toBeGreaterThan(0)
  })
})
