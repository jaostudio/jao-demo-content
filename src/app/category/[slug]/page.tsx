import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { NEW_LAYOUT_ENABLED } from '@/lib/new/flags'
import { Header } from '@/components/header'
import { ArticleCard } from '@/components/article-card'
import { IllustratedEmptyState } from '@/components/illustrated-empty-state'
import { Footer } from '@/components/footer'
import { CategoryPage as NewCategoryPage } from '@/components/new/pages/category-page'
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
    include: { author: true, category: true, tags: { include: { tag: true } }, _count: { select: { comments: true } } },
    orderBy: { publishAt: 'desc' },
  })

  if (NEW_LAYOUT_ENABLED) {
    return (
      <NewCategoryPage
        categoryName={category.name}
        articles={articles.map((a) => ({
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
        }))}
      />
    )
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-4">
        <div className="mb-4 border-b border-border pb-4 dark:border-border-dark">
          <h1 className="text-xl font-semibold text-text-primary dark:text-slate-100">{category.name}</h1>
          <p className="text-xs text-text-muted">{articles.length} article{articles.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="space-y-3">
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
              image={article.imageUrl}
              commentCount={article._count.comments}
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
