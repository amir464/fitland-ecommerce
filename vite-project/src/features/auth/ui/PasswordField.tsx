import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { IconButton, InputAdornment, TextField } from '@mui/material'
import { useState } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

type PasswordFieldProps = {
  autoComplete: string
  error?: string
  label: string
  registration: UseFormRegisterReturn
}

export function PasswordField({
  autoComplete,
  error,
  label,
  registration,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <TextField
      autoComplete={autoComplete}
      error={Boolean(error)}
      fullWidth
      helperText={error}
      label={label}
      type={visible ? 'text' : 'password'}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`}
                edge="end"
                onClick={() => setVisible((current) => !current)}
                type="button"
              >
                {visible ? (
                  <VisibilityOffOutlinedIcon />
                ) : (
                  <VisibilityOutlinedIcon />
                )}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      {...registration}
    />
  )
}
