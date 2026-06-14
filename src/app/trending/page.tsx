import { prisma } from '@/lib/prisma'
import { NEW_LAYOUT_ENABLED } from '@/lib/new/flags'
import { Header } from '@/components/header'
import { ArticleCard } from '@/components/article-card'
import { Footer } from '@/components/footer'
import { TrendingPage as NewTrendingPage } from '@/components/new/pages/trending-page'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Trending',
  description: 'Trending articles on Likha.',
}

export default async function TrendingPage() {
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      author: true,
      category: true,
      tags: { include: { tag: true } },
      _count: { select: { comments: true } },
    },
    orderBy: [
      { likes: 'desc' },
      { publishAt: 'desc' },
    ],
  })

  if (NEW_LAYOUT_ENABLED) {
    return (
      <NewTrendingPage
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
          likes: a.likes,
        }))}
      />
    )
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-4">
        <div className="mb-4 border-b border-border pb-4 dark:border-border-dark">
          <h1 className="text-xl font-semibold text-text-primary dark:text-slate-100">Trending</h1>
          <p className="text-xs text-text-muted">Most liked and discussed articles</p>
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
          {articles.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-sm text-text-muted">Wala pang trending articles.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
