import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q) {
    return NextResponse.json({ articles: [] })
  }

  const articles = await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      OR: [
        { title: { contains: q } },
        { excerpt: { contains: q } },
        { content: { contains: q } },
        { author: { name: { contains: q } } },
        { category: { name: { contains: q } } },
      ],
    },
    include: {
      author: true,
      category: true,
      _count: { select: { comments: true } },
    },
    orderBy: { publishAt: 'desc' },
    take: 20,
  })

  return NextResponse.json({
    articles: articles.map((a) => ({
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      authorName: a.author.name,
      categoryName: a.category.name,
      readingTime: Math.ceil(a.content.split(/\s+/).length / 200),
      commentCount: a._count.comments,
      image: a.imageUrl,
      format: a.format,
      aiFreeDeclaration: a.aiFreeDeclaration,
      publishAt: a.publishAt?.toISOString() ?? null,
    })),
  })
}
