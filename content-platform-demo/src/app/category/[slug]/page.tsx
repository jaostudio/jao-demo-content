import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { ArticleCard } from '@/components/article-card'
import { IllustratedEmptyState } from '@/components/illustrated-empty-state'
import { Footer } from '@/components/footer'
import type { Metadata } from 'next'

export const revalidate = 60

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({ select: { slug: true } })
  return categories.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const category = await prisma.category.findUnique({ where: { slug } })
  if (!category) return {}
  return {
    title: category.name,
    description: `Browse articles in the ${category.name} category on Likha.`,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = await prisma.category.findUnique({ where: { slug } })
  if (!category) notFound()

  const articles = await prisma.article.findMany({
    where: { categoryId: category.id, status: 'PUBLISHED' },
    include: { author: true, category: true, tags: { include: { tag: true } } },
    orderBy: { publishAt: 'desc' },
  })

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="mb-2 font-display text-3xl font-bold">{category.name}</h1>
        <p className="mb-8 text-sm font-bold text-neutral-500">{articles.length} article{articles.length !== 1 ? 's' : ''}</p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              title={article.title}
              slug={article.slug}
              excerpt={article.excerpt}
              content={article.content}
              authorName={article.author.name}
              categorySlug={article.category.slug}
              categoryName={article.category.name}
              publishAt={article.publishAt?.toISOString() ?? null}
              tags={article.tags.map((t) => ({ name: t.tag.name, slug: t.tag.slug }))}
              image={article.image}
            />
          ))}
        </div>

        {articles.length === 0 && (
          <IllustratedEmptyState message="Wala pang artikulo sa kategoryang ito." submessage="Balikan mo kami sa susunod!" />
        )}
      </main>
      <Footer />
    </>
  )
}
