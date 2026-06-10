'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { articleSchema } from '@/lib/validations/article'

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export async function createArticle(_prevState: { error?: string } | null, formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return { error: 'You must be signed in to create articles' }

  const parsed = articleSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    excerpt: formData.get('excerpt'),
    categoryId: formData.get('categoryId'),
    tagIds: formData.getAll('tagIds'),
  })

  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { error: first?.message ?? 'Invalid form data' }
  }

  const { title, content, excerpt, categoryId, tagIds } = parsed.data

  const slug = slugify(title)
  const existing = await prisma.article.findUnique({ where: { slug } })
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug

  await prisma.article.create({
    data: {
      title,
      slug: finalSlug,
      excerpt: excerpt || null,
      content,
      status: 'DRAFT',
      authorId: (session.user as { id: string }).id,
      categoryId,
      tags: tagIds && tagIds.length > 0
        ? { create: tagIds.map((tagId: string) => ({ tagId })) }
        : undefined,
    },
  })

  revalidatePath('/')
  revalidatePath('/admin')
  redirect('/admin')
}

export async function updateArticle(id: string, _prevState: { error?: string } | null, formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return { error: 'You must be signed in' }

  const parsed = articleSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    excerpt: formData.get('excerpt'),
    categoryId: formData.get('categoryId'),
    tagIds: formData.getAll('tagIds'),
  })

  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { error: first?.message ?? 'Invalid form data' }
  }

  const { title, content, excerpt, categoryId, tagIds } = parsed.data

  const article = await prisma.article.findUnique({ where: { id } })
  if (!article) return { error: 'Article not found' }

  const user = session.user as { id: string; role: string }
  if (article.authorId !== user.id && user.role !== 'ADMIN') return { error: 'You do not have permission to edit this article' }
  if (article.status === 'PENDING_REVIEW' && user.role !== 'ADMIN') return { error: 'Article is under review and cannot be edited' }
  if (article.status === 'PUBLISHED' && user.role !== 'ADMIN') return { error: 'Published articles cannot be edited' }

  const slug = slugify(title)
  const existing = await prisma.article.findFirst({ where: { slug, id: { not: id } } })
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug

  await prisma.$transaction([
    prisma.articleVersion.create({
      data: { articleId: id, content: article.content },
    }),
    prisma.article.update({
      where: { id },
      data: {
        title,
        slug: finalSlug,
        excerpt: excerpt || null,
        content,
        categoryId,
        tags: {
          deleteMany: {},
          create: tagIds && tagIds.length > 0
            ? tagIds.map((tagId: string) => ({ tagId }))
            : [],
        },
      },
    }),
  ])

  revalidatePath('/')
  revalidatePath(`/articles/${finalSlug}`)
  revalidatePath(`/articles/${article.slug}`)
  revalidatePath('/admin')
  redirect('/admin')
}
