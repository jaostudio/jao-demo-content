import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma'
import { AuditActions } from '@/lib/audit-actions'

async function getSessionUser() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null
  const u = session.user as any
  return { id: u.id, role: u.role, orgId: u.orgId }
}

function step(label: string, passed: boolean, detail: string) {
  return { label, passed, detail }
}

async function logAndReturn(type: string, userId: string | null, orgId: string | null, metadata: Record<string, unknown>, steps: any[], responseCode: number) {
  await (prisma as any).auditEvent.create({
    data: {
      action: type,
      entityType: 'security_lab',
      organizationId: orgId ?? '(unknown)',
      userId,
      metadata: JSON.stringify(metadata),
    },
  })

  return NextResponse.json({
    steps: [...steps, step('Audit event written', true, `Action "${type}" logged to audit trail`)],
    simulationExecuted: true,
    simulatedResponseCode: responseCode,
    result: responseCode >= 400 ? 'BLOCKED' : 'ALLOWED',
    auditEvent: type,
    auditRecorded: true,
  })
}

const simulationHandlers: Record<string, (user: { id: string; role: string; orgId: string | null }) => Promise<NextResponse>> = {
  'cross-tenant': async (user) => {
    const steps: any[] = [
      step('Request received', true, `GET /api/documents/doc_talapay_001`),
      step('Session resolved', true, `User: ${user.id}, Role: ${user.role}`),
    ]

    if (user.role === 'SYSTEM_ADMIN') {
      steps.push(step('Tenant scope applied', true, 'SYSTEM_ADMIN bypass — cross-tenant allowed'))
      return logAndReturn(AuditActions.SECURITY_LAB_CROSS_TENANT_DOCUMENT_ACCESS, user.id, user.orgId, { simulation: 'cross-tenant', note: 'SYSTEM_ADMIN has global access' }, steps, 200)
    }

    const sessionOrgId = user.orgId
    const targetOrg = await (prisma as any).organization.findFirst({ where: { slug: 'talapay-cooperative' } })
    const targetOrgId = targetOrg?.id

    steps.push(step('Tenant scope applied', true, `Session orgId: ${sessionOrgId}`))
    steps.push(step('Target org resolved', true, `Target: ${targetOrgId}`))

    if (!sessionOrgId || sessionOrgId !== targetOrgId) {
      steps.push(step('Cross-tenant check', false, `Session org (${sessionOrgId}) ≠ Target org (${targetOrgId})`))
      steps.push(step('Response', false, '404 Not Found — resource not visible in current scope'))

      return logAndReturn(AuditActions.DOCUMENT_CROSS_TENANT_DENIED, user.id, sessionOrgId, {
        simulation: 'cross-tenant',
        sessionOrg: sessionOrgId,
        targetOrg: targetOrgId,
      }, steps, 404)
    }

    return logAndReturn(AuditActions.SECURITY_LAB_CROSS_TENANT_DOCUMENT_ACCESS, user.id, sessionOrgId, { simulation: 'cross-tenant' }, steps, 200)
  },

  'admin-action': async (user) => {
    const steps: any[] = [
      step('Request received', true, `POST /api/organizations { name: "Rogue Org" }`),
      step('Session resolved', true, `User: ${user.id}, Role: ${user.role}`),
      step('RBAC guard invoked', false, `requireSystemAdmin() — current role: ${user.role}`),
    ]

    if (user.role !== 'SYSTEM_ADMIN') {
      steps.push(step('Action denied', false, `Role ${user.role} cannot create organizations`))
      return logAndReturn(AuditActions.ADMIN_ACTION_DENIED, user.id, user.orgId, { simulation: 'admin-action', requiredRole: 'SYSTEM_ADMIN' }, steps, 403)
    }

    steps.push(step('Action allowed', true, 'SYSTEM_ADMIN permission granted'))
    return logAndReturn(AuditActions.SECURITY_LAB_ADMIN_ONLY_ACTION, user.id, user.orgId, { simulation: 'admin-action' }, steps, 200)
  },

  'org-id-injection': async (user) => {
    const steps: any[] = [
      step('Request received', true, `POST /api/documents { title: "...", organizationId: "org_talapay" }`),
      step('Session resolved', true, `User: ${user.id}, Role: ${user.role}`),
      step('Client body parsed', true, `Found organizationId: org_talapay in request body`),
      step('Server enforcement', true, `Client orgId IGNORED — using session orgId: ${user.orgId ?? 'none'}`),
    ]

    if (user.role === 'SYSTEM_ADMIN') {
      steps.push(step('Effective query', true, 'SYSTEM_ADMIN — no tenant scope restriction'))
      return logAndReturn(AuditActions.SECURITY_LAB_FAKE_ORG_ID_INJECTION, user.id, null, { simulation: 'org-id-injection', note: 'SYSTEM_ADMIN has global scope' }, steps, 200)
    }

    if (user.orgId) {
      steps.push(step('Effective query', true, `WHERE organizationId = ${user.orgId} (from session, not client)`))
    }

    return logAndReturn(AuditActions.SECURITY_CLIENT_ORG_INJECTION_BLOCKED, user.id, user.orgId, {
      simulation: 'org-id-injection',
      clientOrgId: 'org_talapay',
      effectiveOrgId: user.orgId,
    }, steps, 200)
  },

  'audit-tamper': async (user) => {
    const steps: any[] = [
      step('Request received', true, `PATCH /api/audit-events/evt_001 { action: "modified" }`),
      step('Session resolved', true, `User: ${user.id}, Role: ${user.role}`),
      step('Route handler check', true, 'AuditEvent table is append-only'),
      step('Write permission', false, 'No direct update/delete API exists for audit events'),
    ]

    return logAndReturn(AuditActions.SECURITY_AUDIT_TAMPER_DENIED, user.id, user.orgId, { simulation: 'audit-tamper' }, steps, 405)
  },

  'escalated-edit': async (user) => {
    const steps: any[] = [
      step('Request received', true, `PATCH /api/documents/doc_001 { title: "Modified" }`),
      step('Session resolved', true, `User: ${user.id}, Role: ${user.role}`),
      step('Permission check', true, `Edit requires ORG_ADMIN or SYSTEM_ADMIN`),
    ]

    if (user.role === 'ORG_USER') {
      steps.push(step('RBAC evaluation', false, `Role ORG_USER cannot edit documents`))
      return logAndReturn(AuditActions.ADMIN_ACTION_DENIED, user.id, user.orgId, {
        simulation: 'escalated-edit',
        requiredRole: 'ORG_ADMIN+',
      }, steps, 403)
    }

    steps.push(step('Action allowed', true, `${user.role} has edit permission`))
    return logAndReturn(AuditActions.SECURITY_LAB_ESCALATED_DOCUMENT_EDIT, user.id, user.orgId, { simulation: 'escalated-edit' }, steps, 200)
  },
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const type = body.type as string

  const handler = simulationHandlers[type]
  if (!handler) {
    return NextResponse.json({ error: `Unknown simulation type: ${type}` }, { status: 400 })
  }

  return handler(user)
}
