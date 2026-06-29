'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, PenLine, LayoutDashboard, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useDemoRoleStore } from '@/store/demo-role-store'

interface NavItem {
  href: string
  icon: typeof Home
  label: string
  auth?: boolean
  profile?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/explore', icon: Compass, label: 'Explore' },
  { href: '/admin/articles/new', icon: PenLine, label: 'Create', auth: true },
  { href: '/studio', icon: LayoutDashboard, label: 'Studio', auth: true },
  { href: '/signin', icon: User, label: 'Profile', profile: true },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const { user } = useAuth()
  const { enabled: demoEnabled, role: demoRole } = useDemoRoleStore()

  const hasAccess = !!(user || (demoEnabled && (demoRole === 'AUTHOR' || demoRole === 'ADMIN')))

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-hairline bg-surface dark:bg-surface-dark lg:hidden pb-safe">
      <div className="flex items-center justify-around py-1">
        {NAV_ITEMS.map(({ href, icon: Icon, label, auth, profile }) => {
          if (auth && !hasAccess && label !== 'Profile') return null

          if (profile) {
            if (user || (demoEnabled && demoRole)) {
              return (
                <Link
                  key="profile"
                  href="/studio"
                  className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-all duration-150 active:scale-90 ${
                    pathname === '/studio' ? 'text-text-primary' : 'text-graphite'
                  }`}
                >
                  <User className={`h-5 w-5 transition-all duration-150 ${pathname === '/studio' ? '-translate-y-0.5' : ''}`} strokeWidth={pathname === '/studio' ? 2 : 1.5} />
                  <span className={`text-[9px] font-medium transition-all duration-150 ${pathname === '/studio' ? 'opacity-100' : 'opacity-60'}`}>
                    Profile
                  </span>
                </Link>
              )
            }
            return (
              <Link
                key="profile"
                href="/signin"
                className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-all duration-150 active:scale-90 ${
                  pathname === '/signin' ? 'text-text-primary' : 'text-graphite'
                }`}
              >
                <User className={`h-5 w-5 transition-all duration-150 ${pathname === '/signin' ? '-translate-y-0.5' : ''}`} strokeWidth={pathname === '/signin' ? 2 : 1.5} />
                <span className={`text-[9px] font-medium transition-all duration-150 ${pathname === '/signin' ? 'opacity-100' : 'opacity-60'}`}>
                  Sign In
                </span>
              </Link>
            )
          }

          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-all duration-150 active:scale-90 ${
                active ? 'text-text-primary' : 'text-graphite'
              }`}
            >
              <Icon className={`h-5 w-5 transition-all duration-150 ${active ? '-translate-y-0.5' : ''}`} strokeWidth={active ? 2 : 1.5} />
              <span className={`text-[9px] font-medium transition-all duration-150 ${active ? 'opacity-100' : 'opacity-60'}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
