'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useDemoRoleStore, type DemoRole } from '@/store/demo-role-store'
import { useMounted } from '@/hooks/use-mounted'
import { getSafeAuthRedirect } from '@/lib/auth/redirect'
import { Avatar } from '../ui/avatar'
import { FollowButton } from '@/components/follow-button'
import { DemoTourCard } from '@/components/new/demo/demo-tour-card'

interface AuthorEntry {
  id: string
  name: string
  role: string
  username?: string
}

interface SuggestedFollowsPanelProps {
  categories: { slug: string; name: string }[]
  trending?: { slug: string; title: string; commentCount: number }[]
  suggestedAuthors?: AuthorEntry[]
}

const roleLabels: Record<DemoRole, string> = {
  READER: 'Reader',
  AUTHOR: 'Author',
  ADMIN: 'Admin',
}

const roles: DemoRole[] = ['READER', 'AUTHOR', 'ADMIN']

const DEMO_USERS = [
  { email: 'sarah@content.dev', label: 'Artist' },
  { email: 'admin@content.dev', label: 'Admin' },
]

export function RightPanel({ categories, trending = [], suggestedAuthors = [] }: SuggestedFollowsPanelProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading: authLoading, signIn } = useAuth()
  const mounted = useMounted()
  const { enabled: demoEnabled, role: demoRole, enableDemoMode, disableDemoMode, setRole } = useDemoRoleStore()
  const [demoOpen, setDemoOpen] = useState(false)
  const [signingIn, setSigningIn] = useState<string | null>(null)

  const safeDemoEnabled = mounted ? demoEnabled : false
  const safeDemoRole = mounted ? demoRole : 'READER'

  if (authLoading) {
    return (
      <aside className="space-y-6">
        <div className="animate-pulse rounded-xl bg-hairline h-48" />
        <div className="animate-pulse rounded-xl bg-hairline h-32" />
        <div className="animate-pulse rounded-xl bg-hairline h-24" />
      </aside>
    )
  }

  if (user) {
    return (
      <aside className="space-y-6">
        {/* Demo Access — always visible when authenticated */}
        <div className="rounded-xl border border-hairline bg-card p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-voltage-pink" />
            <h3 className="text-[12px] font-semibold text-text-primary">Demo Access</h3>
            <span className="ml-auto text-[10px] text-ash">{user.role}</span>
          </div>
          <div className="space-y-1 mb-2">
            {DEMO_USERS.map((demo) => (
              <button
                key={demo.email}
                onClick={async () => {
                  setSigningIn(demo.email)
                  const result = await signIn(demo.email, 'password123')
                  if (result.user) {
                    const target = getSafeAuthRedirect(null, result.user.role)
                    router.push(target)
                    router.refresh()
                  }
                  setSigningIn(null)
                }}
                disabled={signingIn !== null}
                className="w-full flex items-center justify-between rounded-lg border border-hairline px-2.5 py-1.5 text-[11px] hover:border-reactor-green/40 hover:bg-surface-alt transition-all disabled:opacity-50"
              >
                <span className="text-graphite">{demo.email}</span>
                <span className="font-medium text-reactor-green">
                  {signingIn === demo.email ? '...' : `Switch to ${demo.label}`}
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setDemoOpen(!demoOpen)}
            className="flex items-center gap-1 text-[10px] text-fog-gray hover:text-text-primary transition-colors"
          >
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${safeDemoEnabled ? 'bg-voltage-pink' : 'bg-hairline'}`} />
            UI Preview {demoOpen ? '▾' : '▸'}
          </button>
          {demoOpen && (
            <div className="mt-2 space-y-2">
              <div className="flex gap-1">
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      if (!safeDemoEnabled) enableDemoMode()
                      setRole(r)
                    }}
                    className={`flex-1 rounded-lg px-2 py-1 text-[10px] font-medium transition-colors ${
                      safeDemoEnabled && safeDemoRole === r
                        ? 'bg-reactor-green text-void-black'
                        : 'text-fog-gray hover:bg-surface-alt'
                    }`}
                  >
                    {roleLabels[r]}
                  </button>
                ))}
              </div>
              <p className="text-[9px] text-ash leading-relaxed">UI only. Backend still requires login.</p>
              {safeDemoEnabled && (
                <button
                  onClick={() => { disableDemoMode(); setDemoOpen(false) }}
                  className="w-full rounded-lg border border-hairline px-2 py-1 text-[9px] text-fog-gray hover:text-text-primary transition-colors"
                >
                  Exit UI Preview
                </button>
              )}
            </div>
          )}
        </div>

        {/* Featured Artists */}
        {suggestedAuthors.length > 0 && (
          <div>
            <h3 className="mb-3 text-[14px] font-semibold text-text-primary">Artists in Studio</h3>
            <div className="space-y-4">
              {suggestedAuthors.map((u) => (
                <div key={u.id} className="flex items-center gap-3">
                  <Link href={u.username ? `/artist/${u.username}` : '#'} className="shrink-0">
                    <Avatar name={u.name} size="md" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link href={u.username ? `/artist/${u.username}` : '#'}>
                      <p className="text-[14px] font-medium text-text-primary truncate">{u.name}</p>
                    </Link>
                    <p className="text-[12px] text-graphite">{u.role}</p>
                  </div>
                  <FollowButton authorId={u.id} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fields */}
        <div>
          <h3 className="mb-3 text-[14px] font-semibold text-text-primary">Fields</h3>
          <div className="space-y-px">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="flex items-center justify-between rounded px-2.5 py-2 text-[14px] text-graphite hover:bg-surface-alt hover:text-text-primary transition-colors"
              >
                <span>{cat.name}</span>
                <span className="text-ash">&rarr;</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Signals */}
        {trending.length > 0 && (
          <div>
            <h3 className="mb-3 text-[14px] font-semibold text-text-primary">Signals</h3>
            <div className="space-y-px">
              {trending.map((item, i) => (
                <Link
                  key={item.slug}
                  href={`/work/${item.slug}`}
                  className="flex items-start gap-2.5 rounded px-2.5 py-2 hover:bg-surface-alt transition-colors"
                >
                  <span className="mt-0.5 text-[12px] font-medium text-ash shrink-0">{i + 1}</span>
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium text-text-primary line-clamp-2">{item.title}</p>
                    <p className="mt-0.5 text-[12px] text-fog-gray">{item.commentCount} conversations</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-hairline pt-4">
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-fog-gray">
            <Link href="/" className="hover:text-graphite transition-colors">Home</Link>
            <Link href="/guidelines" className="hover:text-graphite transition-colors">Guidelines</Link>
            <Link href="/privacy" className="hover:text-graphite transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-graphite transition-colors">Terms</Link>
            <Link href="/rss.xml" className="hover:text-graphite transition-colors">RSS</Link>
          </div>
          <p className="mt-2 text-[12px] text-ash">&copy; {new Date().getFullYear()} Likha</p>
        </div>
      </aside>
    )
  }

  return (
    <aside className="space-y-6">
      {/* Studio Index — Demo Access */}
      {pathname !== '/signin' && (
        <div className="relative overflow-hidden rounded-xl border border-hairline bg-card p-4">
          <div className="pointer-events-none absolute right-0 top-0 h-12 w-12 opacity-[0.15]">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-voltage-pink)" strokeWidth="1">
              <path d="M5 5v14h14" />
              <line x1="17.5" y1="6.5" x2="8.5" y2="15.5" />
              <circle cx="19.5" cy="19.5" r="1.5" />
            </svg>
          </div>
          <div className="pointer-events-none absolute right-0 top-0 h-8 w-8 rounded-bl-xl border-b border-l border-voltage-pink/30" />
          <div className="flex items-center gap-1.5 mb-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-voltage-pink" />
            <h3 className="text-[13px] font-semibold text-text-primary">Studio Index</h3>
          </div>
          <p className="text-[11px] text-fog-gray mb-3">Try Likha as an Artist or Admin.</p>

          <div className="mb-3">
            <DemoTourCard user={user} />
          </div>

          {/* One-click sign-in */}
          <div className="space-y-1.5 mb-3">
            {DEMO_USERS.map((demo) => (
              <button
                key={demo.email}
                onClick={async () => {
                  setSigningIn(demo.email)
                  const result = await signIn(demo.email, 'password123')
                  if (result.user) {
                    const target = getSafeAuthRedirect(null, result.user.role)
                    router.push(target)
                    router.refresh()
                  }
                  setSigningIn(null)
                }}
                disabled={signingIn !== null}
                className="w-full flex items-center justify-between rounded-lg border border-hairline px-3 py-2 text-[12px] hover:border-reactor-green/40 hover:bg-surface-alt transition-all disabled:opacity-50"
              >
                <span className="text-graphite">{demo.email}</span>
                <span className="font-medium text-reactor-green">
                  {signingIn === demo.email ? 'Signing in...' : `Sign in as ${demo.label}`}
                </span>
              </button>
            ))}
          </div>

          {/* UI simulation toggle */}
          <div>
            <button
              onClick={() => setDemoOpen(!demoOpen)}
              className="flex items-center gap-1.5 text-[10px] text-fog-gray hover:text-text-primary transition-colors"
            >
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${safeDemoEnabled ? 'bg-voltage-pink' : 'bg-hairline'}`} />
              UI Preview {demoOpen ? '▾' : '▸'}
            </button>
            {demoOpen && (
              <div className="mt-2 space-y-2">
                <div className="flex gap-1">
                  {roles.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        if (!safeDemoEnabled) enableDemoMode()
                        setRole(r)
                      }}
                      className={`flex-1 rounded-lg px-2 py-1 text-[11px] font-medium transition-colors ${
                        safeDemoEnabled && safeDemoRole === r
                          ? 'bg-reactor-green text-void-black'
                          : 'text-fog-gray hover:bg-surface-alt'
                      }`}
                    >
                      {roleLabels[r]}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-ash leading-relaxed">UI simulation only. Backend permissions still require login.</p>
                {safeDemoEnabled && (
                  <button
                    onClick={() => { disableDemoMode(); setDemoOpen(false) }}
                    className="w-full rounded-lg border border-hairline px-2 py-1 text-[10px] text-fog-gray hover:text-text-primary transition-colors"
                  >
                    Exit UI Preview
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Featured Artists */}
      {suggestedAuthors.length > 0 && (
        <div>
          <h3 className="mb-3 text-[14px] font-semibold text-text-primary">Artists in Studio</h3>
          <div className="space-y-4">
            {suggestedAuthors.map((u) => (
              <div key={u.id} className="flex items-center gap-3">
                <Link href={u.username ? `/artist/${u.username}` : '#'} className="shrink-0">
                  <Avatar name={u.name} size="md" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={u.username ? `/artist/${u.username}` : '#'}>
                    <p className="text-[14px] font-medium text-text-primary truncate">{u.name}</p>
                  </Link>
                  <p className="text-[12px] text-graphite">{u.role}</p>
                </div>
                <FollowButton authorId={u.id} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fields */}
      <div>
        <h3 className="mb-3 text-[14px] font-semibold text-text-primary">Fields</h3>
        <div className="space-y-px">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="flex items-center justify-between rounded px-2.5 py-2 text-[14px] text-graphite hover:bg-surface-alt hover:text-text-primary transition-colors"
            >
              <span>{cat.name}</span>
              <span className="text-ash">&rarr;</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Signals */}
      {trending.length > 0 && (
        <div>
          <h3 className="mb-3 text-[14px] font-semibold text-text-primary">Signals</h3>
          <div className="space-y-px">
            {trending.map((item, i) => (
              <Link
                key={item.slug}
                href={`/work/${item.slug}`}
                className="flex items-start gap-2.5 rounded px-2.5 py-2 hover:bg-surface-alt transition-colors"
              >
                <span className="mt-0.5 text-[12px] font-medium text-ash shrink-0">{i + 1}</span>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-text-primary line-clamp-2">{item.title}</p>
                  <p className="mt-0.5 text-[12px] text-fog-gray">{item.commentCount} conversations</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-hairline pt-4">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-fog-gray">
          <Link href="/" className="hover:text-graphite transition-colors">Home</Link>
          <Link href="/guidelines" className="hover:text-graphite transition-colors">Guidelines</Link>
          <Link href="/privacy" className="hover:text-graphite transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-graphite transition-colors">Terms</Link>
          <Link href="/rss.xml" className="hover:text-graphite transition-colors">RSS</Link>
        </div>
        <p className="mt-2 text-[12px] text-ash">&copy; {new Date().getFullYear()} Likha</p>
      </div>
    </aside>
  )
}
