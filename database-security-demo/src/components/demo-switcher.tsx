'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const demoAccounts = [
  { name: 'Maria Santos', email: 'maria@luntian.demo', role: 'ORG_ADMIN', tenant: 'Luntian Health' },
  { name: 'Paolo Reyes', email: 'paolo@luntian.demo', role: 'ORG_USER', tenant: 'Luntian Health' },
  { name: 'Ana Villarin', email: 'ana@talapay.demo', role: 'ORG_USER', tenant: 'TalaPay' },
  { name: 'Rafael Cruz', email: 'rafael@islavault.demo', role: 'SYSTEM_ADMIN', tenant: 'Global' },
]

export function DemoSwitcher() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleSwitch = async (email: string) => {
    setLoading(email)
    await signIn('credentials', {
      email,
      password: 'password123',
      redirect: false,
    })
    setLoading(null)
    setOpen(false)
    router.refresh()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-isla-border text-isla-muted hover:text-isla-white hover:bg-isla-glass transition-colors"
      >
        Switch Account
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 w-64 glass-card-static p-2 shadow-xl">
            <div className="text-xs text-isla-muted px-2 py-1.5">Switch to another demo account</div>
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                onClick={() => handleSwitch(account.email)}
                disabled={loading === account.email}
                className={cn(
                  'w-full text-left px-2 py-2 rounded-lg text-xs transition-colors flex items-center justify-between',
                  'hover:bg-isla-glass disabled:opacity-50',
                )}
              >
                <div>
                  <div className="text-isla-white">{account.name}</div>
                  <div className="text-isla-muted mono">{account.role} · {account.tenant}</div>
                </div>
                {loading === account.email && <span className="text-isla-amethyst text-xs">switching...</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
