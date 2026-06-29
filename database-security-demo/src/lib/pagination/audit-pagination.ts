export function parseAuditLimit(value: string | undefined): number {
  const n = Number(value)
  if (!Number.isInteger(n) || n <= 0) return 50
  return Math.min(n, 100)
}

export function buildAuditNextHref(nextCursor: string, limit: number): string {
  return `/audit?before=${encodeURIComponent(nextCursor)}&limit=${limit}`
}
