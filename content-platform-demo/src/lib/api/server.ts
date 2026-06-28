const BACKEND_URL = process.env.BACKEND_URL

export async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const base = BACKEND_URL || ''
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
