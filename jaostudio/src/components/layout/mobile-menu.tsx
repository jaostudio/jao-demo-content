'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import NextLink from 'next/link'
import { useTranslations } from 'next-intl'
import { easeOut } from '@/lib/motion-variants'
import { scrollToHash, updateUrlHash } from '@/lib/scroll-to-hash'
import { usePathname } from 'next/navigation'

const MENU_EXIT_MS = 350

type NavLink =
  | { type: 'hash'; label: string; href: string }
  | { type: 'route'; label: string; href: string }

interface MobileMenuProps {
  open: boolean
  navLinks: NavLink[]
  onClose: () => void
  locale: string
  themeContent: React.ReactNode
  localeButton: React.ReactNode
  menuRef: React.RefObject<HTMLDivElement | null>
  onNavigate: () => void
  localizeHref: (raw: string) => string
}

export default function MobileMenu({
  open,
  navLinks,
  onClose,
  themeContent,
  localeButton,
  menuRef,
  onNavigate,
  localizeHref,
}: MobileMenuProps) {
  const pathname = usePathname()
  const t = useTranslations('navbar')

  if (typeof window === 'object' && open) {
    return createPortal(
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: easeOut }}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          ref={menuRef}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-8 bg-bg-primary md:hidden pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]"
        >
          {navLinks.map((link, i) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <NextLink
                href={link.href}
                scroll={!link.href.includes('#')}
                onClick={(e) => {
                  const isSamePageHash = link.href.includes('#') && (pathname === '/' || pathname === '/tl')
                  const isCurrentPage = !link.href.includes('#') && pathname === link.href
                  if (isCurrentPage) {
                    e.preventDefault()
                    onClose()
                    return
                  }
                  if (isSamePageHash) {
                    e.preventDefault()
                    onClose()
                    updateUrlHash(link.href)
                    setTimeout(() => scrollToHash(link.href), MENU_EXIT_MS)
                    return
                  }
                  onNavigate()
                  onClose()
                }}
                className={`focus-ring text-2xl font-medium transition-colors py-2 ${
                  pathname === link.href ? 'text-accent' : 'text-text-primary hover:text-text-secondary'
                }`}
              >
                {link.label}
              </NextLink>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex items-center gap-3"
          >
            {localeButton}
            {themeContent}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <NextLink
              href={localizeHref('/#contact')}
              onClick={(e) => {
                e.preventDefault()
                onClose()
                if (pathname === '/' || pathname === '/tl') {
                  updateUrlHash(localizeHref('/#contact'))
                  setTimeout(() => scrollToHash(localizeHref('/#contact')), MENU_EXIT_MS)
                  return
                }
                onNavigate()
                setTimeout(() => {
                  window.location.href = localizeHref('/#contact')
                }, MENU_EXIT_MS)
              }}
              className="focus-ring mt-4 inline-block rounded-xl bg-accent px-6 py-3 text-base font-medium text-white"
            >
              {t('cta')}
            </NextLink>
          </motion.div>
        </motion.div>
      </AnimatePresence>,
      document.body,
    )
  }

  return null
}
