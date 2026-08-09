import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import { Badge, IconButton, Tooltip } from '@mui/material'
import { Link } from 'react-router'

import { useAppSelector } from '@/app/store/hooks'
import { selectCartTotalUnits } from '@/features/cart/model'

export function CartHeaderAction() {
  const totalCartUnits = useAppSelector(selectCartTotalUnits)
  const itemLabel = totalCartUnits === 1 ? 'item' : 'items'

  return (
    <Tooltip title="Shopping cart">
      <IconButton
        component={Link}
        to="/cart"
        aria-label={`Shopping cart, ${totalCartUnits} ${itemLabel}`}
      >
        <Badge
          badgeContent={totalCartUnits}
          color="secondary"
          invisible={totalCartUnits === 0}
          max={99}
        >
          <ShoppingBagOutlinedIcon />
        </Badge>
      </IconButton>
    </Tooltip>
  )
}
