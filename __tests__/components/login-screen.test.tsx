import { render, screen, userEvent, waitFor } from '@/test-utils'
import Page from '@/app/page'

describe('LoginScreen', () => {
  beforeEach(async () => {
    const user = userEvent.setup()
    render(<Page />)
    await waitFor(() => {
      expect(screen.getByText('Manifestasia')).toBeInTheDocument()
    })
    await user.click(screen.getByRole('button', { name: /i already have an account/i }))
  })

  it('renders login form with email and password fields', () => {
    expect(screen.getByText('Welcome back')).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/your@email\.com/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('disables Sign In when email or password is empty', () => {
    const signInBtn = screen.getByRole('button', { name: /sign in/i })
    expect(signInBtn).toBeDisabled()
  })

  it('enables Sign In when both email and password are filled', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByPlaceholderText(/your@email\.com/i), 'test@test.com')
    await user.type(screen.getByPlaceholderText(/enter your password/i), 'password123')
    const signInBtn = screen.getByRole('button', { name: /sign in/i })
    expect(signInBtn).not.toBeDisabled()
  })

  it('has Back button that navigates to welcome', async () => {
    const user = userEvent.setup()
    const backBtn = screen.getByRole('button', { name: /go back to welcome screen/i })
    await user.click(backBtn)
    expect(screen.getByText('Manifestasia')).toBeInTheDocument()
  })

  it('has Get started link for new users', async () => {
    const user = userEvent.setup()
    const getStartedBtn = screen.getByRole('button', { name: /get started/i })
    await user.click(getStartedBtn)
    expect(screen.getByText(/create your account/i)).toBeInTheDocument()
  })
})
