'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'

export default function RegisterForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const t = useTranslations('auth')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || t('register_failed'))
      return
    }

    const result = await signIn('credentials', { email, password, redirect: false })
    if (result?.ok) {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-sm px-4">
      <h1 className="mb-6 text-center text-xl font-semibold text-text-primary dark:text-slate-100">{t('register_title')}</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-text-secondary">{t('name')}</label>
          <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-card-dark" />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-text-secondary">{t('email')}</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-card-dark" />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-text-secondary">{t('password')}</label>
          <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-card-dark" />
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <button type="submit" className="w-full rounded-full bg-primary py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover">{t('register_title')}</button>
      </form>
      <p className="mt-4 text-center text-sm text-text-muted">
        {t('has_account')} <Link href="/signin" className="font-medium text-primary hover:text-primary-hover">{t('sign_in_title')}</Link>
      </p>
    </div>
  )
}
