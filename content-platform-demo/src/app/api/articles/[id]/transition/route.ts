import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma'
import { transitionContent } from '@jaostudio/core/state-machines'
import { transitionSchema } from '@/lib/validations/article'
import { revalidateArticlePaths } from '@/lib/revalidation'

const dbStatusToMachine: Record<string, string> = {
  DRAFT: 'draft',
  PENDING_REVIEW: 'pending_review',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
}

const machineToDbStatus: Record<string, string> = {
  draft: 'DRAFT',
  pending_review: 'PENDING_REVIEW',
  published: 'PUBLISHED',
  archived: 'ARCHIVED',
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = transitionSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Invalid action' }, { status: 400 })
  }

  const { action } = parsed.data
  const user = session.user as { id: string; role: string }
  const isAdmin = user.role === 'ADMIN'

  const article = await prisma.article.findUnique({
    where: { id },
    include: { category: true },
  })
  if (!article) {
    return Response.json({ error: 'Article not found' }, { status: 404 })
  }

  if (!isAdmin && article.authorId !== user.id) {
    return Response.json({ error: 'You do not own this article' }, { status: 403 })
  }

  const currentState = dbStatusToMachine[article.status] ?? 'draft'
  const actor = isAdmin ? 'admin' : 'author'

  if (action === 'restore') {
    if (article.status !== 'ARCHIVED') {
      return Response.json({ error: 'Only archived articles can be restored' }, { status: 400 })
    }
    await prisma.article.update({
      where: { id },
      data: { status: 'DRAFT' },
    })
    revalidateArticlePaths(article)
    return Response.json({ ok: true })
  }

  const result = transitionContent(
    currentState as 'draft' | 'pending_review' | 'published' | 'archived',
    action as 'submit' | 'approve' | 'reject' | 'archive',
    {
      role: isAdmin ? 'admin' : 'user',
      actor,
      hasRequiredSections: true,
      isReviewed: action === 'approve' || action === 'reject',
    },
  )

  const newDbStatus = machineToDbStatus[result as string]
  if (!newDbStatus || newDbStatus === article.status) {
    return Response.json({ error: 'Transition not allowed' }, { status: 400 })
  }

  const updateData: Record<string, unknown> = { status: newDbStatus }
  if (action === 'approve') {
    updateData.moderatedAt = new Date()
    updateData.moderatedById = user.id
    updateData.publishAt = article.publishAt ?? new Date()
  }
  if (action === 'reject') {
    updateData.moderatedAt = new Date()
    updateData.moderatedById = user.id
  }

  await prisma.article.update({
    where: { id },
    data: updateData as never,
  })

  revalidateArticlePaths(article)

  return Response.json({ ok: true })
}
