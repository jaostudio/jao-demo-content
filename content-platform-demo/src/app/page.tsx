import { fetchAPI } from '@/lib/api/server'
import type { ArticleSummary, CategoryResponse } from '@content-platform/shared'
import { AppShell } from '@/components/new/layout/app-shell'
import { WorkCard } from '@/components/new/work/work-card'
import { RightPanel } from '@/components/new/layout/right-panel'
import { EmptyState } from '@/components/new/ui/empty-state'
import { FeedHero } from '@/components/new/home/feed-hero'
import { FeedContent } from '@/components/new/home/feed-content'
import { Reveal } from '@/components/new/motion/reveal'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let articles: ArticleSummary[] = []
  let categories: { slug: string; name: string }[] = []
  let feedError = false

  try {
    const [feedResult, categoriesResult] = await Promise.all([
      fetchAPI<ArticleSummary[]>('/api/feed'),
      fetchAPI<CategoryResponse[]>('/api/categories').catch(() => [] as CategoryResponse[]),
    ])
    articles = feedResult
    categories = categoriesResult.map((c: CategoryResponse) => ({ slug: c.slug, name: c.name }))
  } catch (e) {
    try {
      articles = await fetchAPI<ArticleSummary[]>('/api/articles')
    } catch {
      feedError = true
    }
  }

  if (feedError && articles.length === 0) {
    return (
      <AppShell rightPanel={<RightPanel categories={categories} />}>
        <EmptyState
          title="Could not load the feed"
          description="Something went wrong. Try again or explore artists."
          action={<Link href="/explore" className="btn btn-accent btn-sm">Explore</Link>}
        />
      </AppShell>
    )
  }

  if (articles.length === 0) {
    return (
      <AppShell rightPanel={<RightPanel categories={categories} />}>
        <EmptyState
          title="No live works yet"
          description="Follow artists or create your first work."
          action={
            <div className="flex gap-2">
              <Link href="/explore" className="btn btn-accent btn-sm">Explore Artists</Link>
              <Link href="/studio/new" className="btn btn-dark btn-sm">New Work</Link>
            </div>
          }
        />
      </AppShell>
    )
  }

  const uniqueAuthors = Array.from(
    new Map(articles.map((a) => [a.authorId, { id: a.authorId, name: a.authorName, role: 'Artist' }])).values(),
  )

  const trending = [...articles]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 5)
    .map((a) => ({ slug: a.slug, title: a.title, commentCount: a.commentCount }))

  return (
    <AppShell
      rightPanel={
        <RightPanel categories={categories} trending={trending} suggestedAuthors={uniqueAuthors} />
      }
    >
      <FeedHero />
      <FeedContent initial={articles}>
        {(filtered) => (
          <div className="space-y-4">
            {filtered.map((article, i) => (
              <Reveal key={article.slug}>
                <WorkCard
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
                  variant={i === 0 ? 'featured' : 'feed'}
                />
              </Reveal>
            ))}
          </div>
        )}
      </FeedContent>
    </AppShell>
  )
}
