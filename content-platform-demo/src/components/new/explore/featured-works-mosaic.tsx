import type { ArticleSummary } from '@content-platform/shared'
import { WorkCard } from '@/components/new/work/work-card'
import { Reveal } from '@/components/new/motion/reveal'

interface FeaturedWorksMosaicProps {
  featured: ArticleSummary[]
}

export function FeaturedWorksMosaic({ featured }: FeaturedWorksMosaicProps) {
  if (featured.length === 0) return null

  return (
    <section className="mb-8">
      <h2 className="text-[13px] font-semibold text-text-primary mb-3 uppercase tracking-wider">Featured Works</h2>
      <Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {/* 1 large feature card */}
          {featured[0] && (
            <div className="md:col-span-2 md:row-span-2">
              <WorkCard
                articleId={featured[0].id}
                title={featured[0].title}
                slug={featured[0].slug}
                excerpt={featured[0].excerpt}
                authorName={featured[0].authorName}
                categoryName={featured[0].categoryName}
                readingTime={featured[0].readingTime}
                commentCount={featured[0].commentCount}
                image={featured[0].image}
                format={featured[0].format}
                aiFreeDeclaration={featured[0].aiFreeDeclaration}
                provenanceStatus={featured[0].provenanceStatus}
                publishAt={featured[0].publishAt}
                variant="featured"
              />
            </div>
          )}

          {/* 2 medium vertical cards */}
          {featured[1] && (
            <div className="md:col-start-3 md:row-span-1">
              <WorkCard
                articleId={featured[1].id}
                title={featured[1].title}
                slug={featured[1].slug}
                excerpt={featured[1].excerpt}
                authorName={featured[1].authorName}
                categoryName={featured[1].categoryName}
                readingTime={featured[1].readingTime}
                commentCount={featured[1].commentCount}
                image={featured[1].image}
                format={featured[1].format}
                aiFreeDeclaration={featured[1].aiFreeDeclaration}
                provenanceStatus={featured[1].provenanceStatus}
                publishAt={featured[1].publishAt}
                variant="mosaic"
              />
            </div>
          )}

          {featured[2] && (
            <div className="md:col-start-3 md:row-span-1">
              <WorkCard
                articleId={featured[2].id}
                title={featured[2].title}
                slug={featured[2].slug}
                excerpt={featured[2].excerpt}
                authorName={featured[2].authorName}
                categoryName={featured[2].categoryName}
                readingTime={featured[2].readingTime}
                commentCount={featured[2].commentCount}
                image={featured[2].image}
                format={featured[2].format}
                aiFreeDeclaration={featured[2].aiFreeDeclaration}
                provenanceStatus={featured[2].provenanceStatus}
                publishAt={featured[2].publishAt}
                variant="mosaic"
              />
            </div>
          )}
        </div>
      </Reveal>

      {/* 3 compact cards */}
      {featured.length > 3 && (
        <Reveal>
          <div className="grid gap-4 mt-4 md:grid-cols-3">
            {featured.slice(3, 6).map((a) => (
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
                variant="compact"
              />
            ))}
          </div>
        </Reveal>
      )}
    </section>
  )
}
