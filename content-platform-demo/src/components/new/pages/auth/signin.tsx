'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { AuthShell } from '@/components/new/layout/auth-shell'
import { Button } from '../../ui/button'
import { DemoTourCard } from '@/components/new/demo/demo-tour-card'
import { getSafeAuthRedirect } from '@/lib/auth/redirect'

export function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState(searchParams.get('email') || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()

  const next = searchParams.get('next')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn(email, password)

    if (result.error) {
      setError('Invalid credentials')
      setLoading(false)
    } else if (result.user) {
      const target = getSafeAuthRedirect(next, result.user.role)
      router.push(target)
      router.refresh()
    }
  }

  async function handleDemoSignIn(demoEmail: string) {
    setLoading(true)
    setError('')
    const result = await signIn(demoEmail, 'password123')
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else if (result.user) {
      const target = getSafeAuthRedirect(next, result.user.role)
      router.push(target)
      router.refresh()
    }
  }

  const demoAccess = (
    <div className="rounded-xl p-4" style={{ border: '1px solid var(--brand-border)', backgroundColor: 'var(--brand-surface)' }}>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--color-voltage-pink)' }} />
        <p className="text-[11px] font-semibold" style={{ color: 'var(--brand-ink)' }}>Demo Access</p>
      </div>
      <p className="text-[11px] mb-3" style={{ color: 'var(--brand-muted)' }}>Try Likha without creating an account.</p>
      <div className="mb-3">
        <DemoTourCard user={null} />
      </div>
      <div className="space-y-1.5">
        <button
          onClick={() => handleDemoSignIn('sarah@content.dev')}
          disabled={loading}
          className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-[12px] transition-all disabled:opacity-50"
          style={{ border: '1px solid var(--brand-border)', color: 'var(--brand-muted)' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-reactor-green)'; e.currentTarget.style.backgroundColor = 'var(--brand-surface-soft)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--brand-border)'; e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          <span>sarah@content.dev</span>
          <span className="font-medium" style={{ color: 'var(--color-reactor-green)' }}>Artist</span>
        </button>
        <button
          onClick={() => handleDemoSignIn('admin@content.dev')}
          disabled={loading}
          className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-[12px] transition-all disabled:opacity-50"
          style={{ border: '1px solid var(--brand-border)', color: 'var(--brand-muted)' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-reactor-green)'; e.currentTarget.style.backgroundColor = 'var(--brand-surface-soft)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--brand-border)'; e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          <span>admin@content.dev</span>
          <span className="font-medium" style={{ color: 'var(--color-reactor-green)' }}>Admin</span>
        </button>
      </div>
      <p className="mt-2 text-[10px]" style={{ color: 'var(--brand-faint)' }}>Password: <span className="font-medium" style={{ color: 'var(--brand-muted)' }}>password123</span></p>
    </div>
  )

  return (
    <AuthShell demoAccess={demoAccess} subtitle="Sign in to your studio.">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="email" className="block text-[11px] font-medium mb-1" style={{ color: 'var(--brand-muted)' }}>Email</label>
          <input
            id="email" type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input h-9 text-[13px]"
            placeholder="sarah@content.dev"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-[11px] font-medium mb-1" style={{ color: 'var(--brand-muted)' }}>Password</label>
          <input
            id="password" type="password" required value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input h-9 text-[13px]"
            placeholder="password123"
          />
        </div>

        {error && (
          <div className="rounded-lg px-3 py-2 text-[11px]" style={{ backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)', border: '1px solid var(--color-danger)' }}>
            {error}
          </div>
        )}

        <Button type="submit" variant="accent" size="lg" className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-4 text-center text-[13px]" style={{ color: 'var(--brand-muted)' }}>
        No account?{' '}
        <Link href={`/register${next ? `?next=${encodeURIComponent(next)}` : ''}`} className="font-medium" style={{ color: 'var(--brand-ink)' }}>
          Register
        </Link>
      </p>
    </AuthShell>
  )
}
