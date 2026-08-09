import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import { Box, Button, Card, Chip, Typography } from '@mui/material'

import type { SafeUser } from '@/entities/auth/model/auth.types'

export function DashboardProfile({
  onLogout,
  user,
}: {
  onLogout: () => void
  user: SafeUser
}) {
  return (
    <Card id="profile" component="section" sx={{ p: { xs: 2.5, sm: 3 } }}>
      <Box
        sx={{
          alignItems: { sm: 'center' },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          justifyContent: 'space-between',
        }}
      >
        <div>
          <Typography component="h2" variant="h6" sx={{ fontWeight: 800 }}>
            Profile summary
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, overflowWrap: 'anywhere' }}>
            {user.firstName} {user.lastName} · {user.email}
          </Typography>
          <Chip label="Customer" size="small" sx={{ fontWeight: 700, mt: 1.5 }} />
        </div>
        <Button onClick={onLogout} startIcon={<LogoutRoundedIcon />} variant="outlined">
          Logout
        </Button>
      </Box>
    </Card>
  )
}
