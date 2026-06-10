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
    <div className="mx-auto mt-20 max-w-md px-4">
      <h1 className="mb-8 text-center font-display text-3xl font-bold">{t('sign_in_title')}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-bold">{t('email')}</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-black bg-white px-3 py-2 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 dark:border-white dark:bg-[#1A1A1A]" />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-bold">{t('password')}</label>
          <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 border-black bg-white px-3 py-2 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 dark:border-white dark:bg-[#1A1A1A]" />
        </div>
        {error && <p className="text-sm font-bold text-coral-500">{error}</p>}
        <button type="submit" className="w-full rounded-none border-2 border-black bg-black px-4 py-2.5 text-sm font-bold text-saffron-500 hover:nb-shadow dark:border-white dark:bg-white dark:text-black">{t('sign_in_title')}</button>
      </form>
      <p className="mt-4 text-center text-sm text-neutral-600">
        {t('no_account')} <Link href="/register" className="font-bold underline hover:text-saffron-600">{t('register_title')}</Link>
      </p>
    </div>
  )
}
