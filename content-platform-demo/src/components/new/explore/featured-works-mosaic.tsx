import type { ArticleSummary } from '@content-platform/shared'
import { WorkCard } from '@/components/new/work/work-card'

interface FeaturedWorksMosaicProps {
  featured: ArticleSummary[]
}

export function FeaturedWorksMosaic({ featured }: FeaturedWorksMosaicProps) {
  if (featured.length === 0) return null
  const [hero, ...rest] = featured

  return (
    <section className="mb-8">
      <h2 className="text-[13px] font-semibold text-text-primary mb-3 uppercase tracking-wider">Featured Works</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {hero && (
          <div className="md:col-span-2">
            <WorkCard
              title={hero.title}
              slug={hero.slug}
              excerpt={hero.excerpt}
              authorName={hero.authorName}
              categoryName={hero.categoryName}
              readingTime={hero.readingTime}
              commentCount={hero.commentCount}
              image={hero.image}
              format={hero.format}
              aiFreeDeclaration={hero.aiFreeDeclaration}
              provenanceStatus={hero.provenanceStatus}
              publishAt={hero.publishAt}
              variant="featured"
            />
          </div>
        )}
        <div className="space-y-4">
          {rest.slice(0, 2).map((a) => (
            <WorkCard
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
              variant="compact"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
