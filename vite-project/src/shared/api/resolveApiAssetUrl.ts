import { env } from '@/shared/config/env'

export function resolveApiAssetUrl(path: string): string {
  const normalizedPath = path.trim()

  if (!normalizedPath) {
    throw new Error('API asset path is required.')
  }

  if (/^https?:\/\//i.test(normalizedPath)) {
    return normalizedPath
  }

  return new URL(normalizedPath, `${env.apiBaseUrl}/`).toString()
}
