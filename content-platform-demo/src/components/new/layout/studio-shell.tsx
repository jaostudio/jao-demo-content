'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, Clock, CheckCircle, Archive, Plus } from 'lucide-react'

const STUDIO_TABS = [
  { href: '/studio', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/studio?tab=drafts', label: 'Drafts', icon: FileText },
  { href: '/studio?tab=review', label: 'In Review', icon: Clock },
  { href: '/studio?tab=live', label: 'Live', icon: CheckCircle },
  { href: '/studio?tab=archived', label: 'Archived', icon: Archive },
]

interface StudioShellProps {
  children: React.ReactNode
}

export function StudioShell({ children }: StudioShellProps) {
  const pathname = usePathname()
  const isStudioRoot = pathname === '/studio'

  return (
    <div className="flex flex-col h-full">
      {/* Studio Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[17px] font-semibold text-text-primary">Studio</h1>
          <p className="text-[11px] text-fog-gray mt-0.5">Your creative workspace</p>
        </div>
        <Link href="/studio/new">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-reactor-green px-4 py-1.5 text-[12px] font-medium text-void-black hover:bg-reactor-green/90 transition-colors">
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            New Work
          </span>
        </Link>
      </div>

      {/* Studio Nav Tabs */}
      {isStudioRoot && (
        <div className="flex gap-0 border-b border-hairline mb-6 overflow-x-auto">
          {STUDIO_TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = tab.exact
              ? pathname === tab.href
              : pathname === '/studio' && new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('tab') === tab.href.split('tab=')[1]
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`relative shrink-0 flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium transition-colors ${
                  isActive ? 'text-text-primary' : 'text-fog-gray hover:text-text-primary'
                }`}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={isActive ? 2 : 1.5} />
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-reactor-green" />
                )}
              </Link>
            )
          })}
        </div>
      )}

      {/* Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}
