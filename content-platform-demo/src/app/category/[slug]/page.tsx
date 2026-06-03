import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { ArticleCard } from '@/components/article-card'

export const revalidate = 60

export async function generateStaticParams() {
  const categories = await (prisma as any).category.findMany({ select: { slug: true } })
  return categories.map((c: any) => ({ slug: c.slug }))
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = await (prisma as any).category.findUnique({ where: { slug } })
  if (!category) notFound()

  const articles = await (prisma as any).article.findMany({
    where: { categoryId: category.id, status: 'PUBLISHED' },
    include: { author: true, category: true, tags: { include: { tag: true } } },
    orderBy: { publishAt: 'desc' },
  })

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold">{category.name}</h1>
        <p className="mb-8 text-sm text-gray-500">{articles.length} article{articles.length !== 1 ? 's' : ''}</p>

        <div className="grid gap-6 sm:grid-cols-2">
          {articles.map((article: any) => (
            <ArticleCard
              key={article.id}
              title={article.title}
              slug={article.slug}
              excerpt={article.excerpt}
              authorName={article.author.name}
              categorySlug={article.category.slug}
              categoryName={article.category.name}
              publishAt={article.publishAt?.toISOString() ?? null}
              tags={article.tags.map((t: any) => ({ name: t.tag.name, slug: t.tag.slug }))}
            />
          ))}
        </div>
      </main>
    </>
  )
}
