import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import { Box, Container, Typography } from '@mui/material'
import { useMemo } from 'react'
import { useNavigate } from 'react-router'

import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { useCustomerOrdersQuery } from '@/entities/order/api/useCustomerOrdersQuery'
import { logout, selectCurrentUser } from '@/features/auth/model'
import {
  getCustomerOrderSummary,
  groupCustomerSpendingByMonth,
  groupOrdersByStatus,
} from '@/features/customer-dashboard/lib/orderDashboard'
import { CustomerOrdersTable } from '@/features/customer-dashboard/ui/CustomerOrdersTable'
import {
  MonthlySpendingChart,
  OrderStatusChart,
} from '@/features/customer-dashboard/ui/DashboardCharts'
import {
  DashboardMobileNavigation,
  DashboardSidebar,
} from '@/features/customer-dashboard/ui/DashboardNavigation'
import { DashboardProfile } from '@/features/customer-dashboard/ui/DashboardProfile'
import {
  DashboardEmptyState,
  DashboardErrorState,
  DashboardLoadingSkeleton,
} from '@/features/customer-dashboard/ui/DashboardStates'
import { DashboardStatCard } from '@/features/customer-dashboard/ui/DashboardStatCard'
import { formatCurrency } from '@/shared/lib/formatCurrency'

export function Component() {
  const user = useAppSelector(selectCurrentUser)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const ordersQuery = useCustomerOrdersQuery(user?.id ?? '', user?.email ?? '')
  const orders = useMemo(() => ordersQuery.data ?? [], [ordersQuery.data])
  const summary = useMemo(() => getCustomerOrderSummary(orders), [orders])
  const monthlySpending = useMemo(
    () => groupCustomerSpendingByMonth(orders),
    [orders],
  )
  const statusData = useMemo(() => groupOrdersByStatus(orders), [orders])

  if (!user) return null

  const currency = orders.find((order) => order.currency)?.currency ?? 'USD'
  const customerName = `${user.firstName} ${user.lastName}`.trim()
  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <Container component="section" maxWidth="xl" className="py-8 sm:py-10 lg:py-12">
      <DashboardMobileNavigation customerName={customerName} onLogout={handleLogout} />
      <Box
        sx={{
          display: 'grid',
          gap: { xs: 3, lg: 4 },
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: '240px minmax(0, 1fr)' },
          minWidth: 0,
        }}
      >
        <DashboardSidebar customerName={customerName} onLogout={handleLogout} />
        <Box id="overview" component="main" sx={{ minWidth: 0 }}>
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>
            CUSTOMER OVERVIEW
          </Typography>
          <Typography component="h1" variant="h3" sx={{ fontWeight: 900, mt: 0.5 }}>
            Welcome, {user.firstName}.
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 4 }}>
            Track your FitLand orders, spending, and delivery progress.
          </Typography>

          <Box id="orders" sx={{ minWidth: 0 }}>
            {ordersQuery.isPending ? <DashboardLoadingSkeleton /> : null}
            {ordersQuery.isError ? (
              <DashboardErrorState onRetry={() => void ordersQuery.refetch()} />
            ) : null}
            {ordersQuery.isSuccess && orders.length === 0 ? <DashboardEmptyState /> : null}
            {ordersQuery.isSuccess && orders.length > 0 ? (
              <Box sx={{ display: 'grid', gap: 3, minWidth: 0 }}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <DashboardStatCard icon={<ReceiptLongOutlinedIcon />} label="Total orders" value={String(summary.totalOrders)} />
                <DashboardStatCard icon={<PaymentsOutlinedIcon />} label="Total spent" value={formatCurrency(summary.totalSpent, currency)} />
                <DashboardStatCard icon={<CheckCircleOutlineRoundedIcon />} label="Delivered orders" value={String(summary.deliveredOrders)} />
                <DashboardStatCard icon={<LocalShippingOutlinedIcon />} label="Active orders" value={String(summary.activeOrders)} />
              </div>
              <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
                <MonthlySpendingChart currency={currency} data={monthlySpending} />
                <OrderStatusChart data={statusData} />
              </div>
                <CustomerOrdersTable orders={orders} />
              </Box>
            ) : null}
          </Box>
          <Box id="profile" sx={{ mt: 3 }}>
            <DashboardProfile onLogout={handleLogout} user={user} />
          </Box>
        </Box>
      </Box>
    </Container>
  )
}
