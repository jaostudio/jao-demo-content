import { createHash } from 'node:crypto'
import { getPrisma } from '@/lib/prisma'
import { stableJson } from './stable-json'
import type { AuditAction } from '@/lib/audit-actions'

export type WriteAuditEventInput = {
  action: AuditAction | string
  outcome: 'SUCCESS' | 'DENIED' | 'FAILED'
  entityType: string
  entityId?: string
  actorUserId?: string | null
  organizationId?: string | null
  requestId?: string
  causationId?: string
  ipAddress?: string
  userAgent?: string
  metadata?: Record<string, unknown>
}

export async function writeAuditEvent(input: WriteAuditEventInput) {
  const {
    action,
    outcome,
    entityType,
    entityId,
    actorUserId,
    organizationId,
    requestId,
    causationId,
    ipAddress,
    userAgent,
    metadata,
  } = input
  const prisma = await getPrisma()

  const orgId = organizationId ?? 'global'
  const createdAt = new Date()

  const canonicalPayload = stableJson({
    action,
    outcome,
    entityType,
    entityId: entityId ?? null,
    actorUserId: actorUserId ?? null,
    organizationId: orgId,
    requestId: requestId ?? null,
    causationId: causationId ?? null,
    ipAddress: ipAddress ?? null,
    userAgent: userAgent ?? null,
    metadata: metadata ?? {},
    createdAt: createdAt.toISOString(),
  })

  const previous = await (prisma as any).auditEvent.findFirst({
    where: {
      organizationId: orgId,
      eventHash: { not: null },
    },
    orderBy: { createdAt: 'desc' },
    select: { eventHash: true },
  })

  const previousHash = previous?.eventHash as string | undefined
  const eventHash = sha256(`${previousHash ?? ''}${canonicalPayload}`)

  return (prisma as any).auditEvent.create({
    data: {
      action,
      outcome,
      entityType,
      entityId: entityId ?? '',
      userId: actorUserId ?? null,
      organizationId: orgId,
      metadata: JSON.stringify(metadata ?? {}),
      ipAddress: ipAddress ?? null,
      causationId: causationId ?? null,
      previousHash: previousHash ?? null,
      eventHash,
      canonicalPayload,
      createdAt,
    },
  })
}

export async function safeWriteAuditEvent(input: WriteAuditEventInput) {
  try {
    return await writeAuditEvent(input)
  } catch (err) {
    console.warn('[audit] Failed to write audit event (safe mode):', err)
    return null
  }
}

function sha256(input: string): string {
  return createHash('sha256').update(input, 'utf-8').digest('hex')
}
