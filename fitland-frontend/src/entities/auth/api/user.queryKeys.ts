export const userQueryKeys = {
  all: ['users'] as const,
  admin: () => [...userQueryKeys.all, 'admin'] as const,
} as const
