'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, PenLine, LayoutDashboard, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const NAV_ITEMS = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/explore', icon: Compass, label: 'Explore' },
  { href: '/admin/articles/new', icon: PenLine, label: 'Create', auth: true },
  { href: '/studio', icon: LayoutDashboard, label: 'Studio', auth: true },
  { href: '/signin', icon: User, label: 'Profile', auth: false },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-hairline bg-surface dark:bg-surface-dark lg:hidden">
      <div className="flex items-center justify-around py-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label, auth }) => {
          if (auth && !user && label !== 'Profile') {
            return null
          }
          if (label === 'Profile' && user) {
            return (
              <Link
                key="profile"
                href="/studio"
                className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                  pathname === '/studio' ? 'text-text-primary' : 'text-graphite'
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={pathname === '/studio' ? 2 : 1.5} />
                <span className="text-[9px] font-medium">Profile</span>
              </Link>
            )
          }
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                pathname === href ? 'text-text-primary' : 'text-graphite'
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={pathname === href ? 2 : 1.5} />
              <span className="text-[9px] font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
