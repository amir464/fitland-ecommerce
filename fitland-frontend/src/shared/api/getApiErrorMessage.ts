import axios from 'axios'
import { ZodError } from 'zod'

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return `The product service returned an error (${error.response.status}).`
    }

    if (error.code === 'ECONNABORTED') {
      return 'The product service took too long to respond.'
    }

    return 'Unable to connect to the product service.'
  }

  if (error instanceof ZodError) {
    return 'The server returned invalid product data.'
  }

  if (error instanceof Error) {
    return error.message || 'Something went wrong while loading products.'
  }

  return 'Something went wrong while loading products.'
}
