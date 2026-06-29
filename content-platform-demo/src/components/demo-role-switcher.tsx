'use client'

import { useState } from 'react'
import { useDemoRoleStore, type DemoRole } from '@/store/demo-role-store'
import { useAuth } from '@/hooks/useAuth'
import { Info } from 'lucide-react'

const roleLabels: Record<DemoRole, string> = {
  READER: 'Reader',
  AUTHOR: 'Author',
  ADMIN: 'Admin',
}

const roles: DemoRole[] = ['READER', 'AUTHOR', 'ADMIN']

export function DemoRoleSwitcher() {
  const { user } = useAuth()
  const { enabled, role, enableDemoMode, disableDemoMode, setRole } = useDemoRoleStore()
  const [open, setOpen] = useState(false)

  if (user) return null

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {open && (
        <div className="mb-2 w-56 rounded-xl border border-hairline bg-card p-3 shadow-lg dark:bg-surface-dark">
          <div className="flex items-start gap-2 mb-2">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-voltage-pink" strokeWidth={1.5} />
            <p className="text-[10px] text-fog-gray leading-relaxed">
              Demo Mode simulates UI roles for preview. Backend permissions still require login.
            </p>
          </div>
          <div className="flex gap-1 mb-2">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => {
                  if (!enabled) enableDemoMode()
                  setRole(r)
                }}
                className={`flex-1 rounded-lg px-2 py-1 text-[11px] font-medium transition-colors ${
                  enabled && role === r
                    ? 'bg-reactor-green text-void-black'
                    : 'text-fog-gray hover:bg-surface-alt'
                }`}
              >
                {roleLabels[r]}
              </button>
            ))}
          </div>
          {enabled && (
            <button
              onClick={() => { disableDemoMode(); setOpen(false) }}
              className="w-full rounded-lg border border-hairline px-2 py-1 text-[10px] text-fog-gray hover:text-text-primary transition-colors"
            >
              Disable Demo Mode
            </button>
          )}
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-full border border-hairline bg-card px-3 py-1.5 text-[11px] text-fog-gray shadow-sm hover:border-voltage-pink/30 hover:text-text-primary transition-all dark:bg-surface-dark"
      >
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${enabled ? 'bg-voltage-pink' : 'bg-hairline'}`} />
        Demo{enabled && `: ${roleLabels[role]}`}
      </button>
    </div>
  )
}
