'use client'

import Link from 'next/link'
import { useCart } from '@/lib/store/cart'
import { ShoppingCart, Menu, X, Sun, Moon, Search, Languages, Bell, User, CheckCheck, Heart } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { setLangCookie } from '@/lib/use-lang'
import { signOut, useSession } from 'next-auth/react'
import type { Lang } from '@/lib/lang'
import { SearchCommand } from './search-command'

type NotificationItem = {
  id: string
  type: string
  message: string
  link: string | null
  isRead: boolean
  createdAt: string
}

export function Nav() {
  const router = useRouter()
  const { data: session } = useSession()
  const role = (session?.user as { role?: string })?.role
  const totalItems = useCart((s) => s.items.reduce((sum, i) => sum + i.quantity, 0))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [lang, setLang] = useState<Lang>('en')
  const [searchQuery, setSearchQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [profileOpen, setProfileOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') {
      setIsDark(stored === 'dark')
      document.documentElement.classList.toggle('dark', stored === 'dark')
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDark(prefersDark)
      document.documentElement.classList.toggle('dark', prefersDark)
    }
    const langCookie = document.cookie.replace(/(?:(?:^|.*;\s*)lang\s*=\s*([^;]*).*$)|^.*$/, '$1')
    setLang(langCookie === 'tl' ? 'tl' : 'en')
  }, [])

  useEffect(() => {
    if (!session?.user) return
    const fetchNotifs = async () => {
      try {
        const res = await fetch('/api/notifications')
        if (res.ok) {
          const data = await res.json()
          setNotifications(data.notifications)
          setUnreadCount(data.unread)
        }
      } catch { /* ignore */ }
    }
    fetchNotifs()
    const interval = setInterval(fetchNotifs, 15000)
    return () => clearInterval(interval)
  }, [session?.user])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const markAllRead = async () => {
    await fetch('/api/notifications', { method: 'POST' })
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    setUnreadCount(0)
  }

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  const toggleLang = () => {
    const next: Lang = lang === 'en' ? 'tl' : 'en'
    setLang(next)
    setLangCookie(next)
    router.refresh()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (q) {
      router.push(`/products?q=${encodeURIComponent(q)}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b-2 border-flag-blue bg-page-bg/90 backdrop-blur dark:border-flag-blue dark:bg-page-bg/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-flag-blue">Sari-Sari</span>
          <span className="hidden text-xs text-muted sm:inline">{lang === 'tl' ? 'isang tindahan, libong paninda' : 'one store, a thousand items'}</span>
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          <form onSubmit={handleSearch} className="relative">
            <input
              ref={searchRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'tl' ? 'Maghanap ng tinda...' : 'Search products...'}
              className="w-48 rounded-lg border border-subtle bg-white px-3 py-1.5 pl-8 text-sm dark:bg-surface"
              aria-label={lang === 'tl' ? 'Maghanap ng tinda' : 'Search products'}
            />
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          </form>
          <Link href="/products" className="text-sm font-medium text-stone-600 transition-colors hover:text-muted dark:text-muted dark:hover:text-muted">
            {lang === 'tl' ? 'Tinda' : 'Products'}
          </Link>
          <Link href="/orders" className="text-sm font-medium text-stone-600 transition-colors hover:text-muted dark:text-muted dark:hover:text-muted">
            {lang === 'tl' ? 'Mga Order' : 'Orders'}
          </Link>
          {session?.user && (
            <Link href="/favorites" aria-label={lang === 'tl' ? 'Mga Paborito' : 'Favorites'} className="text-sm font-medium text-stone-600 transition-colors hover:text-muted dark:text-muted dark:hover:text-muted">
              <Heart className="h-4 w-4" />
            </Link>
          )}

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button onClick={() => setNotifOpen(!notifOpen)} aria-label={lang === 'tl' ? 'Mga Notifikasyon' : 'Notifications'} className="relative rounded-lg p-2 text-muted transition-colors hover:bg-surface hover:text-muted dark:text-muted dark:hover:bg-surface dark:hover:text-muted">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-flag-red text-[9px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-subtle bg-surface p-3 shadow-lg dark:bg-surface">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">{lang === 'tl' ? 'Mga Notifikasyon' : 'Notifications'}</p>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-flag-blue hover:underline">
                      <CheckCheck className="h-3 w-3" /> {lang === 'tl' ? 'Markahan lahat' : 'Mark all read'}
                    </button>
                  )}
                </div>
                <div className="mt-2 max-h-64 space-y-1 overflow-y-auto text-sm text-stone-600 dark:text-muted">
                  {notifications.length === 0 ? (
                    <p className="py-6 text-center text-xs text-muted">{lang === 'tl' ? 'Wala pang notifikasyon.' : 'No notifications yet.'}</p>
                  ) : (
                    notifications.map((n) => (
                      <a
                        key={n.id}
                        href={n.link ?? '#'}
                        className={`block rounded-lg px-3 py-2 transition-colors hover:bg-surface dark:hover:bg-surface ${!n.isRead ? 'bg-flag-blue/5 font-medium' : ''}`}
                      >
                        <p className="text-xs">{n.message}</p>
                        <p className="mt-0.5 text-[10px] text-muted">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </p>
                      </a>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile / Sign In */}
          {session?.user ? (
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 rounded-lg p-1 text-muted transition-colors hover:bg-surface dark:hover:bg-surface">
                {session.user.image ? (
                  <img src={session.user.image} alt="" className="h-7 w-7 rounded-full object-cover" />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-subtle bg-surface p-2 shadow-lg dark:bg-surface">
                  {role === 'admin' && (
                    <>
                      <Link href="/admin" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-flag-blue hover:bg-surface dark:hover:bg-surface">
                        {lang === 'tl' ? 'Admin Dashboard' : 'Admin Dashboard'}
                      </Link>
                      <Link href="/admin/orders" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-surface dark:text-muted dark:hover:bg-surface">
                        {lang === 'tl' ? 'Pamahalaan Orders' : 'Manage Orders'}
                      </Link>
                      <Link href="/admin/products" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-surface dark:text-muted dark:hover:bg-surface">
                        {lang === 'tl' ? 'Tinda' : 'Products'}
                      </Link>
                      <Link href="/admin/bundles" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-surface dark:text-muted dark:hover:bg-surface">
                        {lang === 'tl' ? 'Bundles' : 'Bundles'}
                      </Link>
                      <Link href="/admin/flash-sales" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-surface dark:text-muted dark:hover:bg-surface">
                        {lang === 'tl' ? 'Flash Sales' : 'Flash Sales'}
                      </Link>
                      <Link href="/admin/reports" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-surface dark:text-muted dark:hover:bg-surface">
                        {lang === 'tl' ? 'Reports' : 'Reports'}
                      </Link>
                      <Link href="/admin/announcements" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-surface dark:text-muted dark:hover:bg-surface">
                        {lang === 'tl' ? 'Anunsyo' : 'Announcements'}
                      </Link>
                      <hr className="my-2 border-subtle" />
                    </>
                  )}
                  <Link href="/profile" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-surface dark:text-muted dark:hover:bg-surface">
                    {lang === 'tl' ? 'Profile' : 'Profile'}
                  </Link>
                  <Link href="/profile/addresses" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-surface dark:text-muted dark:hover:bg-surface">
                    {lang === 'tl' ? 'Mga Address' : 'Addresses'}
                  </Link>
                  <Link href="/orders" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-surface dark:text-muted dark:hover:bg-surface">
                    {lang === 'tl' ? 'Mga Order Ko' : 'My Orders'}
                  </Link>
                  <Link href="/notifications" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-surface dark:text-muted dark:hover:bg-surface">
                    {lang === 'tl' ? 'Mga Notifikasyon' : 'Notifications'}
                  </Link>
                  <Link href="/favorites" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-surface dark:text-muted dark:hover:bg-surface">
                    {lang === 'tl' ? 'Mga Paborito' : 'Favorites'}
                  </Link>
                  <hr className="my-1 border-subtle" />
                  <Link href="/profile/settings" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-surface dark:text-muted dark:hover:bg-surface">
                    {lang === 'tl' ? 'Settings' : 'Settings'}
                  </Link>
                  <button onClick={() => signOut({ callbackUrl: '/' })} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-flag-red hover:bg-surface dark:hover:bg-surface">
                    {lang === 'tl' ? 'Mag-sign Out' : 'Sign Out'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/signin" className="text-sm font-semibold text-flag-blue transition-colors hover:underline">
              {lang === 'tl' ? 'Mag-sign In' : 'Sign In'}
            </Link>
          )}

          <Link href="/cart" aria-label={lang === 'tl' ? 'Basket' : 'Cart'} className="relative text-sm font-medium text-stone-600 transition-colors hover:text-muted dark:text-muted dark:hover:text-muted">
            <ShoppingCart className="h-5 w-5" />
            <span aria-live="polite" aria-atomic="true">
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-flag-blue text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </span>
          </Link>
          <button onClick={toggleLang} aria-label="Toggle language" className="rounded-lg p-2 text-xs font-bold uppercase tracking-wider text-muted transition-colors hover:bg-surface hover:text-muted dark:text-muted dark:hover:bg-surface dark:hover:text-muted">
            <Languages className="h-4 w-4" />
          </button>
          <button onClick={toggleTheme} aria-label={isDark ? 'Switch to light mode' : 'Switch to night market mode'} className="rounded-lg p-2 text-muted transition-colors hover:bg-surface hover:text-muted dark:text-muted dark:hover:bg-surface dark:hover:text-muted">
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </nav>

        <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation menu" className="md:hidden">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <SearchCommand />
      {mobileOpen && (
        <div className="border-t border-subtle px-4 py-4 md:hidden dark:border-subtle">
          <form onSubmit={handleSearch} className="relative mb-3">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'tl' ? 'Maghanap ng tinda...' : 'Search products...'}
              className="w-full rounded-lg border border-subtle bg-white px-3 py-2 pl-8 text-sm dark:bg-surface"
              aria-label={lang === 'tl' ? 'Maghanap ng tinda' : 'Search products'}
            />
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          </form>
          <div className="flex flex-col gap-3">
            <Link href="/products" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-stone-600 dark:text-muted">
              {lang === 'tl' ? 'Tinda' : 'Products'}
            </Link>
            <Link href="/orders" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-stone-600 dark:text-muted">
              {lang === 'tl' ? 'Mga Order' : 'Orders'}
            </Link>
            <Link href="/cart" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-stone-600 dark:text-muted">
              {lang === 'tl' ? 'Basket' : 'Cart'} {totalItems > 0 ? `(${totalItems})` : ''}
            </Link>
            {session?.user ? (
              <>
                {role === 'admin' && (
                  <>
                    <Link href="/admin" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-flag-blue">{lang === 'tl' ? 'Admin Dashboard' : 'Admin Dashboard'}</Link>
                    <Link href="/admin/orders" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-stone-600 dark:text-muted">{lang === 'tl' ? 'Pamahalaan Orders' : 'Manage Orders'}</Link>
                    <Link href="/admin/products" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-stone-600 dark:text-muted">{lang === 'tl' ? 'Tinda' : 'Products'}</Link>
                    <Link href="/admin/bundles" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-stone-600 dark:text-muted">{lang === 'tl' ? 'Bundles' : 'Bundles'}</Link>
                    <Link href="/admin/flash-sales" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-stone-600 dark:text-muted">{lang === 'tl' ? 'Flash Sales' : 'Flash Sales'}</Link>
                    <Link href="/admin/reports" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-stone-600 dark:text-muted">{lang === 'tl' ? 'Reports' : 'Reports'}</Link>
                    <Link href="/admin/announcements" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-stone-600 dark:text-muted">{lang === 'tl' ? 'Anunsyo' : 'Announcements'}</Link>
                    <hr className="my-1 border-subtle" />
                  </>
                )}
                <Link href="/profile" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-flag-blue">{lang === 'tl' ? 'Profile' : 'Profile'}</Link>
                <Link href="/profile/addresses" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-stone-600 dark:text-muted">{lang === 'tl' ? 'Mga Address' : 'Addresses'}</Link>
                <Link href="/notifications" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-stone-600 dark:text-muted">{lang === 'tl' ? 'Mga Notifikasyon' : 'Notifications'}</Link>
                <Link href="/favorites" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-stone-600 dark:text-muted">{lang === 'tl' ? 'Mga Paborito' : 'Favorites'}</Link>
                <button onClick={() => { signOut({ callbackUrl: '/' }); setMobileOpen(false) }} className="text-left text-sm font-medium text-flag-red">{lang === 'tl' ? 'Mag-sign Out' : 'Sign Out'}</button>
              </>
            ) : (
              <Link href="/signin" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-flag-blue">{lang === 'tl' ? 'Mag-sign In' : 'Sign In'}</Link>
            )}
            <div className="flex gap-2">
              <button onClick={toggleLang} className="flex items-center gap-2 rounded-lg border border-subtle px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-muted">
                <Languages className="h-4 w-4" />{lang === 'tl' ? 'EN' : 'TL'}
              </button>
              <button onClick={toggleTheme} className="flex items-center gap-2 rounded-lg border border-subtle px-3 py-1.5 text-sm text-stone-600 dark:text-muted">
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {isDark ? 'Light Mode' : 'Night Market'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
