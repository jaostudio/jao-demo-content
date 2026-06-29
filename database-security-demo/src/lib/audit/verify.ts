import { createHash } from 'node:crypto'

export type IntegrityStatus = 'VERIFIED' | 'TAMPERED' | 'UNVERIFIED'

export function verifyAuditEvent(event: {
  eventHash?: string | null
  previousHash?: string | null
  canonicalPayload?: string | null
}): IntegrityStatus {
  if (!event.eventHash || !event.canonicalPayload) {
    return 'UNVERIFIED'
  }

  const recomputedHash = sha256(`${event.previousHash ?? ''}${event.canonicalPayload}`)

  return recomputedHash === event.eventHash ? 'VERIFIED' : 'TAMPERED'
}

function sha256(input: string): string {
  return createHash('sha256').update(input, 'utf-8').digest('hex')
}
