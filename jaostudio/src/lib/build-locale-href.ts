const LOCALE_PREFIXES = ['en', 'tl'] as const

export function buildLocaleHref(
  targetLocale: string,
  currentPathname: string,
): string {
  const segments = currentPathname.split('/').filter(Boolean)
  const hasLocalePrefix =
    segments.length > 0 &&
    LOCALE_PREFIXES.includes(segments[0] as (typeof LOCALE_PREFIXES)[number])
  const cleanPath = hasLocalePrefix
    ? '/' + segments.slice(1).join('/')
    : currentPathname

  if (targetLocale === 'en') return cleanPath || '/'
  return `/tl${cleanPath === '/' ? '' : cleanPath}`
}
