import axios from 'axios'

import type {
  AuthSession,
  LoginInput,
  RegisterInput,
  SafeUser,
  User,
} from '@/entities/auth/model/auth.types'
import { httpClient } from '@/shared/api/httpClient'

export class AuthApiError extends Error {
  readonly code:
    | 'INVALID_CREDENTIALS'
    | 'DUPLICATE_EMAIL'
    | 'SERVICE_UNAVAILABLE'
    | 'REGISTRATION_FAILED'

  constructor(
    message: string,
    code:
      | 'INVALID_CREDENTIALS'
      | 'DUPLICATE_EMAIL'
      | 'SERVICE_UNAVAILABLE'
      | 'REGISTRATION_FAILED',
  ) {
    super(message)
    this.name = 'AuthApiError'
    this.code = code
  }
}

export async function login(input: LoginInput): Promise<AuthSession> {
  const email = normalizeEmail(input.email)

  try {
    const response = await httpClient.get<User[]>('/users', {
      params: { email },
    })
    const user = response.data.find(
      (candidate) =>
        normalizeEmail(candidate.email) === email &&
        candidate.password === input.password,
    )

    if (!user) {
      throw new AuthApiError(
        'The email or password you entered is incorrect.',
        'INVALID_CREDENTIALS',
      )
    }

    return createSession(user)
  } catch (error) {
    throw normalizeAuthError(error)
  }
}

export async function register(
  input: RegisterInput,
): Promise<AuthSession> {
  const email = normalizeEmail(input.email)

  try {
    const existingUsers = await httpClient.get<User[]>('/users', {
      params: { email },
    })

    if (existingUsers.data.some((user) => normalizeEmail(user.email) === email)) {
      throw new AuthApiError(
        'An account with this email already exists.',
        'DUPLICATE_EMAIL',
      )
    }

    const newUser: User = {
      id: globalThis.crypto.randomUUID(),
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email,
      password: input.password,
      role: 'customer',
      createdAt: new Date().toISOString(),
    }
    const response = await httpClient.post<User>('/users', newUser)

    return createSession({ ...response.data, role: 'customer' })
  } catch (error) {
    const normalizedError = normalizeAuthError(error)

    if (normalizedError.code === 'SERVICE_UNAVAILABLE') {
      throw normalizedError
    }

    if (normalizedError.code === 'DUPLICATE_EMAIL') {
      throw normalizedError
    }

    throw new AuthApiError(
      'We could not create your account. Please try again.',
      'REGISTRATION_FAILED',
    )
  }
}

export async function getSafeUsers(signal: AbortSignal): Promise<SafeUser[]> {
  const response = await httpClient.get<User[]>('/users', { signal })

  return response.data.map(toSafeUser)
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function createSession(user: User): AuthSession {
  const safeUser = toSafeUser(user)

  return {
    user: safeUser,
    token: `fitland-demo-${globalThis.crypto.randomUUID()}`,
    isAuthenticated: true,
  }
}

function toSafeUser(user: User): SafeUser {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  }
}

function normalizeAuthError(error: unknown): AuthApiError {
  if (error instanceof AuthApiError) {
    return error
  }

  if (axios.isAxiosError(error)) {
    if (!error.response || error.code === 'ECONNABORTED') {
      return new AuthApiError(
        'The demo authentication service is unavailable. Please try again.',
        'SERVICE_UNAVAILABLE',
      )
    }
  }

  return new AuthApiError(
    'The authentication request could not be completed.',
    'REGISTRATION_FAILED',
  )
}
