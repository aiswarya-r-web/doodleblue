import { API_BASE_URL } from '../../constants'
import {
  apiTokenSchema,
  apiUserListSchema,
} from '../../validation/schemas'

// Auth boundary: all authentication traffic lives here so a real provider
// can replace the demo implementation without touching the UI or Redux.
// Fake Store API exposes /users and /auth/login; it has no email lookup or
// password-recovery endpoint, so those limitations are surfaced honestly.

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

export async function loginWithCredentials(email, password) {
  const users = await request(`${API_BASE_URL}/users`)
  const parsedUsers = apiUserListSchema.safeParse(users)
  if (!parsedUsers.success) {
    throw new Error('Received invalid account data from the server.')
  }

  const normalizedEmail = email.trim().toLowerCase()
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
// users, so a created account cannot sign in later — the UI communicates
// this and directs users to a seeded demo account instead.
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
  return data
}
