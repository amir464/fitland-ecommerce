import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BASE_URL: z
    .string({
      required_error: 'VITE_API_BASE_URL is required',
      invalid_type_error: 'VITE_API_BASE_URL must be a string',
    })
    .trim()
    .min(1, 'VITE_API_BASE_URL is required')
    .url('VITE_API_BASE_URL must be a valid URL')
    .transform((url) => url.replace(/\/+$/, '')),
})

const result = envSchema.safeParse(import.meta.env)

if (!result.success) {
  const reason = result.error.issues.map((issue) => issue.message).join('; ')
  throw new Error(`Invalid frontend environment configuration: ${reason}`)
}

export const env = {
  apiBaseUrl: result.data.VITE_API_BASE_URL,
} as const
