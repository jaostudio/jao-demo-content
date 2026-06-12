'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function SignInForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const t = useTranslations('auth')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError(t('invalid_credentials'))
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-sm px-4">
      <h1 className="mb-6 text-center text-xl font-bold text-text-primary dark:text-slate-100">{t('sign_in_title')}</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
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
        <button type="submit" className="w-full rounded-full bg-primary py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover">{t('sign_in_title')}</button>
      </form>
      <p className="mt-4 text-center text-sm text-text-muted">
        {t('no_account')} <Link href="/register" className="font-medium text-primary hover:text-primary-hover">{t('register_title')}</Link>
      </p>
    </div>
  )
}
