import { render, screen, waitFor } from '@/test-utils'
import userEvent from '@testing-library/user-event'
import Page from '@/app/page'

const goToVisionGenerator = async () => {
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
  await waitFor(() => expect(screen.getByRole('button', { name: /finding time/i })).toBeInTheDocument())
  await user.click(screen.getByRole('button', { name: /finding time/i }))
  await user.click(screen.getByRole('button', { name: /see my personalized path/i }))
  await waitFor(() => expect(screen.getByRole('button', { name: /start today's practice/i })).toBeInTheDocument(), { timeout: 5000 })
  await user.click(screen.getByRole('button', { name: /start today's practice/i }))
  await waitFor(() => expect(screen.getByRole('button', { name: /^visions$/i })).toBeInTheDocument(), { timeout: 3000 })
  await user.click(screen.getByRole('button', { name: /^visions$/i }))
}

describe('VisionGeneratorScreen', () => {
  it('renders AI Vision Generator with life area categories', async () => {
    await goToVisionGenerator()
    await waitFor(() => expect(screen.getByText(/see yourself in the end/i)).toBeInTheDocument())
    expect(screen.getByText(/career & purpose/i)).toBeInTheDocument()
    expect(screen.getByText(/relationships/i)).toBeInTheDocument()
  })
})
