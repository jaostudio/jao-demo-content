'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLang } from '@/lib/use-lang'

export default function SignUpPage() {
  const lang = useLang()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        return
      }
      const { signIn } = await import('next-auth/react')
      await signIn('credentials', { email, password, redirect: false })
      router.push('/')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <h1 className="font-[var(--font-display)] text-3xl font-bold">{lang === 'tl' ? 'Mag-sign Up' : 'Sign Up'}</h1>
      <p className="mt-2 text-sm text-muted">{lang === 'tl' ? 'Gumawa ng Sari-Sari account' : 'Create your Sari-Sari account'}</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Name</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full rounded-xl border border-subtle bg-white px-4 py-2.5 text-sm dark:bg-surface" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full rounded-xl border border-subtle bg-white px-4 py-2.5 text-sm dark:bg-surface" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="mt-1 block w-full rounded-xl border border-subtle bg-white px-4 py-2.5 text-sm dark:bg-surface" />
        </div>
        {error && <p className="text-sm text-flag-red">{error}</p>}
        <button type="submit" disabled={loading} className="w-full rounded-xl bg-flag-blue px-6 py-3 text-sm font-semibold text-white transition-colors hover:brightness-90 disabled:opacity-50">
          {loading ? (lang === 'tl' ? 'Gumagawa ng account...' : 'Creating account...') : (lang === 'tl' ? 'Mag-sign Up' : 'Sign Up')}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        {lang === 'tl' ? 'May account ka na?' : 'Already have an account?'}{' '}
        <Link href="/signin" className="font-medium text-flag-blue hover:underline">{lang === 'tl' ? 'Mag-sign in' : 'Sign in'}</Link>
      </p>
    </div>
  )
}
