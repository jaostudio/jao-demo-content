import { fetchAPI } from '@/lib/api/server'
import type { ArticleSummary } from '@content-platform/shared'
import { AppShell } from '@/components/new/layout/app-shell'
import { RightPanel } from '@/components/new/layout/right-panel'
import { WorkCard } from '@/components/new/work/work-card'
import { EmptyState } from '@/components/new/ui/empty-state'
import { ExploreHero } from '@/components/new/explore/explore-hero'
import { FeaturedWorksMosaic } from '@/components/new/explore/featured-works-mosaic'
import { FeaturedArtistsRail } from '@/components/new/explore/featured-artists-rail'
import { Reveal } from '@/components/new/motion/reveal'
import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Explore',
  description: 'Discover artists, process notes, and live works on Likha.',
}

export default async function ExplorePage() {
  let articles: ArticleSummary[] = []
  let categories: { slug: string; name: string }[] = []
  let error = false
  try {
    const [arts, cats] = await Promise.all([
      fetchAPI<ArticleSummary[]>('/api/articles'),
      fetchAPI<{ slug: string; name: string }[]>('/api/categories').catch(() => []),
    ])
    articles = arts
    categories = cats
  } catch {
    error = true
  }

  if (error && articles.length === 0) {
    return (
      <AppShell rightPanel={<RightPanel categories={categories} />}>
        <EmptyState
          title="Could not load works"
          description="Something went wrong. Try again."
          action={<Link href="/" className="btn btn-accent btn-sm">Home</Link>}
        />
      </AppShell>
    )
  }

  const humanMade = articles.filter((a) => a.aiFreeDeclaration)
  const processDoc = articles.filter((a) => a.provenanceStatus === 'PROCESS_DOCUMENTED')
  const featured = articles.slice(0, 3)
  const rest = articles.slice(3)
  const uniqueArtists = Array.from(
    new Map(articles.map((a) => [a.authorId, { id: a.authorId, name: a.authorName }])).values(),
  ).slice(0, 6)

  return (
    <AppShell rightPanel={<RightPanel categories={categories} />}>
      <ExploreHero />

      {articles.length === 0 ? (
        <EmptyState
          title="No works to explore yet"
          description="Be the first to publish."
          action={<Link href="/admin/articles/new" className="btn btn-accent btn-sm">New Work</Link>}
        />
      ) : (
        <>
          <Reveal>
            <FeaturedWorksMosaic featured={featured} />
          </Reveal>

          <Reveal>
            <FeaturedArtistsRail artists={uniqueArtists} />
          </Reveal>

          {humanMade.length > 2 && (
            <Reveal>
              <section className="mb-8">
                <h2 className="text-[13px] font-semibold text-text-primary mb-3 uppercase tracking-wider">Declared Human-Made</h2>
                <div className="space-y-3">
                  {humanMade.slice(0, 3).map((a) => (
            <WorkCard
              key={a.slug}
              articleId={a.id}
              title={a.title}
              slug={a.slug}
              excerpt={a.excerpt}
              authorName={a.authorName}
              categoryName={a.categoryName}
              readingTime={a.readingTime}
              commentCount={a.commentCount}
              image={a.image}
              format={a.format}
              aiFreeDeclaration={a.aiFreeDeclaration}
              provenanceStatus={a.provenanceStatus}
              publishAt={a.publishAt}
            />
                  ))}
                </div>
              </section>
            </Reveal>
          )}

          {processDoc.length > 0 && (
            <Reveal>
              <section className="mb-8">
                <h2 className="text-[13px] font-semibold text-text-primary mb-3 uppercase tracking-wider">Process Documented</h2>
                <div className="space-y-3">
                  {processDoc.slice(0, 3).map((a) => (
            <WorkCard
              key={a.slug}
              articleId={a.id}
              title={a.title}
              slug={a.slug}
              excerpt={a.excerpt}
              authorName={a.authorName}
              categoryName={a.categoryName}
              readingTime={a.readingTime}
              commentCount={a.commentCount}
              image={a.image}
              format={a.format}
              aiFreeDeclaration={a.aiFreeDeclaration}
              provenanceStatus={a.provenanceStatus}
              publishAt={a.publishAt}
            />
                  ))}
                </div>
              </section>
            </Reveal>
          )}

          {rest.length > 0 && (
            <Reveal>
              <section className="mb-8">
                <h2 className="text-[13px] font-semibold text-text-primary mb-3 uppercase tracking-wider">Recent</h2>
                <div className="space-y-3">
                  {rest.map((a) => (
            <WorkCard
              key={a.slug}
              articleId={a.id}
              title={a.title}
              slug={a.slug}
              excerpt={a.excerpt}
              authorName={a.authorName}
              categoryName={a.categoryName}
              readingTime={a.readingTime}
              commentCount={a.commentCount}
              image={a.image}
              format={a.format}
              aiFreeDeclaration={a.aiFreeDeclaration}
              provenanceStatus={a.provenanceStatus}
              publishAt={a.publishAt}
            />
                  ))}
                </div>
              </section>
            </Reveal>
          )}
        </>
      )}
    </AppShell>
  )
}
