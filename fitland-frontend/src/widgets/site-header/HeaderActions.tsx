import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import { Button, IconButton, Tooltip } from '@mui/material'
import { Link, useNavigate } from 'react-router'

import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { logout, selectCurrentUser } from '@/features/auth/model'
import { CartHeaderAction } from '@/widgets/site-header/CartHeaderAction'

export function HeaderActions() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector(selectCurrentUser)
  const accountPath = user
    ? user.role === 'admin'
      ? '/admin/dashboard'
      : '/account/dashboard'
    : '/login'

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <div className="hidden items-center gap-0.5 lg:flex">
      {user ? (
        <Button
          component={Link}
          startIcon={<AccountCircleOutlinedIcon />}
          to={accountPath}
          color="inherit"
        >
          {user.role === 'admin' ? 'Admin Dashboard' : user.firstName || 'Account'}
        </Button>
      ) : (
        <Tooltip title="Sign in">
          <IconButton component={Link} to="/login" aria-label="Sign in">
            <AccountCircleOutlinedIcon />
          </IconButton>
        </Tooltip>
      )}
      {user ? (
        <Tooltip title="Logout">
          <IconButton aria-label="Logout" onClick={handleLogout} type="button">
            <LogoutRoundedIcon />
          </IconButton>
        </Tooltip>
      ) : null}
      <CartHeaderAction />
    </div>
  )
}
