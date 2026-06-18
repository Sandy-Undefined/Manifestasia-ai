import { render, screen, userEvent, waitFor } from '@/test-utils'
import Page from '@/app/page'

describe('WelcomeScreen', () => {
  it('renders the app title and tagline', async () => {
    render(<Page />)
    await waitFor(() => {
      expect(screen.getByText('Manifestasia')).toBeInTheDocument()
    })
    expect(screen.getByText(/personal mindset coach powered by AI/i)).toBeInTheDocument()
  })

  it('renders Get Started button that navigates to signup', async () => {
    const user = userEvent.setup()
    render(<Page />)
    await waitFor(() => {
      expect(screen.getByText('Manifestasia')).toBeInTheDocument()
    })
    const getStartedBtn = screen.getByRole('button', { name: /get started/i })
    await user.click(getStartedBtn)
    expect(screen.getByText(/create your account/i)).toBeInTheDocument()
  })

  it('renders I already have an account button that navigates to login', async () => {
    const user = userEvent.setup()
    render(<Page />)
    await waitFor(() => {
      expect(screen.getByText('Manifestasia')).toBeInTheDocument()
    })
    const loginBtn = screen.getByRole('button', { name: /i already have an account/i })
    await user.click(loginBtn)
    expect(screen.getByText('Welcome back')).toBeInTheDocument()
  })
})
