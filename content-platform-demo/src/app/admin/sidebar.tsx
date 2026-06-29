'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffectiveRole } from '@/hooks/use-effective-role'
import { LayoutDashboard, Shield, BarChart3 } from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()
  const { role: effectiveRole } = useEffectiveRole()
  const isAdmin = effectiveRole === 'ADMIN'
  const t = useTranslations('common')

  const links = isAdmin
    ? [
        { href: '/admin', label: t('dashboard'), icon: LayoutDashboard },
        { href: '/admin/review', label: 'Review', icon: Shield },
        { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
      ]
    : [
        { href: '/admin', label: t('dashboard'), icon: LayoutDashboard },
      ]

  return (
    <aside className="hidden w-48 shrink-0 md:block">
      <nav className="space-y-0.5">
        {links.map((link) => {
          const Icon = link.icon
          const active = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href))
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-primary-light text-primary dark:bg-primary/10 dark:text-primary'
                  : 'text-text-secondary hover:bg-slate-100 hover:text-text-primary dark:hover:bg-slate-700 dark:hover:text-slate-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
