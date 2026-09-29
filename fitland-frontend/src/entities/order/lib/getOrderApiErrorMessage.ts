import axios from 'axios'
import { ZodError } from 'zod'

export function getOrderApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 404) {
      return 'The requested order could not be found.'
    }

    if (error.response) {
      return `The order service returned an error (${error.response.status}).`
    }

    if (error.code === 'ECONNABORTED') {
      return 'The order service took too long to respond.'
    }

    return 'Unable to connect to the order service.'
  }

  if (error instanceof ZodError) {
    return 'The order service returned invalid data.'
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Something went wrong while processing the order.'
}
