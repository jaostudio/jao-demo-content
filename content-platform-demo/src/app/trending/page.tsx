import { fetchAPI } from '@/lib/api/server'
import type { ArticleSummary } from '@content-platform/shared'
import { AppShell } from '@/components/new/layout/app-shell'
import { WorkCard } from '@/components/new/work/work-card'
import { EmptyState } from '@/components/new/ui/empty-state'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Trending',
  description: 'Trending works on Likha.',
}

export default async function TrendingPage() {
  let articles: ArticleSummary[] = []
  let error = false
  try {
    articles = await fetchAPI<ArticleSummary[]>('/api/trending')
  } catch {
    error = true
  }

  if (error && articles.length === 0) {
    return (
      <AppShell>
        <EmptyState
          title="Couldn't load trending"
          description="The connection may have dropped. Try again."
          action={<a href="/trending" className="btn btn-accent btn-sm">Retry</a>}
        />
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-[17px] font-semibold text-text-primary">Trending</h1>
        <p className="text-[12px] text-fog-gray mt-1">Most liked and discussed works</p>
      </div>

      {articles.length === 0 ? (
        <EmptyState
          title="Nothing trending yet"
          description="Engagement shapes what rises."
        />
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <WorkCard
              key={article.slug}
              articleId={article.id}
              title={article.title}
              slug={article.slug}
              excerpt={article.excerpt}
              authorName={article.authorName}
              categoryName={article.categoryName}
              readingTime={article.readingTime}
              commentCount={article.commentCount}
              image={article.image}
              format={article.format}
              aiFreeDeclaration={article.aiFreeDeclaration}
              provenanceStatus={article.provenanceStatus}
              publishAt={article.publishAt}
            />
          ))}
        </div>
      )}
    </AppShell>
  )
}
