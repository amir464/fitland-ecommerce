import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import { Alert, Box, Card, Chip, Container, Stack, Typography } from '@mui/material'
import { useMemo } from 'react'
import { useNavigate } from 'react-router'

import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { useAdminUsersQuery } from '@/entities/auth/api/useAdminUsersQuery'
import { useAdminOrdersQuery } from '@/entities/order/api/useAdminOrdersQuery'
import { useProductsQuery } from '@/entities/product/api/useProductsQuery'
import {
  calculateOrderStatusCounts,
  calculateTopSellingProducts,
  calculateTotalRevenue,
  countCustomerUsers,
  groupOrderCountByMonth,
  groupRevenueByMonth,
} from '@/features/admin-dashboard/lib/adminDashboard'
import {
  AdminOrderCountChart,
  AdminOrderStatusChart,
  AdminRevenueChart,
  TopSellingProductsChart,
} from '@/features/admin-dashboard/ui/AdminDashboardCharts'
import {
  AdminDashboardMobileNavigation,
  AdminDashboardSidebar,
} from '@/features/admin-dashboard/ui/AdminDashboardNavigation'
import { AdminRecentOrdersTable } from '@/features/admin-dashboard/ui/AdminRecentOrdersTable'
import {
  AdminDashboardEmptyState,
  AdminDashboardLoadingSkeleton,
  AdminOrdersErrorState,
} from '@/features/admin-dashboard/ui/AdminDashboardStates'
import { logout, selectCurrentUser, selectIsAdmin } from '@/features/auth/model'
import { DashboardStatCard } from '@/features/customer-dashboard/ui/DashboardStatCard'
import { formatCurrency } from '@/shared/lib/formatCurrency'

export function Component() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector(selectCurrentUser)
  const isAdmin = useAppSelector(selectIsAdmin)
  const ordersQuery = useAdminOrdersQuery(isAdmin)
  const usersQuery = useAdminUsersQuery(isAdmin)
  const productsQuery = useProductsQuery(isAdmin)

  const orders = useMemo(() => ordersQuery.data ?? [], [ordersQuery.data])
  const users = useMemo(() => usersQuery.data ?? [], [usersQuery.data])
  const products = useMemo(() => productsQuery.data ?? [], [productsQuery.data])
  const revenue = useMemo(() => calculateTotalRevenue(orders), [orders])
  const customerCount = useMemo(() => countCustomerUsers(users), [users])
  const monthlyRevenue = useMemo(() => groupRevenueByMonth(orders), [orders])
  const monthlyOrders = useMemo(() => groupOrderCountByMonth(orders), [orders])
  const statusCounts = useMemo(() => calculateOrderStatusCounts(orders), [orders])
  const topProducts = useMemo(
    () => calculateTopSellingProducts(orders, products),
    [orders, products],
  )

  if (!user || !isAdmin) return null

  const adminName = `${user.firstName} ${user.lastName}`.trim() || user.email
  const currency = orders.find((order) => order.currency)?.currency ?? 'USD'
  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <Container component="section" maxWidth="xl" className="py-8 sm:py-10 lg:py-12">
      <AdminDashboardMobileNavigation adminName={adminName} onLogout={handleLogout} />
      <Box
        sx={{
          display: 'grid',
          gap: { xs: 3, lg: 4 },
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: '250px minmax(0, 1fr)' },
          minWidth: 0,
        }}
      >
        <AdminDashboardSidebar adminName={adminName} onLogout={handleLogout} />
        <Box id="overview" component="main" sx={{ minWidth: 0 }}>
          <Card
            component="header"
            sx={{
              alignItems: { sm: 'center' },
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              justifyContent: 'space-between',
              mb: 3,
              overflow: 'hidden',
              p: { xs: 2.5, sm: 3 },
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="overline" sx={{ color: 'secondary.main', fontWeight: 900 }}>
                STORE ANALYTICS
              </Typography>
              <Typography component="h1" variant="h3" sx={{ fontWeight: 900, mt: 0.5 }}>
                Admin overview
              </Typography>
              <Typography sx={{ color: 'grey.300', mt: 1 }}>
                Revenue, customers, inventory, and order activity in one place.
              </Typography>
            </Box>
            <Stack sx={{ alignItems: { sm: 'flex-end' }, flexShrink: 0 }}>
              <Chip label="Live demo data" color="secondary" size="small" sx={{ fontWeight: 800 }} />
              <Typography sx={{ fontWeight: 800, mt: 1 }}>{adminName}</Typography>
              <Typography variant="caption" sx={{ color: 'grey.300' }}>{user.email}</Typography>
            </Stack>
          </Card>

          {ordersQuery.isPending ? <AdminDashboardLoadingSkeleton /> : null}
          {ordersQuery.isError ? (
            <AdminOrdersErrorState onRetry={() => void ordersQuery.refetch()} />
          ) : null}

          {ordersQuery.isSuccess ? (
            <Box sx={{ display: 'grid', gap: 3, minWidth: 0 }}>
              {usersQuery.isError ? (
                <Alert
                  action={<RetryLabel onRetry={() => void usersQuery.refetch()} />}
                  severity="warning"
                >
                  Customer totals are temporarily unavailable. Order analytics remain available.
                </Alert>
              ) : null}
              {productsQuery.isError ? (
                <Alert
                  action={<RetryLabel onRetry={() => void productsQuery.refetch()} />}
                  severity="warning"
                >
                  Product catalog totals are temporarily unavailable. Sales use order item names.
                </Alert>
              ) : null}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <DashboardStatCard icon={<PaidOutlinedIcon />} label="Total revenue" value={formatCurrency(revenue, currency)} />
                <DashboardStatCard icon={<ReceiptLongOutlinedIcon />} label="Total orders" value={String(orders.length)} />
                <Box id="customers" sx={{ minWidth: 0 }}>
                  <DashboardStatCard icon={<GroupOutlinedIcon />} label="Total customers" value={usersQuery.isSuccess ? String(customerCount) : '—'} />
                </Box>
                <Box id="products" sx={{ minWidth: 0 }}>
                  <DashboardStatCard icon={<Inventory2OutlinedIcon />} label="Total products" value={productsQuery.isSuccess ? String(products.length) : '—'} />
                </Box>
              </div>

              {orders.length === 0 ? <AdminDashboardEmptyState /> : null}

              <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
                <AdminRevenueChart currency={currency} data={monthlyRevenue} />
                <AdminOrderCountChart data={monthlyOrders} />
                <AdminOrderStatusChart data={statusCounts} />
                <TopSellingProductsChart data={topProducts} />
              </div>

              {orders.length > 0 ? <AdminRecentOrdersTable orders={orders} users={users} /> : null}
            </Box>
          ) : null}
        </Box>
      </Box>
    </Container>
  )
}

function RetryLabel({ onRetry }: { onRetry: () => void }) {
  return (
    <Typography
      component="button"
      onClick={onRetry}
      sx={{ bgcolor: 'transparent', border: 0, color: 'inherit', cursor: 'pointer', fontWeight: 800 }}
    >
      Retry
    </Typography>
  )
}
