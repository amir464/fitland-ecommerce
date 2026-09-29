import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Divider, Stack, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'

import { useAppDispatch } from '@/app/store/hooks'
import { useLoginMutation } from '@/entities/auth/api/useAuthMutations'
import { getAuthErrorMessage } from '@/entities/auth/lib/getAuthErrorMessage'
import { setSession } from '@/features/auth/model'
import {
  loginSchema,
  type LoginFormValues,
} from '@/features/auth/model/auth.schema'
import { AuthPageShell } from '@/features/auth/ui/AuthPageShell'
import { getDashboardPath } from '@/features/auth/lib/getDashboardPath'
import { PasswordField } from '@/features/auth/ui/PasswordField'

const DEMO_ACCOUNTS = {
  customer: { email: 'user@fitland.com', password: 'User123!' },
  admin: { email: 'admin@fitland.com', password: 'Admin123!' },
} as const

export function Component() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const loginMutation = useLoginMutation()
  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const submitLogin = async (values: LoginFormValues) => {
    try {
      const session = await loginMutation.mutateAsync(values)
      dispatch(setSession(session))
      navigate(getDashboardPath(session.user.role), { replace: true })
    } catch {
      // Mutation state renders a safe, user-facing error.
    }
  }

  const fillDemo = (type: keyof typeof DEMO_ACCOUNTS) => {
    setValue('email', DEMO_ACCOUNTS[type].email, { shouldValidate: true })
    setValue('password', DEMO_ACCOUNTS[type].password, { shouldValidate: true })
  }

  return (
    <AuthPageShell
      title="Welcome back."
      description="Sign in to the portfolio demo. This mock login is not production authentication."
    >
      <Stack
        component="form"
        noValidate
        onSubmit={(event) => void handleSubmit(submitLogin)(event)}
        spacing={2.25}
      >
        <TextField
          autoComplete="email"
          error={Boolean(errors.email)}
          fullWidth
          helperText={errors.email?.message}
          label="Email"
          {...register('email')}
        />
        <PasswordField
          autoComplete="current-password"
          error={errors.password?.message}
          label="Password"
          registration={register('password')}
        />
        {loginMutation.isError ? (
          <Alert severity="error" role="alert">
            {getAuthErrorMessage(loginMutation.error)}
          </Alert>
        ) : null}
        <Button
          disabled={loginMutation.isPending}
          size="large"
          type="submit"
          variant="contained"
        >
          {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
        </Button>
      </Stack>
      <Divider sx={{ my: 3 }}>Demo accounts</Divider>
      <Typography color="text.secondary" variant="body2">
        Customer: user@fitland.com / User123!
        <br />
        Admin: admin@fitland.com / Admin123!
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ mt: 2 }}>
        <Button onClick={() => fillDemo('customer')} variant="outlined">
          Fill customer credentials
        </Button>
        <Button onClick={() => fillDemo('admin')} variant="outlined">
          Fill admin credentials
        </Button>
      </Stack>
      <Typography sx={{ mt: 3, textAlign: 'center' }}>
        New to FitLand? <Link to="/register">Create an account</Link>
      </Typography>
    </AuthPageShell>
  )
}
