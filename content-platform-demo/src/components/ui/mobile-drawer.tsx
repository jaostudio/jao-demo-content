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
        <Menu className="h-5 w-5" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30" />
        <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[80vw] flex-col border-r-2 border-black bg-cream dark:border-white dark:bg-[#1A1A1A]" aria-label="Navigation menu">
          <div className="flex items-center justify-between border-b-2 border-black px-4 py-3 dark:border-white">
            <span className="font-display text-lg font-bold tracking-tight">Likha</span>
            <Dialog.Close className="p-1" aria-label="Close menu">
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>
          <nav className="flex flex-col gap-1 p-4">
            <Dialog.Close asChild>
              <Link href="/" className="border-l-4 border-transparent px-3 py-2 text-sm font-bold transition-colors hover:border-saffron-500 hover:bg-saffron-100 dark:hover:bg-saffron-900/30">
                Home
              </Link>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Link href="/admin" className="border-l-4 border-transparent px-3 py-2 text-sm font-bold transition-colors hover:border-saffron-500 hover:bg-saffron-100 dark:hover:bg-saffron-900/30">
                Dashboard
              </Link>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Link href="/admin/articles/new" className="border-l-4 border-transparent px-3 py-2 text-sm font-bold transition-colors hover:border-saffron-500 hover:bg-saffron-100 dark:hover:bg-saffron-900/30">
                New Article
              </Link>
            </Dialog.Close>
          </nav>
          <div className="mt-auto flex items-center gap-3 border-t-2 border-black p-4 dark:border-white">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
