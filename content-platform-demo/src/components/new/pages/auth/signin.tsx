'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
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
    <div className="min-h-screen bg-surface dark:bg-surface-dark flex items-center justify-center px-4">
      <div className="w-full max-w-[320px]">
        <div className="text-center mb-8">
          <p className="text-[13px] font-semibold text-text-primary tracking-tight mb-4">Likha</p>
          <h1 className="text-[17px] font-semibold text-text-primary">{t('sign_in_title')}</h1>
          <p className="text-[13px] text-graphite mt-1">Magkwento. Magbahagi. Mag-aral.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="email" className="block text-[11px] font-medium text-graphite mb-1">{t('email')}</label>
            <input
              id="email" type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input h-9 text-[13px]"
              placeholder="sarah@content.dev"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-[11px] font-medium text-graphite mb-1">{t('password')}</label>
            <input
              id="password" type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input h-9 text-[13px]"
              placeholder="password123"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-danger/20 bg-danger-light px-3 py-2 text-[11px] text-danger">
              {error}
            </div>
          )}

          <Button type="submit" variant="accent" size="lg" className="w-full">
            {t('sign_in_title')}
          </Button>
        </form>

        <p className="mt-4 text-center text-[13px] text-graphite">
          {t('no_account')}{' '}
          <Link href="/register" className="font-medium text-text-primary hover:text-graphite">
            {t('register_title')}
          </Link>
        </p>

        <div className="mt-6 rounded-lg border border-hairline bg-surface-alt dark:bg-surface-dark p-3">
          <p className="text-[11px] font-medium text-fog-gray mb-2">Demo access:</p>
          <div className="space-y-1 text-[11px] text-fog-gray">
            <p><span className="font-medium text-graphite">sarah@content.dev</span> — Author</p>
            <p><span className="font-medium text-graphite">marcus@content.dev</span> — Author</p>
            <p><span className="font-medium text-graphite">admin@content.dev</span> — Admin</p>
            <p className="mt-1 text-[10px]">Password: <span className="font-medium text-graphite">password123</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
