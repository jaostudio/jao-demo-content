import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma'
import { transitionContent } from '@jaostudio/core/state-machines'

const actionToEvent: Record<string, string> = {
  submit: 'submit', approve: 'approve', reject: 'reject', archive: 'archive',
}

const dbStatusToMachine: Record<string, string> = {
  DRAFT: 'draft', PENDING_REVIEW: 'pending_review', PUBLISHED: 'published', ARCHIVED: 'archived',
}

const machineToDbStatus: Record<string, string> = {
  draft: 'DRAFT', pending_review: 'PENDING_REVIEW', published: 'PUBLISHED', archived: 'ARCHIVED',
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const user = session.user as any
  const { action } = await req.json()
  const event = actionToEvent[action]
  if (!event) return Response.json({ error: 'Invalid action' }, { status: 400 })

  const article = await (prisma as any).article.findUnique({ where: { id } })
  if (!article) return Response.json({ error: 'Not found' }, { status: 404 })

  const currentState = dbStatusToMachine[article.status] ?? 'draft'
  const isAdmin = user.role === 'ADMIN'
  const actor = isAdmin ? 'admin' : 'author'

  const result = transitionContent(
    currentState as any,
    event as any,
    { role: isAdmin ? 'admin' : 'user', actor, hasRequiredSections: true, isReviewed: action === 'approve' || action === 'reject' },
  )

  const newDbStatus = machineToDbStatus[result as string]
  if (!newDbStatus || newDbStatus === article.status) {
    return Response.json({ error: 'Transition not allowed' }, { status: 400 })
  }

  const updateData: any = { status: newDbStatus }
  if (action === 'approve') {
    updateData.moderatedAt = new Date()
    updateData.moderatedById = user.id
    updateData.publishAt = article.publishAt ?? new Date()
  }
  if (action === 'reject') {
    updateData.moderatedAt = new Date()
    updateData.moderatedById = user.id
  }

  await (prisma as any).article.update({
    where: { id },
    data: updateData,
  })

  return Response.json({ ok: true })
}
