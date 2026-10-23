import { API_BASE_URL } from '../../constants'
import { apiTokenSchema, apiUserListSchema } from '../../validation/schemas'

// Auth boundary: all authentication traffic lives here so a real provider
// can replace the demo implementation without touching the UI or Redux.
//
// Login checks locally-registered demo accounts first (passwords stored
// as SHA-256 hashes — never plaintext), then falls back to the real
// Fake Store API: /users lookup + /auth/login token exchange.
// Fake Store API has no email lookup or password-recovery endpoint, so
// those limitations are surfaced honestly in the UI.

const LOCAL_USERS_KEY = 'shopkart_local_users'

// Seeded demo account so the reviewer can sign in without the API.
const DEMO_ACCOUNT = {
  email: 'aiswarya@gmail.com',
  name: 'Aiswarya',
  password: 'Shopkart@123',
}

async function hashPassword(password) {
  const data = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function readLocalAccounts() {
  try {
    const raw = window.localStorage.getItem(LOCAL_USERS_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeLocalAccounts(accounts) {
  try {
    window.localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(accounts))
  } catch {
    // Storage unavailable — registration still succeeds server-side.
  }
}

async function ensureDemoAccount() {
  const accounts = readLocalAccounts()
  if (accounts.some((a) => a.email === DEMO_ACCOUNT.email)) return
  const passwordHash = await hashPassword(DEMO_ACCOUNT.password)
  writeLocalAccounts([
    ...accounts,
    {
      id: 'local-demo-aiswarya',
      email: DEMO_ACCOUNT.email,
      name: DEMO_ACCOUNT.name,
      passwordHash,
    },
  ])
}

async function request(url, options) {
  let response
  try {
    response = await fetch(url, options)
  } catch {
    throw new Error('Network error. Check your connection and try again.')
  }
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}.`)
  }
  return response.json()
}

async function loginLocal(normalizedEmail, passwordHash) {
  await ensureDemoAccount()
  const account = readLocalAccounts().find(
    (a) => a.email === normalizedEmail && a.passwordHash === passwordHash,
  )
  if (!account) return null
  return {
    token: `local-${crypto.randomUUID()}`,
    user: { id: account.id, email: account.email, name: account.name },
  }
}

export async function loginWithCredentials(email, password) {
  const normalizedEmail = email.trim().toLowerCase()
  const passwordHash = await hashPassword(password)

  const localSession = await loginLocal(normalizedEmail, passwordHash)
  if (localSession) return localSession

  const users = await request(`${API_BASE_URL}/users`)
  const parsedUsers = apiUserListSchema.safeParse(users)
  if (!parsedUsers.success) {
    throw new Error('Received invalid account data from the server.')
  }

  const account = parsedUsers.data.find(
    (user) =>
      user.email.toLowerCase() === normalizedEmail &&
      user.password === password,
  )
  if (!account) {
    throw new Error('Invalid email or password.')
  }

  // Exchange the verified credentials for a real API token.
  const tokenData = await request(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: account.username,
      password: account.password,
    }),
  })
  const parsedToken = apiTokenSchema.safeParse(tokenData)
  if (!parsedToken.success) {
    throw new Error('Authentication service returned an invalid response.')
  }

  return {
    token: parsedToken.data.token,
    user: {
      id: account.id,
      email: account.email,
      name: `${account.name.firstname} ${account.name.lastname}`,
    },
  }
}

// Demo registration. The API accepts the payload but does not persist new
// users, so the account is also stored locally (hash only) — allowing the
// new credentials to sign in on this device immediately afterwards.
export async function registerAccount({ fullName, email, password }) {
  const [firstname = '', lastname = ''] = fullName.trim().split(/\s+(.*)/s)
  const data = await request(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      username: email.split('@')[0],
      password,
      name: { firstname, lastname },
    }),
  })
  if (!data || typeof data.id !== 'number') {
    throw new Error('Registration service returned an invalid response.')
  }

  const normalizedEmail = email.trim().toLowerCase()
  const accounts = readLocalAccounts()
  if (!accounts.some((a) => a.email === normalizedEmail)) {
    const passwordHash = await hashPassword(password)
    writeLocalAccounts([
      ...accounts,
      {
        id: `local-${data.id}`,
        email: normalizedEmail,
        name: fullName.trim(),
        passwordHash,
      },
    ])
  }
  return data
}
