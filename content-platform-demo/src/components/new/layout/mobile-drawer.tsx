'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { useAuth } from '@/hooks/useAuth'

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
}

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const { user } = useAuth()

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
                Home
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
                    Dashboard
                  </Link>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <Link href="/admin/articles/new" className="rounded px-3 py-2 text-[13px] font-medium text-text-secondary hover:bg-surface-alt hover:text-text-primary transition-colors">
                    New Article
                  </Link>
                </Dialog.Close>
              </>
            )}
          </nav>
          <div className="mt-auto flex items-center gap-2 border-t border-hairline p-3">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
