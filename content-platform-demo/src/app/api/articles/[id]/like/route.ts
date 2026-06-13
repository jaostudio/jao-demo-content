import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { action } = await req.json() as { action?: 'like' | 'unlike' }

  const article = await prisma.article.findUnique({
    where: { id },
    select: { slug: true, likes: true },
  })
  if (!article) {
    return Response.json({ error: 'Article not found' }, { status: 404 })
  }

  const delta = action === 'unlike' ? -1 : 1
  const likes = Math.max(0, article.likes + delta)

  await prisma.article.update({
    where: { id },
    data: { likes },
  })

  revalidatePath('/')
  revalidatePath(`/articles/${article.slug}`)

  return Response.json({ likes })
}
