'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AuthShell } from '@/components/new/layout/auth-shell'
import { Button } from '../../ui/button'
import { useAuth } from '@/hooks/useAuth'
import { getSafeAuthRedirect } from '@/lib/auth/redirect'

export function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()

  const next = searchParams.get('next')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.message || 'Registration failed')
        setLoading(false)
        return
      }

      const data = await res.json()

      if (data.token) {
        localStorage.setItem('likha-token', data.token)
      }

      const role = data.user?.role || 'AUTHOR'
      const target = getSafeAuthRedirect(next, role)
      router.push(target)
      router.refresh()
    } catch {
      setError('Something went wrong. Try again.')
      setLoading(false)
    }
  }

  return (
    <AuthShell subtitle="Create your studio account.">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="name" className="block text-[11px] font-medium mb-1" style={{ color: 'var(--brand-muted)' }}>Name</label>
          <input
            id="name" type="text" required value={name}
            onChange={(e) => setName(e.target.value)}
            className="input h-9 text-[13px]"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-[11px] font-medium mb-1" style={{ color: 'var(--brand-muted)' }}>Email</label>
          <input
            id="email" type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input h-9 text-[13px]"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-[11px] font-medium mb-1" style={{ color: 'var(--brand-muted)' }}>Password</label>
          <input
            id="password" type="password" required value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input h-9 text-[13px]"
            placeholder="At least 8 characters"
          />
        </div>

        {error && (
          <div className="rounded-lg px-3 py-2 text-[11px]" style={{ backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)', border: '1px solid var(--color-danger)' }}>
            {error}
          </div>
        )}

        <Button type="submit" variant="accent" size="lg" className="w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="mt-4 text-center text-[13px]" style={{ color: 'var(--brand-muted)' }}>
        Already have an account?{' '}
        <Link href={`/signin${next ? `?next=${encodeURIComponent(next)}` : ''}`} className="font-medium" style={{ color: 'var(--brand-ink)' }}>
          Sign in
        </Link>
      </p>
    </AuthShell>
  )
}
