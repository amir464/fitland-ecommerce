import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import type { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router'

import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { logout, selectCurrentUser } from '@/features/auth/model'
import { accountNavigation, primaryNavigation } from '@/shared/config/navigation'

const accountIcons: Record<string, ReactNode> = {
  Account: <AccountCircleOutlinedIcon />,
  Cart: <ShoppingBagOutlinedIcon />,
} as const

type MobileNavigationDrawerProps = {
  open: boolean
  onClose: () => void
}

export function MobileNavigationDrawer({
  open,
  onClose,
}: MobileNavigationDrawerProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector(selectCurrentUser)
  const secondaryNavigation = accountNavigation.filter(
    (item) => item.label !== 'Account',
  )
  const accountItem = {
    label: user
      ? user.role === 'admin'
        ? 'Admin Dashboard'
        : user.firstName || 'Account'
      : 'Sign in',
    to: user
      ? user.role === 'admin'
        ? '/admin/dashboard'
        : '/account/dashboard'
      : '/login',
  }

  const handleLogout = () => {
    dispatch(logout())
    onClose()
    navigate('/')
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: 'min(88vw, 360px)' } } }}
    >
      <nav aria-label="Mobile navigation" className="flex h-full flex-col">
        <div className="flex min-h-16 items-center justify-between px-5">
          <Typography
            component={NavLink}
            to="/"
            onClick={onClose}
            aria-label="FitLand home"
            color="text.primary"
            sx={{ fontSize: '1.25rem', fontWeight: 800, textDecoration: 'none' }}
          >
            FITLAND
          </Typography>
          <IconButton aria-label="Close navigation menu" onClick={onClose}>
            <CloseRoundedIcon />
          </IconButton>
        </div>
        <Divider />
        <List aria-label="Store">
          {primaryNavigation.map((item) => (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              sx={{
                minHeight: 52,
                '&.active': {
                  bgcolor: 'secondary.main',
                  fontWeight: 700,
                },
              }}
            >
              <ListItemText
                primary={item.label}
                slotProps={{ primary: { sx: { fontWeight: 'inherit' } } }}
              />
            </ListItemButton>
          ))}
        </List>
        <Divider />
        <List aria-label="Your account">
          <ListItemButton
            component={NavLink}
            to={accountItem.to}
            onClick={onClose}
            sx={{ minHeight: 52 }}
          >
            <ListItemIcon sx={{ minWidth: 42 }}>
              <AccountCircleOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary={accountItem.label} />
          </ListItemButton>
          {secondaryNavigation.map((item) => (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              onClick={onClose}
              sx={{ minHeight: 52 }}
            >
              <ListItemIcon sx={{ minWidth: 42 }}>
                {accountIcons[item.label]}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
          {user ? (
            <ListItemButton onClick={handleLogout} sx={{ minHeight: 52 }}>
              <ListItemIcon sx={{ minWidth: 42 }}>
                <LogoutRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          ) : null}
        </List>
      </nav>
    </Drawer>
  )
}
