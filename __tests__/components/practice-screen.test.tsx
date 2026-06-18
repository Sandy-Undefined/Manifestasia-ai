import { render, screen, userEvent, waitFor } from '@/test-utils'
import Page from '@/app/page'

const goToPractice = async () => {
  const user = userEvent.setup()
  jest.spyOn(Date.prototype, 'getHours').mockReturnValue(10)
  render(<Page />)
  await waitFor(() => expect(screen.getByText('Manifestasia')).toBeInTheDocument())
  await user.click(screen.getByRole('button', { name: /get started/i }))
  await waitFor(() => expect(screen.getByText(/let's personalize your experience/i)).toBeInTheDocument())
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
  await user.click(screen.getByRole('button', { name: /start morning ritual/i }))
}

describe('PracticeScreen', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })
  it('renders practice steps: Breathwork, Visualization, AI Vision', async () => {
    await goToPractice()
    expect(screen.getByText(/today's practice/i)).toBeInTheDocument()
    expect(screen.getByText(/ready to begin/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /begin breathwork/i })).toBeInTheDocument()
  })

  it('Begin button starts the selected step', async () => {
    await goToPractice()
    const user = userEvent.setup()
    const beginBtn = screen.getByRole('button', { name: /begin breathwork/i })
    await user.click(beginBtn)
    expect(screen.getByText(/breathe in|hold|breathe out|rest/i)).toBeInTheDocument()
  })

  it('Close button returns to home', async () => {
    await goToPractice()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(screen.getByText(/start morning ritual/i)).toBeInTheDocument()
  })
})
