'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'

type CatRev = { name: string; revenue: number }

export function CategoryRevenueChart({ data }: { data: CatRev[] }) {
  return (
    <div className="rounded-xl border border-subtle bg-surface p-6">
      <h3 className="text-sm font-semibold">Revenue by Category</h3>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#E9ECEF" />
            <XAxis type="number" tick={{ fontSize: 10, fill: '#595959' }} tickFormatter={(v) => `₱${(Number(v) / 100).toFixed(0)}`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#595959' }} width={100} />
            <Tooltip formatter={(value) => [`₱${(Number(value) / 100).toFixed(2)}`, 'Revenue']} />
            <Bar dataKey="revenue" fill="#0038A8" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
