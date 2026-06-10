'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLang } from '@/lib/use-lang'

export default function SignInPage() {
  const lang = useLang()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    if (result?.error) {
      setError('Invalid email or password')
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <h1 className="font-[var(--font-display)] text-3xl font-bold">{lang === 'tl' ? 'Mag-sign In' : 'Sign In'}</h1>
      <p className="mt-2 text-sm text-muted">{lang === 'tl' ? 'Mag-sign in sa iyong Sari-Sari account' : 'Sign in to your Sari-Sari account'}</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full rounded-xl border border-subtle bg-white px-4 py-2.5 text-sm dark:bg-surface" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full rounded-xl border border-subtle bg-white px-4 py-2.5 text-sm dark:bg-surface" />
        </div>
        {error && <p className="text-sm text-flag-red">{error}</p>}
        <button type="submit" className="w-full rounded-xl bg-flag-blue px-6 py-3 text-sm font-semibold text-white transition-colors hover:brightness-90">
          {lang === 'tl' ? 'Mag-sign In' : 'Sign In'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        {lang === 'tl' ? 'Wala pang account?' : 'No account?'}{' '}
        <Link href="/signup" className="font-semibold text-flag-blue hover:underline">{lang === 'tl' ? 'Mag-sign up' : 'Sign up'}</Link>
      </p>
    </div>
  )
}
