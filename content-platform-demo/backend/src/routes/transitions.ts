import { Hono } from 'hono'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authMiddleware } from '../middleware/auth'

const transitions = new Hono()

type ContentState = 'draft' | 'pending_review' | 'published' | 'archived'
type ContentEvent = 'submit' | 'approve' | 'publish' | 'reject' | 'archive' | 'schedule' | 'unpublish'

interface ContentContext {
  actor: 'author' | 'admin' | 'system'
  role: 'admin' | 'user'
  hasRequiredSections: boolean
  isReviewed: boolean
}

const contentMachineConfig = {
  initial: 'draft' as ContentState,
  states: {
    draft: { on: { submit: 'pending_review' as ContentState } },
    pending_review: {
      on: { approve: 'published' as ContentState, publish: 'published' as ContentState, reject: 'draft' as ContentState },
    },
    published: { on: { archive: 'archived' as ContentState, unpublish: 'draft' as ContentState } },
    archived: { on: { schedule: 'pending_review' as ContentState } },
  },
}

function transitionContent(state: ContentState, event: ContentEvent, context: ContentContext): ContentState {
  if (event === 'submit' && context.actor !== 'author') return state
  if (event === 'approve' && !(context.actor === 'admin' || context.actor === 'system')) return state
  if (event === 'reject' && !(context.actor === 'admin' || context.actor === 'system')) return state
  if (event === 'publish' && !(context.actor === 'admin' || context.actor === 'system')) return state
  if (event === 'publish' && !context.isReviewed) return 'pending_review'
  if (event === 'approve' && !context.isReviewed) return state
  if (event === 'archive' && !(context.actor === 'admin' || context.actor === 'system')) return state
  if (event === 'schedule' && !(context.actor === 'admin' || context.actor === 'system')) return state
  if (event === 'unpublish' && !(context.actor === 'admin' || context.actor === 'system')) return state
  const next = (contentMachineConfig.states[state]?.on as Record<string, ContentState | undefined>)[event] ?? null
  return next ?? state
}

const dbStatusToMachine: Record<string, ContentState> = {
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

const transitionSchema = z.object({
  action: z.enum(['submit', 'approve', 'reject', 'archive', 'restore']),
})

// POST /api/articles/:id/transition
transitions.post('/:id/transition', authMiddleware, async (c) => {
  const id = c.req.param('id')
  const userId = c.var.userId
  const userRole = c.var.userRole
  const body = await c.req.json()

  const parsed = transitionSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: 'VALIDATION', message: 'Invalid action' }, 400)
  }

  const { action } = parsed.data
  const isAdmin = userRole === 'ADMIN'

  const article = await prisma.article.findUnique({
    where: { id },
    include: { category: true },
  })
  if (!article) {
    return c.json({ error: 'NOT_FOUND', message: 'Article not found' }, 404)
  }

  if (!isAdmin && article.authorId !== userId) {
    return c.json({ error: 'FORBIDDEN', message: 'You do not own this article' }, 403)
  }

  const currentState = dbStatusToMachine[article.status] ?? 'draft'
  const actor = isAdmin ? 'admin' : 'author'

  if (action === 'restore') {
    if (article.status !== 'ARCHIVED') {
      return c.json({ error: 'BAD_REQUEST', message: 'Only archived articles can be restored' }, 400)
    }
    await prisma.article.update({
      where: { id },
      data: { status: 'DRAFT' },
    })
    return c.json({ ok: true })
  }

  const result = transitionContent(currentState, action as ContentEvent, {
    role: isAdmin ? 'admin' : 'user',
    actor,
    hasRequiredSections: true,
    isReviewed: action === 'approve' || action === 'reject',
  })

  const newDbStatus = machineToDbStatus[result]
  if (!newDbStatus || newDbStatus === article.status) {
    return c.json({ error: 'BAD_REQUEST', message: 'Transition not allowed' }, 400)
  }

  const updateData: Record<string, unknown> = { status: newDbStatus }
  if (action === 'approve') {
    updateData.moderatedAt = new Date()
    updateData.moderatedById = userId
    updateData.publishAt = article.publishAt ?? new Date()
  }
  if (action === 'reject') {
    updateData.moderatedAt = new Date()
    updateData.moderatedById = userId
  }

  await prisma.article.update({
    where: { id },
    data: updateData as never,
  })

  return c.json({ ok: true })
})

export default transitions
