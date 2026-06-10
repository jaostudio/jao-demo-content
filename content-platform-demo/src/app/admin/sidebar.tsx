'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffectiveRole } from '@/hooks/use-effective-role'
import { LayoutDashboard, PenLine, BarChart3 } from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()
  const { role: effectiveRole } = useEffectiveRole()
  const isAdmin = effectiveRole === 'ADMIN'
  const t = useTranslations('common')

  const links = isAdmin
    ? [
        { href: '/admin', label: t('dashboard'), icon: LayoutDashboard },
        { href: '/admin/articles/new', label: t('new_article'), icon: PenLine },
        { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
      ]
    : [
        { href: '/admin', label: t('dashboard'), icon: LayoutDashboard },
        { href: '/admin/articles/new', label: t('new_article'), icon: PenLine },
      ]

  return (
    <aside className="hidden w-48 shrink-0 md:block">
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon
          const active = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href))
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 border-l-4 px-3 py-2 text-sm font-bold transition-colors ${
                active
                  ? 'border-saffron-500 bg-saffron-100 text-black dark:bg-saffron-900/30 dark:text-white'
                  : 'border-transparent text-neutral-600 hover:border-black hover:bg-black/5 dark:text-neutral-400 dark:hover:border-white dark:hover:bg-white/5'
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
