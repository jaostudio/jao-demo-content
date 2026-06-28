const BACKEND_URL = process.env.BACKEND_URL

export async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const base = BACKEND_URL || ''
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.message ?? `API error: ${res.status}`)
  }
  return res.json()
}
