export const roleRedirects: Record<string, string> = {
  ADMIN: '/admin',
  AUTHOR: '/studio',
  READER: '/',
}

export function getRoleRedirect(role?: string | null): string {
  if (role === 'ADMIN') return '/admin'
  if (role === 'AUTHOR') return '/studio'
  return '/'
}

export function getSafeAuthRedirect(next: string | null, role?: string | null): string {
  const fallback = getRoleRedirect(role)

  if (!next) return fallback
  if (!next.startsWith('/')) return fallback
  if (next.startsWith('//')) return fallback
  if (next.startsWith('/api')) return fallback

  if (role !== 'ADMIN' && next.startsWith('/admin')) return fallback
  if (role === 'READER' && next.startsWith('/studio')) return fallback

  return next
}
