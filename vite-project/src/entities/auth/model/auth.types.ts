export type UserRole = 'customer' | 'admin'

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  role: UserRole
  createdAt: string
}

export type SafeUser = Omit<User, 'password'>

export type LoginInput = Pick<User, 'email' | 'password'>

export type RegisterInput = Pick<
  User,
  'firstName' | 'lastName' | 'email' | 'password'
>

export type AuthSession = {
  user: SafeUser
  token: string
  isAuthenticated: true
}
