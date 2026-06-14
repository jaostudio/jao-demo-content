import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = session.user as { role: string }
  if (user.role !== 'ADMIN') {
    return Response.json({ error: 'Only admins can delete articles' }, { status: 403 })
  }

  const article = await prisma.article.findUnique({
    where: { id },
    select: { slug: true },
  })
  if (!article) {
    return Response.json({ error: 'Article not found' }, { status: 404 })
  }

  await prisma.article.delete({ where: { id } })

  revalidatePath('/')
  revalidatePath(`/articles/${article.slug}`)
  revalidatePath('/admin')

  return Response.json({ ok: true })
}
