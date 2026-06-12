'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Header } from '../../layout/header'
import { Footer } from '../../layout/footer'
import { Button } from '../../ui/button'

export function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const t = useTranslations('auth')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const result = await signIn('credentials', { email, password, redirect: false })

    if (result?.error) {
      setError(t('invalid_credentials'))
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <>
      <Header />
      <main className="container-likha py-16">
        <div className="mx-auto max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-bold text-text-primary">{t('sign_in_title')}</h1>
            <p className="text-sm text-text-muted mt-2">Magkwento. Magbahagi. Mag-aral.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-text-secondary mb-1.5">{t('email')}</label>
              <input
                id="email" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input h-10 text-sm"
                placeholder="sarah@content.dev"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-text-secondary mb-1.5">{t('password')}</label>
              <input
                id="password" type="password" required value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input h-10 text-sm"
                placeholder="password123"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-danger/20 bg-danger-light px-4 py-3 text-xs text-danger">
                {error}
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" className="w-full">
              {t('sign_in_title')}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            {t('no_account')}{' '}
            <Link href="/register" className="font-medium text-primary hover:text-primary-hover">
              {t('register_title')}
            </Link>
          </p>

          {/* Demo credentials hint */}
          <div className="mt-8 rounded-lg border border-border bg-surface-alt p-4">
            <p className="text-[11px] font-medium text-text-muted mb-2">Demo access:</p>
            <div className="space-y-1 text-[11px] text-text-muted">
              <p><span className="font-medium text-text-secondary">sarah@content.dev</span> — Author</p>
              <p><span className="font-medium text-text-secondary">marcus@content.dev</span> — Author</p>
              <p><span className="font-medium text-text-secondary">admin@content.dev</span> — Admin</p>
              <p className="mt-1 text-[10px]">Password: <span className="font-medium text-text-secondary">password123</span></p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
