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
    <div className="mx-auto mt-20 max-w-md px-4">
      <h1 className="mb-8 text-center font-display text-3xl font-bold">{t('register_title')}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-bold">{t('name')}</label>
          <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
            className="w-full border-2 border-black bg-white px-3 py-2 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 dark:border-white dark:bg-[#1A1A1A]" />
        </div>
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
        <button type="submit" className="w-full rounded-none border-2 border-black bg-black px-4 py-2.5 text-sm font-bold text-saffron-500 hover:nb-shadow dark:border-white dark:bg-white dark:text-black">{t('register_title')}</button>
      </form>
      <p className="mt-4 text-center text-sm text-neutral-600">
        {t('has_account')} <Link href="/signin" className="font-bold underline hover:text-saffron-600">{t('sign_in_title')}</Link>
      </p>
    </div>
  )
}
