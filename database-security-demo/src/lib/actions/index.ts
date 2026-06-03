'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'

async function getAuthUser() {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error('Unauthorized')
  const u = session.user as any
  return { id: u.id, role: u.role, orgId: u.orgId }
}

function logAudit(orgId: string, userId: string | null, action: string, entityType: string, entityId?: string, metadata?: Record<string, unknown>, causationId?: string) {
  return (prisma as any).auditEvent.create({
    data: { action, entityType, entityId: entityId ?? '', organizationId: orgId, userId, metadata: JSON.stringify(metadata ?? {}), causationId },
  })
}

function requireSystemAdmin(user: { role: string }) {
  if (user.role !== 'SYSTEM_ADMIN') throw new Error('Forbidden')
}

function requireOrgAccess(user: { role: string; orgId: string | null }, orgId: string) {
  if (user.role === 'SYSTEM_ADMIN') return
  if (user.orgId !== orgId) throw new Error('Forbidden')
  if (!user.orgId) throw new Error('No organization')
}

// ── Organization ──

export async function createOrganization(formData: FormData) {
  const user = await getAuthUser()
  requireSystemAdmin(user)

  const name = formData.get('name') as string
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const org = await (prisma as any).organization.create({ data: { name, slug } })
  await logAudit(org.id, user.id, 'organization.created', 'organization', org.id)
  revalidatePath('/admin/organizations')
}

export async function deleteOrganization(orgId: string) {
  const user = await getAuthUser()
  requireSystemAdmin(user)
  await logAudit(orgId, user.id, 'organization.deleted', 'organization', orgId)
  await (prisma as any).organization.delete({ where: { id: orgId } })
  revalidatePath('/admin/organizations')
}

// ── Document ──

export async function createDocument(formData: FormData) {
  const user = await getAuthUser()
  const title = formData.get('title') as string
  const body = formData.get('body') as string
  if (!title || !body) throw new Error('Missing fields')

  const doc = await (prisma as any).document.create({
    data: { title, body, organizationId: user.orgId, uploadedById: user.id },
  })
  await logAudit(user.orgId, user.id, 'document.created', 'document', doc.id, { title })
  revalidatePath('/documents')
}

export async function deleteDocument(docId: string) {
  const user = await getAuthUser()
  const doc = await (prisma as any).document.findUnique({ where: { id: docId } })
  if (!doc) throw new Error('Not found')
  requireOrgAccess(user, doc.organizationId)

  await (prisma as any).document.delete({ where: { id: docId } })
  await logAudit(user.orgId, user.id, 'document.deleted', 'document', docId, { title: doc.title })
  revalidatePath('/documents')
}

// ── Audit ──

export async function clearAuditLogs() {
  const user = await getAuthUser()
  requireSystemAdmin(user)
  await (prisma as any).auditEvent.deleteMany({ where: { organizationId: user.orgId ?? undefined } })
  revalidatePath('/audit')
}

// ── User management ──

export async function createOrgUser(formData: FormData) {
  const user = await getAuthUser()
  requireSystemAdmin(user)

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const role = formData.get('role') as string
  const orgId = formData.get('orgId') as string | null

  const existing = await (prisma as any).user.findUnique({ where: { email } })
  if (existing) throw new Error('Email exists')

  const password = await bcrypt.hash('password123', 10)

  const newUser = await (prisma as any).user.create({
    data: { name, email, password, role, organizationId: orgId || null },
  })
  await logAudit(orgId ?? '(none)', user.id, 'user.created', 'user', newUser.id, { email, role })
  revalidatePath('/admin/users')
}

export async function deleteUser(userId: string) {
  const user = await getAuthUser()
  requireSystemAdmin(user)
  await (prisma as any).user.delete({ where: { id: userId } })
  revalidatePath('/admin/users')
}
