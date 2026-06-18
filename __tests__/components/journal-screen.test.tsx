import { render, screen, waitFor } from '@/test-utils'
import userEvent from '@testing-library/user-event'
import Page from '@/app/page'

const goToJournal = async () => {
  const user = userEvent.setup()
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
  await waitFor(() => expect(screen.getByText(/journal/i)).toBeInTheDocument(), { timeout: 3000 })
  await user.click(screen.getByRole('button', { name: /journal/i }))
}

describe('JournalScreen', () => {
  it('renders Voice Journal with Start Recording button', async () => {
    await goToJournal()
    expect(screen.getByText('Voice Journal')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start recording/i })).toBeInTheDocument()
  })

  it('shows tips for voice journaling', async () => {
    await goToJournal()
    expect(screen.getByText(/tips for voice journaling/i)).toBeInTheDocument()
  })
})
