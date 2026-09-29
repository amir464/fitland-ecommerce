import { AuthApiError } from '@/entities/auth/api/auth.api'

export function getAuthErrorMessage(error: unknown) {
  if (error instanceof AuthApiError) {
    return error.message
  }

  return 'Something went wrong. Please try again.'
}
