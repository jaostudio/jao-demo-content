import { fetchAPI } from '@/lib/api/server'
import type { ArticleSummary } from '@content-platform/shared'
import { LeftRail } from '@/components/new/layout/left-rail'
import { Header } from '@/components/new/layout/header'
import { ArticleCard } from '@/components/new/article/article-card'
import { Avatar } from '@/components/new/ui/avatar'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Explore',
  description: 'Discover artists, process notes, and live works on Likha.',
}

export default async function ExplorePage() {
  let articles: ArticleSummary[] = []
  let categories: { slug: string; name: string }[] = []
  try {
    const [arts, cats] = await Promise.all([
      fetchAPI<ArticleSummary[]>('/api/articles'),
      fetchAPI<{ slug: string; name: string }[]>('/api/categories').catch(() => []),
    ])
    articles = arts
    categories = cats
  } catch {
    // backend unavailable
  }

  const humanMade = articles.filter((a) => a.aiFreeDeclaration)
  const processDoc = articles.filter((a) => a.provenanceStatus === 'PROCESS_DOCUMENTED')
  const featured = articles.slice(0, 3)
  const rest = articles.slice(3)
  const uniqueArtists = Array.from(
    new Map(articles.map((a) => [a.authorId, { id: a.authorId, name: a.authorName }])).values(),
  ).slice(0, 6)

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark">
      <LeftRail />
      <div className="lg:ml-[68px]">
        <Header />
        <main className="mx-auto max-w-[1080px] px-5 py-5">
          <div className="mb-6">
            <h1 className="text-[17px] font-semibold text-text-primary">Explore</h1>
            <p className="text-[12px] text-fog-gray mt-1">Discover artists, process notes, and live works.</p>
          </div>

          {/* Featured Works */}
          {featured.length > 0 && (
            <section className="mb-8">
              <h2 className="text-[13px] font-semibold text-text-primary mb-3">Featured Works</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {featured.map((a) => (
                  <ArticleCard
                    key={a.slug}
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
                    isFeatured={true}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Featured Artists */}
          {uniqueArtists.length > 0 && (
            <section className="mb-8">
              <h2 className="text-[13px] font-semibold text-text-primary mb-3">Featured Artists</h2>
              <div className="flex flex-wrap gap-3">
                {uniqueArtists.map((artist) => (
                  <Link
                    key={artist.id}
                    href={`/artist/${artist.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex items-center gap-2 rounded-lg border border-hairline bg-card px-3 py-2 hover:bg-surface-alt transition-colors"
                  >
                    <Avatar name={artist.name} size="sm" />
                    <span className="text-[13px] font-medium text-text-primary">{artist.name}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Declared Human-Made */}
          {humanMade.length > 2 && (
            <section className="mb-8">
              <h2 className="text-[13px] font-semibold text-text-primary mb-3">Declared Human-Made</h2>
              <div className="space-y-3">
                {humanMade.slice(0, 3).map((a) => (
                  <ArticleCard
                    key={a.slug}
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
          )}

          {/* Process Documented */}
          {processDoc.length > 0 && (
            <section className="mb-8">
              <h2 className="text-[13px] font-semibold text-text-primary mb-3">Process Documented</h2>
              <div className="space-y-3">
                {processDoc.slice(0, 3).map((a) => (
                  <ArticleCard
                    key={a.slug}
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
          )}

          {/* Recent */}
          {rest.length > 0 && (
            <section className="mb-8">
              <h2 className="text-[13px] font-semibold text-text-primary mb-3">Recent</h2>
              <div className="space-y-3">
                {rest.map((a) => (
                  <ArticleCard
                    key={a.slug}
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
          )}

          {articles.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-[14px] text-fog-gray">No works to explore yet.</p>
              <p className="text-[12px] text-ash mt-1">Be the first to publish.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
