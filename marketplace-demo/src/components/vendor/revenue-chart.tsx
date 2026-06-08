'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface RevenueChartProps {
  data: { date: string; revenue: number }[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-warm-sm dark:border-neutral-800 dark:bg-neutral-900">
      <h3 className="font-serif text-lg font-bold text-neutral-800 dark:text-neutral-100">
        Revenue (last 30 days)
      </h3>
      <p className="mt-1 text-xs text-neutral-500">Daily revenue from paid orders</p>
      <div className="mt-5 h-64">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-neutral-400">
            No revenue data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `₱${(v / 100).toLocaleString()}`}
              />
              <Tooltip
                formatter={(value) => [
                  `₱${(Number(value) / 100).toLocaleString()}`,
                  'Revenue',
                ]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#c2693d"
                strokeWidth={2}
                dot={{ fill: '#c2693d', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
