'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import NextLink from 'next/link'
import { useTheme } from 'next-themes'
import { useTranslations, useLocale } from 'next-intl'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Logo } from '@/components/layout/logo'
import { scrollToHash, updateUrlHash } from '@/lib/scroll-to-hash'
import { NavHashLink } from '@/components/layout/nav-hash-link'
import { useFocusTrap } from '@/lib/hooks/use-focus-trap'
import { useTransitionController } from '@/animations/hooks/useTransitionController'
import { usePathname } from 'next/navigation'
import { buildLocaleHref } from '@/lib/build-locale-href'
import { runTextMorph } from '@/animations/engines/textMorph'
import { runExitAnimation, markPendingEntry } from '@/lib/locale-transition'

const MobileMenu = dynamic(() => import('@/components/layout/mobile-menu'), { ssr: false })

const MENU_EXIT_MS = 350

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const navigatingRef = useRef(false)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const menuRef = useFocusTrap(mobileOpen, hamburgerRef)
  const locale = useLocale()
  const { theme, setTheme } = useTheme()
  const t = useTranslations('navbar')
  const transition = useTransitionController()

  const localeState = useRef<'idle' | 'morphing' | 'exiting' | 'navigating'>('idle')

  useEffect(() => {
    if (mobileOpen) {
      const scrollY = window.scrollY
      const prevBodyOverflow = document.body.style.overflow
      const prevHtmlOverflow = document.documentElement.style.overflow
      const prevBodyPosition = document.body.style.position
      document.body.setAttribute('data-menu-open', 'true')
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      document.body.style.position = 'relative'
      return () => {
        document.body.removeAttribute('data-menu-open')
        document.body.style.overflow = prevBodyOverflow
        document.documentElement.style.overflow = prevHtmlOverflow
        document.body.style.position = prevBodyPosition
        if (!navigatingRef.current) {
          window.scrollTo(0, scrollY)
        }
      }
    }
  }, [mobileOpen])

  const toggleLocale = useCallback(async () => {
    if (localeState.current !== 'idle') return

    const nextLocale = locale === 'en' ? 'tl' : 'en'
    const main = document.getElementById('main-content')
    const href = buildLocaleHref(nextLocale, window.location.pathname)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!main || reduced) {
      document.cookie = `NEXT_LOCALE=${nextLocale};path=/;max-age=31536000;SameSite=Lax;Secure`
      window.location.href = href
      return
    }

    try {
      localeState.current = 'morphing'
      const label = locale === 'en' ? 'TL' : 'EN'
      await runTextMorph(
        { fromText: label, toText: label, selector: '[data-anim-locale]', frames: 12 },
        new AbortController().signal,
      )

      localeState.current = 'exiting'
      await runExitAnimation(main)

      localeState.current = 'navigating'
      document.cookie = `NEXT_LOCALE=${nextLocale};path=/;max-age=31536000;SameSite=Lax;Secure`
      markPendingEntry()
      window.location.href = href
    } catch {
      localeState.current = 'idle'
    }
  }, [locale])

  const closeMenu = useCallback(() => {
    setMobileOpen(false)
  }, [])

  const handleThemeToggle = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const nextTheme = theme === 'dark' ? 'light' : 'dark'
      const rect = e.currentTarget.getBoundingClientRect()
      const origin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }

      transition.run({
        type: 'theme',
        payload: {
          origin,
          commit: () => setTheme(nextTheme),
        },
      })
    },
    [theme, setTheme, transition],
  )

  const localizeHref = (raw: string) => locale === 'en' ? raw : `/tl${raw}`

  type NavLink =
    | { type: 'hash'; label: string; href: string }
    | { type: 'route'; label: string; href: string }

  const navLinks: NavLink[] = [
    { type: 'route', label: t('demos'), href: localizeHref('/demos') },
    { type: 'route', label: t('services'), href: localizeHref('/services') },
    { type: 'route', label: t('about'), href: localizeHref('/studio') },
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    navigatingRef.current = false
    const hash = window.location.hash
    if (hash) {
      scrollToHash(hash)
    }
  }, [pathname])

  useEffect(() => {
    const onPopState = () => {
      if (window.location.hash) {
        scrollToHash(window.location.hash)
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-[70] transition-all duration-500',
        mobileOpen
          ? 'bg-transparent'
          : scrolled
            ? 'border-b border-border-subtle bg-bg-primary/80 backdrop-blur-xl'
            : 'bg-transparent',
      )}
    >
      <nav
        role="navigation"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-8 lg:px-12">
        <NextLink
          href={localizeHref('/')}
          className={`focus-ring relative text-base font-medium tracking-tight text-text-primary transition-colors hover:text-text-secondary`}
        >
          <Logo size={36} className="text-xl font-bold tracking-tight" />
        </NextLink>

          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) =>
              link.type === 'hash' ? (
                <NavHashLink
                  key={link.href}
                  href={link.href}
                  className="focus-ring text-base text-text-secondary transition-colors hover:text-text-primary"
                >
                  {link.label}
                </NavHashLink>
              ) : (
                <NextLink
                  key={link.href}
                  href={link.href}
                  className={`focus-ring text-base transition-colors ${
                    pathname === link.href ? 'text-text-primary font-medium' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {link.label}
                </NextLink>
              ),
            )}
            <button
              onClick={toggleLocale}
              data-anim-locale
              className="focus-ring rounded-xl border border-border bg-bg-secondary px-2.5 py-1.5 text-xs font-medium uppercase tracking-wider text-text-primary transition-colors hover:text-text-secondary"
              aria-label={`Switch language to ${locale === 'en' ? 'Tagalog' : 'English'}`}
            >
              {locale === 'en' ? 'TL' : 'EN'}
            </button>
            <button
              onClick={handleThemeToggle}
              className="focus-ring rounded-xl border border-border bg-surface-hover p-2 text-text-secondary transition-colors hover:text-text-primary"
              aria-label={theme === 'dark' ? t('themeLight') : t('themeDark')}
            >
              {mounted && theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <NavHashLink
              href={localizeHref('/#contact')}
              className="focus-ring rounded-xl bg-accent px-4 py-2 text-base font-medium text-white transition-[filter,transform] hover:brightness-110 active:scale-[0.99]"
            >
              {t('cta')}
            </NavHashLink>
          </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          data-close-menu
          ref={hamburgerRef}
          className="relative z-50 flex items-center justify-center p-2 md:hidden"
          aria-label={t('toggleMenu')}
        >
          {mobileOpen ? (
            <X className="h-5 w-5 text-text-primary" />
          ) : (
            <Menu className="h-5 w-5 text-text-primary" />
          )}
        </button>
      </nav>

      <MobileMenu
        open={mounted && mobileOpen}
        navLinks={navLinks}
        onClose={closeMenu}
        locale={locale}
        menuRef={menuRef}
        onNavigate={() => { navigatingRef.current = true }}
        localizeHref={localizeHref}
        localeButton={
          <button
            onClick={toggleLocale}
            data-anim-locale
            className="focus-ring rounded-xl border border-border bg-bg-secondary px-3 py-2.5 text-sm font-medium uppercase tracking-wider text-text-primary transition-colors hover:text-text-secondary"
            aria-label={`Switch language to ${locale === 'en' ? 'Tagalog' : 'English'}`}
          >
            {locale === 'en' ? 'TL' : 'EN'}
          </button>
        }
        themeContent={
          <button
            onClick={handleThemeToggle}
            className="focus-ring rounded-xl border border-border bg-bg-secondary p-3 text-text-primary transition-colors hover:text-text-secondary"
            aria-label={theme === 'dark' ? t('themeLight') : t('themeDark')}
          >
            {mounted && (theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
          </button>
        }
      />
    </header>
  )
}
