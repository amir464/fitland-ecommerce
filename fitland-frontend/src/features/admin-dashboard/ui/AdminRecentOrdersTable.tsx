import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import {
  Box,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Link } from 'react-router'

import type { SafeUser } from '@/entities/auth/model/auth.types'
import type { Order } from '@/entities/order/model/order.schema'
import {
  calculateOrderItemCount,
  sortOrdersNewestFirst,
} from '@/features/admin-dashboard/lib/adminDashboard'
import { OrderStatusChip } from '@/features/customer-dashboard/ui/OrderStatusChip'
import { getOrderSuccessPath } from '@/shared/config/routePaths'
import { formatCurrency } from '@/shared/lib/formatCurrency'

const dateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' })

export function AdminRecentOrdersTable({
  orders,
  users,
}: {
  orders: readonly Order[]
  users: readonly SafeUser[]
}) {
  const recentOrders = sortOrdersNewestFirst(orders).slice(0, 8)
  const usersById = new Map(users.map((user) => [user.id, user]))

  return (
    <Card id="orders" component="section" sx={{ minWidth: 0 }}>
      <Box sx={{ p: { xs: 2, sm: 2.5 }, pb: 1 }}>
        <Typography component="h2" variant="h6" sx={{ fontWeight: 800 }}>
          Recent orders
        </Typography>
        <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
          Latest store activity, newest first.
        </Typography>
      </Box>
      <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
        <Table aria-label="Recent store orders" sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              <TableCell>Order</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Items</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">View</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentOrders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell sx={{ fontWeight: 700, maxWidth: 180, overflowWrap: 'anywhere' }}>
                  {order.orderNumber || order.id}
                </TableCell>
                <TableCell sx={{ maxWidth: 220, overflowWrap: 'anywhere' }}>
                  {getCustomerDisplay(order, usersById)}
                </TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell><OrderStatusChip status={order.status} /></TableCell>
                <TableCell>{calculateOrderItemCount(order)}</TableCell>
                <TableCell align="right">{formatCurrency(order.total, order.currency)}</TableCell>
                <TableCell align="right">
                  <Button
                    component={Link}
                    size="small"
                    startIcon={<VisibilityOutlinedIcon />}
                    to={getOrderSuccessPath(order.id)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}

function getCustomerDisplay(order: Order, usersById: ReadonlyMap<string, SafeUser>) {
  const customerName = `${order.customer.firstName} ${order.customer.lastName}`.trim()
  if (customerName) return customerName
  if (order.customer.email.trim()) return order.customer.email

  const user = order.userId ? usersById.get(order.userId) : undefined
  const userName = user ? `${user.firstName} ${user.lastName}`.trim() : ''
  return userName || user?.email || 'Guest customer'
}

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : dateFormatter.format(date)
}
