export function createStorage<T>(key: string, fallback: T) {
  function load(): T {
    if (typeof window === 'undefined') return fallback
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return fallback
      return JSON.parse(raw) as T
    } catch {
      return fallback
    }
  }

  function save(data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch {
      console.warn(`Failed to save to localStorage key: ${key}`)
    }
  }

  function clear(): void {
    localStorage.removeItem(key)
  }

  return { load, save, clear }
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
