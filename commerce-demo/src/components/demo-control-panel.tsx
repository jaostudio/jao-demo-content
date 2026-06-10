'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { resetDemoData } from '@/lib/actions/demo'
import { toast } from 'sonner'
import { useLang } from '@/lib/use-lang'

export function DemoControlPanel() {
  const router = useRouter()
  const lang = useLang()
  const [open, setOpen] = useState(false)
  const [role, setRole] = useState<'logged-out' | 'customer' | 'admin'>('logged-out')
  const [slowNetwork, setSlowNetwork] = useState(false)

  const switchRole = async (newRole: 'logged-out' | 'customer' | 'admin') => {
    setRole(newRole)
    if (slowNetwork) await new Promise((r) => setTimeout(r, 800))
    if (newRole === 'admin') {
      await signIn('credentials', { email: 'admin@sari-sari.dev', password: 'password123', redirect: false })
      router.push('/admin/orders')
    } else if (newRole === 'customer') {
      await signIn('credentials', { email: 'customer@sari-sari.dev', password: 'password123', redirect: false })
      router.push('/')
    } else {
      await signOut({ redirect: false })
      router.push('/')
    }
  }

  const handleReset = async () => {
    if (!confirm(lang === 'tl' ? 'Ire-reset lahat ng products at orders? Irerefresh ang page.' : 'Reset all products and orders? Page will reload.')) return
    toast.info(lang === 'tl' ? 'Ni-re-reset ang demo data...' : 'Resetting demo data...')
    if (slowNetwork) await new Promise((r) => setTimeout(r, 2000))
    await resetDemoData()
    toast.success(lang === 'tl' ? 'Na-reset na! Nagre-reload...' : 'Data reset! Reloading...')
    router.refresh()
  }

  const toggleSlowNetwork = () => {
    setSlowNetwork(!slowNetwork)
    localStorage.setItem('slowNetwork', String(!slowNetwork))
    if (!slowNetwork) toast.info(lang === 'tl' ? 'Slow network ON — maantala ang mga aksyon' : 'Slow network mode ON')
    else toast.success(lang === 'tl' ? 'Slow network OFF' : 'Slow network mode OFF')
  }

  return (
    <div className="fixed bottom-4 left-4 z-[60]">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="flex h-10 items-center gap-1.5 rounded-full bg-flag-blue px-4 text-sm font-semibold text-white shadow-lg transition-all hover:brightness-90 active:scale-95"
          aria-label={lang === 'tl' ? 'Buksan ang demo controls' : 'Open demo controls'}
        >
          <span className="text-base">🎮</span> Demo
        </button>
      ) : (
        <div className="w-64 rounded-xl border border-subtle bg-page-bg p-4 shadow-2xl dark:border-subtle dark:bg-surface">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">{lang === 'tl' ? 'Demo Controls' : 'Demo Controls'}</span>
            <button onClick={() => setOpen(false)} className="text-xs text-muted hover:text-muted">&times; {lang === 'tl' ? 'Isara' : 'Close'}</button>
          </div>

          <div className="mt-4 space-y-3">
            {/* Role switcher */}
            <div>
              <label className="text-xs font-medium text-muted">{lang === 'tl' ? 'Role' : 'Role'}</label>
              <div className="mt-1 flex gap-1 rounded-lg border border-subtle p-1 dark:border-subtle">
                {(['logged-out', 'customer', 'admin'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => switchRole(r)}
                    className={`flex-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                      role === r ? 'bg-flag-blue text-white' : 'text-muted hover:bg-surface dark:hover:bg-surface'
                    }`}
                  >
                    {r === 'logged-out' && '🚪 Logged Out'}
                    {r === 'customer' && '🛒 Customer'}
                    {r === 'admin' && '⚙️ Admin'}
                  </button>
                ))}
              </div>
            </div>

            {/* Slow network toggle */}
            <label className="flex items-center justify-between gap-2 rounded-lg border border-subtle px-3 py-2 text-xs dark:border-subtle">
              <span className="font-medium text-muted">🐢 {lang === 'tl' ? 'Mabagal na Network' : 'Slow Network'}</span>
              <button
                onClick={toggleSlowNetwork}
                className={`relative h-5 w-9 rounded-full transition-colors ${slowNetwork ? 'bg-flag-blue' : 'bg-muted/30 dark:bg-surface'}`}
              >
                <span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${slowNetwork ? 'translate-x-4' : ''}`} />
              </button>
            </label>

            {/* Reset data */}
            <button
              onClick={handleReset}
              className="w-full rounded-lg border border-flag-red/30 px-3 py-2 text-xs font-medium text-flag-red transition-colors hover:bg-flag-red/10"
            >
              🔄 {lang === 'tl' ? 'I-reset ang Demo Data' : 'Reset Demo Data'}
            </button>

            {/* Quick links */}
            <div className="pt-2">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{lang === 'tl' ? 'Mabilis na Links' : 'Quick Links'}</p>
              {role === 'admin' ? (
                <div className="grid grid-cols-2 gap-1">
                  <Link href="/admin/orders" className="rounded-md px-2 py-1.5 text-xs text-muted hover:bg-surface">📋 {lang === 'tl' ? 'Mga Order' : 'Orders'}</Link>
                  <Link href="/admin/products" className="rounded-md px-2 py-1.5 text-xs text-muted hover:bg-surface">📦 {lang === 'tl' ? 'Tinda' : 'Products'}</Link>
                  <Link href="/admin/returns" className="rounded-md px-2 py-1.5 text-xs text-muted hover:bg-surface">🔄 {lang === 'tl' ? 'Returns' : 'Returns'}</Link>
                  <Link href="/admin/reports" className="rounded-md px-2 py-1.5 text-xs text-muted hover:bg-surface">📊 {lang === 'tl' ? 'Reports' : 'Reports'}</Link>
                  <Link href="/admin/announcements" className="rounded-md px-2 py-1.5 text-xs text-muted hover:bg-surface">📢 {lang === 'tl' ? 'Announce' : 'Announce'}</Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-1">
                  <Link href="/profile" className="rounded-md px-2 py-1.5 text-xs text-muted hover:bg-surface">👤 Profile</Link>
                  <Link href="/profile/addresses" className="rounded-md px-2 py-1.5 text-xs text-muted hover:bg-surface">📍 {lang === 'tl' ? 'Mga Address' : 'Addresses'}</Link>
                  <Link href="/orders" className="rounded-md px-2 py-1.5 text-xs text-muted hover:bg-surface">📦 {lang === 'tl' ? 'Mga Order' : 'Orders'}</Link>
                  <Link href="/notifications" className="rounded-md px-2 py-1.5 text-xs text-muted hover:bg-surface">🔔 {lang === 'tl' ? 'Notifs' : 'Notifs'}</Link>
                  <Link href="/favorites" className="rounded-md px-2 py-1.5 text-xs text-muted hover:bg-surface">❤️ {lang === 'tl' ? 'Mga Paborito' : 'Favorites'}</Link>
                  <Link href="/profile/settings" className="rounded-md px-2 py-1.5 text-xs text-muted hover:bg-surface">⚙️ Settings</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}