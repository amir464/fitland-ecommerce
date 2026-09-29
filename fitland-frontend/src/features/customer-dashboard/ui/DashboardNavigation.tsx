import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
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

const dashboardLinks = [
  { label: 'Overview', href: '#overview', icon: <DashboardOutlinedIcon /> },
  { label: 'Orders', href: '#orders', icon: <ReceiptLongOutlinedIcon /> },
  { label: 'Profile', href: '#profile', icon: <AccountCircleOutlinedIcon /> },
] as const

export function DashboardSidebar({
  customerName,
  onLogout,
}: {
  customerName: string
  onLogout: () => void
}) {
  return (
    <Box
      component="aside"
      sx={{
        alignSelf: 'start',
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        display: { xs: 'none', lg: 'block' },
        overflow: 'hidden',
        position: 'sticky',
        top: 96,
      }}
    >
      <NavigationContent customerName={customerName} onLogout={onLogout} />
    </Box>
  )
}

export function DashboardMobileNavigation({
  customerName,
  onLogout,
}: {
  customerName: string
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
        <Typography sx={{ fontWeight: 800 }}>Customer dashboard</Typography>
        <IconButton
          aria-label="Open dashboard navigation"
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
        slotProps={{ paper: { sx: { width: 'min(88vw, 320px)' } } }}
      >
        <NavigationContent
          customerName={customerName}
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
  customerName,
  onLogout,
  onNavigate,
}: {
  customerName: string
  onLogout: () => void
  onNavigate?: () => void
}) {
  return (
    <Stack sx={{ minHeight: '100%', p: 2 }}>
      <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>
        FITLAND ACCOUNT
      </Typography>
      <Typography sx={{ fontWeight: 900, mt: 0.5, overflowWrap: 'anywhere' }}>
        {customerName}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <List disablePadding>
        {dashboardLinks.map((item) => (
          <ListItemButton
            component="a"
            href={item.href}
            key={item.href}
            onClick={onNavigate}
            sx={{ borderRadius: 1, minHeight: 48 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
        <ListItemButton
          component={Link}
          to="/shop"
          onClick={onNavigate}
          sx={{ borderRadius: 1, minHeight: 48 }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}><ShoppingBagOutlinedIcon /></ListItemIcon>
          <ListItemText primary="Continue Shopping" />
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
