import { headers } from 'next/headers'
import { routing } from '@/i18n/routing'
import { resolveCanonical } from '@/lib/seo/canonical'
import { SITE_URL } from '@/lib/seo-config'

function stripTrailingSlash(p: string) {
  return p.endsWith('/') ? p.slice(0, -1) : p
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'tl' }]
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || '/'
  const isDefault = locale === routing.defaultLocale

  const cleanPath = stripTrailingSlash(isDefault ? pathname : pathname.replace(/^\/tl/, '') || '/')

  const languages: Record<string, string> = {}
  for (const loc of routing.locales) {
    const prefix = loc === routing.defaultLocale ? '' : `/${loc}`
    languages[loc] = stripTrailingSlash(`https://jaostudio.dev${prefix}${cleanPath}`)
  }
  languages['x-default'] = `https://jaostudio.dev${cleanPath}`

  return {
    alternates: {
      canonical: resolveCanonical(SITE_URL, pathname),
      languages,
    },
  }
}

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
