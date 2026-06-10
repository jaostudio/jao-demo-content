'use client'

import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'

type DailySale = { date: string; revenue: number }

export function SalesTrendChart({ data }: { data: DailySale[] }) {
  const [days, setDays] = useState(30)
  const sliced = data.slice(-days)

  return (
    <div className="rounded-xl border border-subtle bg-surface p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Daily Sales Trend</h3>
        <div className="flex gap-1 rounded-lg border border-subtle p-0.5">
          <button onClick={() => setDays(7)} className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${days === 7 ? 'bg-flag-blue text-white' : 'text-muted hover:bg-surface'}`}>7D</button>
          <button onClick={() => setDays(30)} className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${days === 30 ? 'bg-flag-blue text-white' : 'text-muted hover:bg-surface'}`}>30D</button>
        </div>
      </div>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sliced}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E9ECEF" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: '#595959' }}
              tickFormatter={(v) => {
                const d = new Date(v)
                return `${d.getMonth() + 1}/${d.getDate()}`
              }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#595959' }}
              tickFormatter={(v) => `₱${(Number(v) / 100).toFixed(0)}`}
            />
            <Tooltip
              formatter={(value) => [`₱${(Number(value) / 100).toFixed(2)}`, 'Revenue']}
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
            />
            <Line type="monotone" dataKey="revenue" stroke="#0038A8" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
