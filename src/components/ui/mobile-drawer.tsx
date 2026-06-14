'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X, Menu } from 'lucide-react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { LocaleSwitcher } from '@/components/locale-switcher'

export function MobileDrawer() {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="p-1 md:hidden" aria-label="Open navigation menu">
        <Menu className="h-5 w-5 text-text-secondary" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30" />
        <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card dark:border-border-dark dark:bg-card-dark" aria-label="Navigation menu">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 dark:border-border-dark">
            <span className="text-lg font-bold text-primary">Likha</span>
            <Dialog.Close className="rounded-full p-1 text-text-muted hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close menu">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>
          <nav className="flex flex-col gap-0.5 p-2">
            <Dialog.Close asChild>
              <Link href="/" className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-slate-100 hover:text-text-primary dark:hover:bg-slate-700">
                Home
              </Link>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Link href="/admin" className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-slate-100 hover:text-text-primary dark:hover:bg-slate-700">
                Dashboard
              </Link>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Link href="/admin/articles/new" className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-slate-100 hover:text-text-primary dark:hover:bg-slate-700">
                New Article
              </Link>
            </Dialog.Close>
          </nav>
          <div className="mt-auto flex items-center gap-2 border-t border-border p-3 dark:border-border-dark">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
