'use server'

import { cookies } from 'next/headers'

export type Lang = 'en' | 'tl'

export async function getLang(): Promise<Lang> {
  const cookieStore = await cookies()
  const lang = cookieStore.get('lang')?.value
  return lang === 'tl' ? 'tl' : 'en'
}

export async function setLang(lang: Lang) {
  const cookieStore = await cookies()
  cookieStore.set('lang', lang, { path: '/', maxAge: 60 * 60 * 24 * 365 })
}