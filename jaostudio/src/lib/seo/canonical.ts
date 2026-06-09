export function resolveCanonical(baseUrl: string, pathname: string) {
  const clean = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
  return `${baseUrl}${clean}`
}
