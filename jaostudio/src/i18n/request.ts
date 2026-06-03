import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'
import en from '../../messages/en.json'
import tl from '../../messages/tl.json'

const messages: Record<string, Record<string, unknown>> = { en, tl }

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as 'en' | 'tl')) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: messages[locale],
  }
})
