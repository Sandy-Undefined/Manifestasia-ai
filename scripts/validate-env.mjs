const placeholderValues = new Set([
  'placeholder-key',
  'your-anon-key',
  'your_anon_key',
  'your-supabase-anon-key',
  'your_supabase_anon_key',
])

function cleanEnvValue(value) {
  const trimmed = value?.trim() ?? ''
  if (trimmed.length >= 2) {
    const first = trimmed[0]
    const last = trimmed[trimmed.length - 1]
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return trimmed.slice(1, -1).trim()
    }
  }
  return trimmed
}

function decodeJwtPayload(token) {
  const [, payload] = token.split('.')
  if (!payload) return null

  try {
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    return JSON.parse(Buffer.from(padded, 'base64').toString('utf8'))
  } catch {
    return null
  }
}

function validateSupabaseUrl(value) {
  if (!value) return 'NEXT_PUBLIC_SUPABASE_URL is missing.'
  if (value.includes('placeholder')) return 'NEXT_PUBLIC_SUPABASE_URL is still a placeholder.'

  try {
    const url = new URL(value)
    if (url.protocol !== 'https:') return 'NEXT_PUBLIC_SUPABASE_URL must use https.'
  } catch {
    return 'NEXT_PUBLIC_SUPABASE_URL must be a valid URL.'
  }

  return null
}

function validateAnonKey(value) {
  if (!value) return 'NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is missing.'

  const lower = value.toLowerCase()
  if (placeholderValues.has(lower) || lower.includes('placeholder')) {
    return 'NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is still a placeholder.'
  }

  if (value.startsWith('sb_publishable_')) return null

  const payload = decodeJwtPayload(value)
  if (payload?.role === 'service_role') {
    return 'NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY contains a service role key. Use the anon/public key instead.'
  }
  if (payload && payload.role !== 'anon') {
    return 'NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not an anon/public key.'
  }

  return null
}

async function validateSupabaseConnection(url, anonKey) {
  if (process.env.SKIP_SUPABASE_ONLINE_VALIDATION === '1') {
    console.warn('Skipping online Supabase key validation.')
    return null
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    const response = await fetch(new URL('/auth/v1/settings', url), {
      headers: {
        apikey: anonKey,
        authorization: `Bearer ${anonKey}`,
      },
      signal: controller.signal,
    })

    if (response.status === 401 || response.status === 403) {
      return 'Supabase rejected NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Confirm the URL and public key come from the same project.'
    }

    if (!response.ok) {
      return `Could not validate Supabase credentials. Supabase returned HTTP ${response.status}.`
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'unknown error'
    return `Could not reach Supabase to validate credentials: ${reason}.`
  } finally {
    clearTimeout(timeout)
  }

  return null
}

const supabaseUrl = cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL)
const supabaseAnonKey = cleanEnvValue(
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
)
const errors = [
  validateSupabaseUrl(supabaseUrl),
  validateAnonKey(supabaseAnonKey),
].filter(Boolean)

if (errors.length === 0) {
  const connectionError = await validateSupabaseConnection(supabaseUrl, supabaseAnonKey)
  if (connectionError) errors.push(connectionError)
}

if (errors.length > 0) {
  console.error('Supabase environment validation failed:')
  for (const error of errors) console.error(`- ${error}`)
  console.error('Set matching production values before building the app.')
  process.exit(1)
}

console.log('Supabase environment validation passed.')
