import { Typography, useTheme } from '@mui/material'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type {
  MonthlySpendingPoint,
  OrderStatusPoint,
} from '@/features/customer-dashboard/lib/orderDashboard'
import { formatCurrency } from '@/shared/lib/formatCurrency'

import { DashboardChartCard } from './DashboardChartCard'

const STATUS_COLORS = ['#151713', '#c7f000', '#087f92', '#777b73', '#d05b47', '#9b7fd1']

export function MonthlySpendingChart({
  currency,
  data,
}: {
  currency: string
  data: MonthlySpendingPoint[]
}) {
  const theme = useTheme()

  return (
    <DashboardChartCard
      title="Monthly spending"
      description="Non-cancelled order totals across the latest six months."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} tickLine={false} width={58} />
          <Tooltip formatter={(value) => formatCurrency(Number(value), currency)} />
          <Bar
            dataKey="total"
            fill={theme.palette.secondary.main}
            name="Spending"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </DashboardChartCard>
  )
}

export function OrderStatusChart({ data }: { data: OrderStatusPoint[] }) {
  if (data.length === 0) {
    return (
      <DashboardChartCard
        title="Order status"
        description="How your orders are progressing."
      >
        <Typography
          color="text.secondary"
          sx={{ display: 'grid', height: '100%', placeItems: 'center', textAlign: 'center' }}
        >
          Status data will appear after your first order.
        </Typography>
      </DashboardChartCard>
    )
  }

  return (
    <DashboardChartCard
      title="Order status"
      description="How your orders are progressing."
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="label"
            cx="50%"
            cy="45%"
            innerRadius="42%"
            outerRadius="68%"
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
