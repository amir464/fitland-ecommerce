import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Stack, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'

import { useAppDispatch } from '@/app/store/hooks'
import { useRegisterMutation } from '@/entities/auth/api/useAuthMutations'
import { getAuthErrorMessage } from '@/entities/auth/lib/getAuthErrorMessage'
import { setSession } from '@/features/auth/model'
import {
  registerSchema,
  type RegisterFormValues,
} from '@/features/auth/model/auth.schema'
import { AuthPageShell } from '@/features/auth/ui/AuthPageShell'
import { PasswordField } from '@/features/auth/ui/PasswordField'

export function Component() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const registerMutation = useRegisterMutation()
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const submitRegistration = async (values: RegisterFormValues) => {
    try {
      const session = await registerMutation.mutateAsync({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      })
      dispatch(setSession(session))
      navigate('/account/dashboard', { replace: true })
    } catch {
      // Mutation state renders a safe, user-facing error.
    }
  }

  return (
    <AuthPageShell
      title="Create your account."
      description="Join the FitLand portfolio demo. New registrations always receive customer access."
    >
      <Stack
        component="form"
        noValidate
        onSubmit={(event) => void handleSubmit(submitRegistration)(event)}
        spacing={2.25}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            autoComplete="given-name"
            error={Boolean(errors.firstName)}
            fullWidth
            helperText={errors.firstName?.message}
            label="First name"
            {...register('firstName')}
          />
          <TextField
            autoComplete="family-name"
            error={Boolean(errors.lastName)}
            fullWidth
            helperText={errors.lastName?.message}
            label="Last name"
            {...register('lastName')}
          />
        </Stack>
        <TextField
          autoComplete="email"
          error={Boolean(errors.email)}
          fullWidth
          helperText={errors.email?.message}
          label="Email"
          {...register('email')}
        />
        <PasswordField
          autoComplete="new-password"
          error={errors.password?.message}
          label="Password"
          registration={register('password')}
        />
        <PasswordField
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          label="Confirm password"
          registration={register('confirmPassword')}
        />
        {registerMutation.isError ? (
          <Alert severity="error" role="alert">
            {getAuthErrorMessage(registerMutation.error)}
          </Alert>
        ) : null}
        <Button
          disabled={registerMutation.isPending}
          size="large"
          type="submit"
          variant="contained"
        >
          {registerMutation.isPending ? 'Creating account...' : 'Create account'}
        </Button>
      </Stack>
      <Typography sx={{ mt: 3, textAlign: 'center' }}>
        Already registered? <Link to="/login">Sign in</Link>
      </Typography>
    </AuthPageShell>
  )
}
