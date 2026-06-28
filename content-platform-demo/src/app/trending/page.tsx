import { fetchAPI } from '@/lib/api/server'
import type { ArticleSummary } from '@content-platform/shared'
import { NEW_LAYOUT_ENABLED } from '@/lib/new/flags'
import { Header } from '@/components/header'
import { ArticleCard } from '@/components/article-card'
import { Footer } from '@/components/footer'
import { TrendingPage as NewTrendingPage } from '@/components/new/pages/trending-page'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Trending',
  description: 'Trending works on Likha.',
}

export default async function TrendingPage() {
  let articles: ArticleSummary[] = []
  try {
    articles = await fetchAPI<ArticleSummary[]>('/api/trending')
  } catch {
    // backend unavailable during build
  }

  if (NEW_LAYOUT_ENABLED) {
    return (
      <NewTrendingPage
        articles={articles.map((a) => ({
          title: a.title,
          slug: a.slug,
          excerpt: a.excerpt,
          authorName: a.authorName,
          categoryName: a.categoryName,
          readingTime: a.readingTime,
          commentCount: a.commentCount,
          image: a.image,
          format: a.format,
          aiFreeDeclaration: a.aiFreeDeclaration,
          provenanceStatus: a.provenanceStatus,
          publishAt: a.publishAt,
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
          <p className="text-xs text-text-muted">Most liked and discussed works</p>
        </div>
        <div className="space-y-3">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              title={article.title}
              slug={article.slug}
              excerpt={article.excerpt}
              content={article.content}
              authorName={article.authorName}
              categorySlug=""
              categoryName={article.categoryName}
              publishAt={article.publishAt}
              tags={[]}
              image={article.image}
              commentCount={article.commentCount}
            />
          ))}
          {articles.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-sm text-text-muted">Wala pang trending works.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
