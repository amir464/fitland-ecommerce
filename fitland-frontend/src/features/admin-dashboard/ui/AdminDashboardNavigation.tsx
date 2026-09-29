import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router'

const adminLinks = [
  { label: 'Overview', href: '#overview', icon: <DashboardOutlinedIcon /> },
] as const

export function AdminDashboardSidebar({
  adminName,
  onLogout,
}: {
  adminName: string
  onLogout: () => void
}) {
  return (
    <Box
      component="aside"
      sx={{
        alignSelf: 'start',
        bgcolor: 'primary.main',
        borderRadius: 1,
        color: 'primary.contrastText',
        display: { xs: 'none', lg: 'block' },
        overflow: 'hidden',
        position: 'sticky',
        top: 96,
      }}
    >
      <NavigationContent adminName={adminName} onLogout={onLogout} />
    </Box>
  )
}

export function AdminDashboardMobileNavigation({
  adminName,
  onLogout,
}: {
  adminName: string
  onLogout: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          display: { xs: 'flex', lg: 'none' },
          justifyContent: 'space-between',
          mb: 2.5,
        }}
      >
        <Typography sx={{ fontWeight: 900 }}>FitLand admin</Typography>
        <IconButton
          aria-label="Open admin navigation"
          onClick={() => setOpen(true)}
          sx={{ border: 1, borderColor: 'divider' }}
        >
          <MenuRoundedIcon />
        </IconButton>
      </Stack>
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{ paper: { sx: { bgcolor: 'primary.main', color: 'primary.contrastText', width: 'min(88vw, 320px)' } } }}
      >
        <NavigationContent
          adminName={adminName}
          onNavigate={() => setOpen(false)}
          onLogout={() => {
            setOpen(false)
            onLogout()
          }}
        />
      </Drawer>
    </>
  )
}

function NavigationContent({
  adminName,
  onLogout,
  onNavigate,
}: {
  adminName: string
  onLogout: () => void
  onNavigate?: () => void
}) {
  return (
    <Stack sx={{ minHeight: '100%', p: 2 }}>
      <Typography variant="overline" sx={{ color: 'secondary.main', fontWeight: 900 }}>
        FITLAND CONTROL
      </Typography>
      <Typography sx={{ fontWeight: 900, mt: 0.5, overflowWrap: 'anywhere' }}>
        {adminName}
      </Typography>
      <Typography variant="caption" sx={{ color: 'grey.400', mt: 0.25 }}>
        Store administrator
      </Typography>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.18)', my: 2 }} />
      <List disablePadding>
        {adminLinks.map((item) => (
          <ListItemButton
            component="a"
            href={item.href}
            key={item.href}
            onClick={onNavigate}
            sx={{ borderRadius: 1, minHeight: 48, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
        <ListItemButton
          component={Link}
          to="/"
          onClick={onNavigate}
          sx={{ borderRadius: 1, minHeight: 48, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><StorefrontOutlinedIcon /></ListItemIcon>
          <ListItemText primary="Storefront" />
        </ListItemButton>
      </List>
      <Button
        color="inherit"
        onClick={onLogout}
        startIcon={<LogoutRoundedIcon />}
        sx={{ justifyContent: 'flex-start', mt: 'auto' }}
      >
        Logout
      </Button>
    </Stack>
  )
}
