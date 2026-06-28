import app from '@content-platform/backend/app'

export async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  if (process.env.BACKEND_URL) {
    const base = process.env.BACKEND_URL
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 10000)
    const res = await fetch(`${base}${path}`, {
      signal: controller.signal,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    }).finally(() => clearTimeout(timer))
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      throw new Error(body?.message ?? `API error: ${res.status}`)
    }
    return res.json()
  }
  const req = new Request(new URL(path, 'http://localhost'), {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  const res = await app.request(req)
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.message ?? `API error: ${res.status}`)
  }
  return res.json()
}
