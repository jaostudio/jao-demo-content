'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (result?.error) setError('Invalid email or password')
    else { router.push('/dashboard'); router.refresh() }
  }

  return (
    <main className="grid-bg min-h-screen flex items-center justify-center px-4">
      <div className="flex max-w-4xl w-full min-h-[480px]">
        <div className="hidden md:flex flex-1 flex-col justify-center pr-12">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-7 h-7 rounded-full border-2 border-isla-amethyst flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-isla-amethyst" />
            </span>
            <span className="font-semibold text-lg text-isla-white">IslaVault</span>
          </div>
          <h1 className="text-3xl font-bold text-isla-white leading-tight mb-4">
            Secure client portals<br />for distributed teams.
          </h1>
          <ul className="space-y-3 text-sm text-isla-muted">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-isla-success shrink-0" />
              Tenant-scoped access
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-isla-violet shrink-0" />
              RBAC enforced
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-isla-green shrink-0" />
              Audit trail recording
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-isla-pacific shrink-0" />
              Turso-backed secure demo
            </li>
          </ul>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="glass-card-static p-8 w-full max-w-sm">
            <h2 className="text-xl font-bold text-isla-white mb-6">Sign In</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs text-isla-muted mb-1.5">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-isla-volcanic border border-isla-border px-3 py-2.5 text-sm text-isla-white placeholder:text-isla-muted focus:outline-none focus:border-isla-amethyst transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-xs text-isla-muted mb-1.5">Password</label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg bg-isla-volcanic border border-isla-border px-3 py-2.5 text-sm text-isla-white placeholder:text-isla-muted focus:outline-none focus:border-isla-amethyst transition-colors"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="text-xs text-isla-danger bg-isla-danger/5 rounded px-3 py-2">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-isla-amethyst px-4 py-2.5 text-sm font-medium text-white hover:bg-isla-amethyst/90 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-isla-border">
              <p className="text-xs text-isla-muted mb-3">Try a demo account instantly</p>
              <Link
                href="/demo"
                className="block w-full text-center rounded-lg border border-isla-border px-4 py-2 text-sm text-isla-white hover:bg-isla-glass transition-colors"
              >
                View Demo Accounts
              </Link>
            </div>

            <p className="mt-4 text-center text-xs text-isla-muted">
              No account?{' '}
              <Link href="/register" className="text-isla-pacific underline hover:no-underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}