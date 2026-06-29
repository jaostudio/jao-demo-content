'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { ThemeToggle } from '@/components/theme-toggle'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { useAuth } from '@/hooks/useAuth'
import { useDemoRoleStore, type DemoRole } from '@/store/demo-role-store'
import { getSafeAuthRedirect } from '@/lib/auth/redirect'

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
}

const roleLabels: Record<DemoRole, string> = {
  READER: 'Reader',
  AUTHOR: 'Author',
  ADMIN: 'Admin',
}

const DEMO_USERS = [
  { email: 'sarah@content.dev', label: 'Artist' },
  { email: 'admin@content.dev', label: 'Admin' },
]

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const t = useTranslations('common')
  const router = useRouter()
  const { user, signIn } = useAuth()
  const { enabled: demoEnabled, enableDemoMode, disableDemoMode, setRole } = useDemoRoleStore()

  const handleDemoSignIn = async (email: string) => {
    const result = await signIn(email, 'password123')
    if (result.user) {
      const target = getSafeAuthRedirect(null, result.user.role)
      router.push(target)
      router.refresh()
    }
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-onyx/40" />
        <Dialog.Content className="fixed inset-y-0 left-0 z-[70] flex w-64 flex-col border-r border-hairline bg-surface dark:bg-surface-dark" aria-label="Navigation menu">
          <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
            <span className="text-sm font-semibold text-text-primary">Likha</span>
            <Dialog.Close className="p-1 text-graphite hover:text-text-primary transition-colors" aria-label="Close menu">
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>
          <nav className="flex flex-col gap-px p-2">
            <Dialog.Close asChild>
              <Link href="/" className="rounded px-3 py-2 text-[13px] font-medium text-text-secondary hover:bg-surface-alt hover:text-text-primary transition-colors">
                {t('home')}
              </Link>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Link href="/trending" className="rounded px-3 py-2 text-[13px] font-medium text-text-secondary hover:bg-surface-alt hover:text-text-primary transition-colors">
                Trending
              </Link>
            </Dialog.Close>
            {user && (
              <>
                <Dialog.Close asChild>
                  <Link href="/admin" className="rounded px-3 py-2 text-[13px] font-medium text-text-secondary hover:bg-surface-alt hover:text-text-primary transition-colors">
                    {t('dashboard')}
                  </Link>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <Link href="/studio/new" className="rounded px-3 py-2 text-[13px] font-medium text-text-secondary hover:bg-surface-alt hover:text-text-primary transition-colors">
                    {t('new_article')}
                  </Link>
                </Dialog.Close>
              </>
            )}
          </nav>

          {/* Demo Access section */}
          {!user && (
            <div className="border-t border-hairline p-3 space-y-2">
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-voltage-pink" />
                <p className="text-[11px] font-semibold text-text-primary">Demo Access</p>
              </div>
              <div className="space-y-1">
                {DEMO_USERS.map((demo) => (
                  <button
                    key={demo.email}
                    onClick={() => handleDemoSignIn(demo.email)}
                    className="w-full flex items-center justify-between rounded-lg border border-hairline px-3 py-1.5 text-[11px] hover:border-reactor-green/40 hover:bg-surface-alt transition-all"
                  >
                    <span className="text-graphite">{demo.email}</span>
                    <span className="font-medium text-reactor-green">{demo.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-1">
                {(['READER', 'AUTHOR', 'ADMIN'] as DemoRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => { if (!demoEnabled) enableDemoMode(); setRole(r) }}
                    className={`flex-1 rounded px-2 py-1 text-[10px] font-medium transition-colors ${
                      demoEnabled ? 'bg-reactor-green/10 text-reactor-green' : 'text-fog-gray hover:bg-surface-alt'
                    }`}
                  >
                    {roleLabels[r]}
                  </button>
                ))}
              </div>
              <p className="text-[9px] text-ash">UI simulation only.</p>
              {demoEnabled && (
                <button
                  onClick={() => disableDemoMode()}
                  className="w-full rounded border border-hairline px-2 py-1 text-[10px] text-fog-gray hover:text-text-primary transition-colors"
                >
                  Exit UI Preview
                </button>
              )}
            </div>
          )}

          <div className="mt-auto flex items-center gap-2 border-t border-hairline p-3">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
