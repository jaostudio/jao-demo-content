'use client'

import { useDemoRoleStore, type DemoRole } from '@/store/demo-role-store'
import { useSession } from 'next-auth/react'

const roleLabels: Record<DemoRole, string> = {
  READER: '👤 Reader',
  AUTHOR: '✍️ Author',
  ADMIN: '👑 Admin',
}

const roles: DemoRole[] = ['READER', 'AUTHOR', 'ADMIN']

export function DemoRoleSwitcher() {
  const { data: session } = useSession()
  const { enabled, role, enableDemoMode, disableDemoMode, setRole } = useDemoRoleStore()

  if (session?.user) return null

  return (
    <div className="fixed bottom-20 left-2 z-50 md:bottom-4 md:left-4">
      <div className="flex items-center gap-1.5 border-2 border-black bg-cream px-2 py-1 nb-shadow dark:border-white dark:bg-[#1A1A1A] md:px-3 md:py-1.5">
        <span className="hidden text-[10px] font-bold text-neutral-500 md:inline">Demo:</span>
        <div className="flex gap-0.5">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => {
                if (!enabled) enableDemoMode()
                setRole(r)
              }}
              className={`rounded-none px-1.5 py-0.5 text-[10px] font-bold transition-colors md:px-2 md:text-xs ${
                enabled && role === r
                  ? 'border border-black bg-saffron-500 text-black dark:border-white dark:text-black'
                  : 'text-neutral-500 hover:bg-black/5 dark:text-neutral-400 dark:hover:bg-white/5'
              }`}
            >
              {roleLabels[r]}
            </button>
          ))}
        </div>
        {enabled && (
          <button
            onClick={disableDemoMode}
            className="ml-1 rounded-full p-0.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            aria-label="Disable demo mode"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
