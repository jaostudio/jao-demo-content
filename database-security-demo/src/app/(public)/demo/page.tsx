'use client'

import { DemoIdentityCard } from '@/components/demo-identity-card'
import { GlassCard } from '@/components/ui/glass-card'
import { Badge } from '@/components/ui/badge'
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from '@/lib/demo-accounts'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function DemoPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleManualSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid credentials')
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <main className="grid-bg">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="admin">Try IslaVault</Badge>
          <Badge variant="tenant">password {DEMO_PASSWORD}</Badge>
        </div>
        <h1 className="text-3xl font-bold text-isla-white">Launch Security Demo</h1>
        <p className="mt-3 text-isla-muted max-w-2xl">
          Select a demo identity to explore tenant boundaries, test RBAC enforcement, and inspect
          the audit trail.
        </p>

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-isla-white mb-4">Demo Accounts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DEMO_ACCOUNTS.map((account) => (
              <DemoIdentityCard key={account.email} {...account} />
            ))}
          </div>
        </div>

        <div className="mt-12">
          <GlassCard hover={false}>
            <h2 className="text-lg font-semibold text-isla-white mb-4">Or use your own credentials</h2>
            <form onSubmit={handleManualSignIn} className="space-y-4 max-w-sm">
              <div>
                <label htmlFor="email" className="block text-xs text-isla-muted mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-isla-volcanic border border-isla-border text-isla-white text-sm focus:outline-none focus:border-isla-amethyst transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-xs text-isla-muted mb-1">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-isla-volcanic border border-isla-border text-isla-white text-sm focus:outline-none focus:border-isla-amethyst transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
              {error && <p className="text-xs text-isla-danger">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-lg text-sm font-medium bg-isla-amethyst text-white hover:bg-isla-amethyst/90 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </GlassCard>
        </div>
      </div>

      <footer className="border-t border-isla-border py-6 text-center text-xs text-isla-muted">
        IslaVault — A fictional Philippine-inspired secure client portal. Not a real product.
      </footer>
    </main>
  )
}
