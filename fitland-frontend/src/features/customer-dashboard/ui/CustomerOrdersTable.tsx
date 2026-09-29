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

import type { Order } from '@/entities/order/model/order.schema'
import {
  getOrderItemCount,
  getRecentOrders,
} from '@/features/customer-dashboard/lib/orderDashboard'
import { getOrderSuccessPath } from '@/shared/config/routePaths'
import { formatCurrency } from '@/shared/lib/formatCurrency'

import { OrderStatusChip } from './OrderStatusChip'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
})

export function CustomerOrdersTable({ orders }: { orders: readonly Order[] }) {
  const recentOrders = getRecentOrders(orders)

  return (
    <Card id="orders" component="section" sx={{ minWidth: 0 }}>
      <Box sx={{ p: { xs: 2, sm: 2.5 }, pb: 1 }}>
        <Typography component="h2" variant="h6" sx={{ fontWeight: 800 }}>
          Recent orders
        </Typography>
        <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
          Your latest FitLand purchases, newest first.
        </Typography>
      </Box>
      <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
        <Table aria-label="Recent customer orders" sx={{ minWidth: 720 }}>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Status</TableCell>
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
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>{getOrderItemCount(order)}</TableCell>
                <TableCell><OrderStatusChip status={order.status} /></TableCell>
                <TableCell align="right">
                  {formatCurrency(order.total, order.currency)}
                </TableCell>
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

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : dateFormatter.format(date)
}
