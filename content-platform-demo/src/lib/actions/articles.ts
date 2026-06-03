'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export async function createArticle(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error('Unauthorized')
  const user = session.user as any

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const excerpt = formData.get('excerpt') as string | null
  const categoryId = formData.get('categoryId') as string
  const tagIds = formData.getAll('tagIds') as string[]

  const slug = slugify(title)
  const existing = await (prisma as any).article.findUnique({ where: { slug } })
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug

  await (prisma as any).article.create({
    data: {
      title,
      slug: finalSlug,
      excerpt,
      content,
      status: 'DRAFT',
      authorId: user.id,
      categoryId,
      tags: { create: tagIds.map((tagId: string) => ({ tagId })) },
    },
  })

  revalidatePath('/')
  revalidatePath('/admin')
  redirect('/admin')
}

export async function updateArticle(id: string, formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error('Unauthorized')
  const user = session.user as any

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const excerpt = formData.get('excerpt') as string | null
  const categoryId = formData.get('categoryId') as string
  const tagIds = formData.getAll('tagIds') as string[]

  const article = await (prisma as any).article.findUnique({ where: { id } })
  if (!article) throw new Error('Not found')
  if (article.authorId !== user.id && user.role !== 'ADMIN') throw new Error('Forbidden')

  const slug = slugify(title)
  const existing = await (prisma as any).article.findFirst({ where: { slug, id: { not: id } } })
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug

  await (prisma as any).article.update({
    where: { id },
    data: {
      title,
      slug: finalSlug,
      excerpt,
      content,
      categoryId,
      tags: {
        deleteMany: {},
        create: tagIds.map((tagId: string) => ({ tagId })),
      },
    },
  })

  revalidatePath('/')
  revalidatePath(`/articles/${finalSlug}`)
  revalidatePath('/admin')
  redirect('/admin')
}
