import Link from 'next/link'
import { getLang } from '@/lib/lang'

export default async function AdminPage() {
  const lang = await getLang()

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-xl bg-surface px-6 py-4">
        <h1 className="font-[var(--font-display)] text-3xl font-bold">{lang === 'tl' ? 'Admin' : 'Admin'}</h1>
        <p className="mt-1 text-sm text-muted">{lang === 'tl' ? 'Pamahalaan ang mga order at tinda ng Sari-Sari.' : 'Manage orders and products for Sari-Sari.'}</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/orders"
          className="group rounded-xl border border-subtle bg-surface p-6 transition-all hover:border-subtle hover:shadow-md dark:border-subtle dark:bg-surface"
        >
          <span className="text-3xl">📋</span>
          <h2 className="mt-3 font-semibold">{lang === 'tl' ? 'Mga Order' : 'Orders'}</h2>
          <p className="mt-1 text-sm text-muted">{lang === 'tl' ? 'Tingnan at pamahalaan ang mga order ng customer' : 'View and manage customer orders'}</p>
        </Link>
        <Link
          href="/admin/products"
          className="group rounded-xl border border-subtle bg-surface p-6 transition-all hover:border-subtle hover:shadow-md dark:border-subtle dark:bg-surface"
        >
          <span className="text-3xl">📦</span>
          <h2 className="mt-3 font-semibold">{lang === 'tl' ? 'Tinda' : 'Products'}</h2>
          <p className="mt-1 text-sm text-muted">{lang === 'tl' ? 'Pamahalaan ang inventory at presyo ng mga tinda' : 'Manage product inventory and pricing'}</p>
        </Link>
        <Link
          href="/admin/returns"
          className="group rounded-xl border border-subtle bg-surface p-6 transition-all hover:border-subtle hover:shadow-md"
        >
          <span className="text-3xl">🔄</span>
          <h2 className="mt-3 font-semibold">{lang === 'tl' ? 'Returns' : 'Returns'}</h2>
          <p className="mt-1 text-sm text-muted">{lang === 'tl' ? 'Suriin ang mga kahilingan ng customer' : 'Review customer return requests'}</p>
        </Link>
        <Link
          href="/admin/reports"
          className="group rounded-xl border border-subtle bg-surface p-6 transition-all hover:border-subtle hover:shadow-md"
        >
          <span className="text-3xl">📊</span>
          <h2 className="mt-3 font-semibold">{lang === 'tl' ? 'Reports' : 'Reports'}</h2>
          <p className="mt-1 text-sm text-muted">{lang === 'tl' ? 'Stats ng benta at alerts sa mababang stock' : 'Sales stats and low stock alerts'}</p>
        </Link>
        <Link
          href="/admin/announcements"
          className="group rounded-xl border border-subtle bg-surface p-6 transition-all hover:border-subtle hover:shadow-md"
        >
          <span className="text-3xl">📢</span>
          <h2 className="mt-3 font-semibold">{lang === 'tl' ? 'Mga Anunsyo' : 'Announcements'}</h2>
          <p className="mt-1 text-sm text-muted">{lang === 'tl' ? 'Mag-set ng banner announcement para sa tindahan' : 'Set store banner announcements'}</p>
        </Link>
      </div>
    </div>
  )
}
