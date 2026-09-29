import { Typography, useTheme } from '@mui/material'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type {
  MonthlyCountPoint,
  TopSellingProduct,
} from '@/features/admin-dashboard/lib/adminDashboard'
import type {
  MonthlySpendingPoint,
  OrderStatusPoint,
} from '@/features/customer-dashboard/lib/orderDashboard'
import { DashboardChartCard } from '@/features/customer-dashboard/ui/DashboardChartCard'
import { formatCurrency } from '@/shared/lib/formatCurrency'

const STATUS_COLORS = ['#151713', '#c7f000', '#087f92', '#777b73', '#d05b47', '#9b7fd1']

export function AdminRevenueChart({
  currency,
  data,
}: {
  currency: string
  data: MonthlySpendingPoint[]
}) {
  const theme = useTheme()

  return (
    <DashboardChartCard
      title="Monthly revenue"
      description="Non-cancelled revenue across the latest six calendar months."
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} tickLine={false} width={62} />
          <Tooltip formatter={(value) => formatCurrency(Number(value), currency)} />
          <Line
            dataKey="total"
            dot={{ fill: theme.palette.secondary.main, r: 4 }}
            name="Revenue"
            stroke={theme.palette.primary.main}
            strokeWidth={3}
            type="monotone"
          />
        </LineChart>
      </ResponsiveContainer>
    </DashboardChartCard>
  )
}

export function AdminOrderCountChart({ data }: { data: MonthlyCountPoint[] }) {
  const theme = useTheme()

  return (
    <DashboardChartCard
      title="Monthly orders"
      description="All placed orders, including cancellations."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -28, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} tickLine={false} width={44} />
          <Tooltip formatter={(value) => [`${Number(value)} orders`, 'Count']} />
          <Bar dataKey="count" fill={theme.palette.secondary.main} name="Orders" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </DashboardChartCard>
  )
}

export function AdminOrderStatusChart({ data }: { data: OrderStatusPoint[] }) {
  if (data.length === 0) {
    return <ChartEmptyState title="Order status" message="Status data appears after the first order." />
  }

  return (
    <DashboardChartCard
      title="Order status"
      description="Current distribution across every order status."
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="label"
            cx="50%"
            cy="44%"
            innerRadius="40%"
            outerRadius="66%"
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell key={entry.key} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${Number(value)} orders`, 'Count']} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </DashboardChartCard>
  )
}

export function TopSellingProductsChart({ data }: { data: TopSellingProduct[] }) {
  const theme = useTheme()

  if (data.length === 0) {
    return <ChartEmptyState title="Top-selling products" message="Sales data appears after a non-cancelled order." />
  }

  return (
    <DashboardChartCard
      title="Top-selling products"
      description="Top five products by units sold, excluding cancellations."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 12, left: 6, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis allowDecimals={false} type="number" tick={{ fontSize: 11 }} />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fontSize: 11 }}
            tickFormatter={(value: string) => truncateLabel(value)}
            width={118}
          />
          <Tooltip formatter={(value) => [`${Number(value)} units`, 'Sold']} />
          <Bar dataKey="quantity" fill={theme.palette.primary.main} name="Units sold" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </DashboardChartCard>
  )
}

function ChartEmptyState({ title, message }: { title: string; message: string }) {
  return (
    <DashboardChartCard title={title} description={message}>
      <Typography
        color="text.secondary"
        sx={{ display: 'grid', height: '100%', placeItems: 'center', textAlign: 'center' }}
      >
        {message}
      </Typography>
    </DashboardChartCard>
  )
}

function truncateLabel(value: string) {
  return value.length > 20 ? `${value.slice(0, 18)}…` : value
}
