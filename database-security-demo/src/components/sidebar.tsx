'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, FileText, ScrollText, FlaskConical,
  Settings, ShieldCheck, Building2,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, roles: ['*'] },
  { href: '/documents', label: 'Documents', icon: FileText, roles: ['*'] },
  { href: '/audit', label: 'Audit Trail', icon: ScrollText, roles: ['*'] },
  { href: '/security-lab', label: 'Security Lab', icon: FlaskConical, roles: ['*'] },
  { href: '/settings', label: 'Settings', icon: Settings, roles: ['ORG_ADMIN', 'SYSTEM_ADMIN'] },
  { href: '/admin/users', label: 'System Admin', icon: ShieldCheck, roles: ['SYSTEM_ADMIN'] },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const user = session?.user as any
  const role = user?.role ?? ''

  return (
    <aside className="w-56 shrink-0 border-r border-isla-border bg-isla-volcanic/60 h-screen sticky top-0 flex flex-col">
      <div className="flex items-center gap-2 px-4 h-14 border-b border-isla-border">
        <span className="w-5 h-5 rounded-full border-2 border-isla-amethyst flex items-center justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-isla-amethyst" />
        </span>
        <span className="font-semibold text-sm text-isla-white">IslaVault</span>
      </div>

      <nav className="flex-1 py-3 px-2 space-y-1">
        {navItems.map((item) => {
          if (item.roles[0] !== '*' && !item.roles.includes(role)) return null
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all',
                isActive
                  ? 'bg-isla-amethyst/10 text-isla-amethyst border border-isla-amethyst/20'
                  : 'text-isla-muted hover:text-isla-white hover:bg-isla-glass border border-transparent',
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-isla-border">
        <Link
          href="/architecture"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-isla-muted hover:text-isla-white hover:bg-isla-glass transition-all"
        >
          <Building2 className="w-3.5 h-3.5" />
          Architecture
        </Link>
      </div>
    </aside>
  )
}
