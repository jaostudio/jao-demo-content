function deepSort(obj: unknown): unknown {
  if (obj === null || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(deepSort)
  const sorted: Record<string, unknown> = {}
  for (const key of Object.keys(obj).sort()) {
    const val = (obj as Record<string, unknown>)[key]
    sorted[key] = val === undefined ? null : deepSort(val)
  }
  return sorted
}

export function stableJson(data: Record<string, unknown>): string {
  return JSON.stringify(deepSort(data))
}
