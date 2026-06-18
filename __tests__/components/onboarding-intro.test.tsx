import { render, screen, userEvent, waitFor } from '@/test-utils'
import Page from '@/app/page'

describe('OnboardingIntroScreen', () => {
  beforeEach(async () => {
    const user = userEvent.setup()
    render(<Page />)
    await waitFor(() => {
      expect(screen.getByText('Manifestasia')).toBeInTheDocument()
    })
    await user.click(screen.getByRole('button', { name: /get started/i }))
    await waitFor(() => expect(screen.getByText(/create your account/i)).toBeInTheDocument())
    await user.type(screen.getByPlaceholderText(/your first name/i), 'Test')
    await user.type(screen.getByPlaceholderText(/your@email\.com/i), 'test@test.com')
    await user.type(screen.getByPlaceholderText(/at least 6 characters/i), 'password123')
    await user.click(screen.getByRole('button', { name: /continue/i }))
  })

  it('renders personalization headline', () => {
    expect(screen.getByText(/let's personalize your experience/i)).toBeInTheDocument()
  })

  it('navigates to areas after tapping Begin', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /^begin$/i }))
    expect(screen.getByText(/what areas of life do you want to focus on/i)).toBeInTheDocument()
  })
})
