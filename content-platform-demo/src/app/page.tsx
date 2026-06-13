import { prisma } from '@/lib/prisma'
import { NEW_LAYOUT_ENABLED } from '@/lib/new/flags'
import { Header } from '@/components/header'
import { ArticleCard } from '@/components/article-card'
import { WelcomeBanner } from '@/components/welcome-banner'
import { IllustratedEmptyState } from '@/components/illustrated-empty-state'
import { HomeSidebar } from '@/components/home-sidebar'
import { Footer } from '@/components/footer'
import { Homepage as NewHomepage } from '@/components/new/pages/homepage'

export const revalidate = 60

export default async function HomePage() {
  const [articles, categories] = await Promise.all([
    prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      include: { author: true, category: true, tags: { include: { tag: true } }, _count: { select: { comments: true } } },
      orderBy: { publishAt: 'desc' },
    }),
    prisma.category.findMany({
      include: { _count: { select: { articles: { where: { status: 'PUBLISHED' } } } } },
    }),
  ])

  if (NEW_LAYOUT_ENABLED) {
    const featuredArticle = articles.length > 0 ? {
      title: articles[0].title,
      slug: articles[0].slug,
      excerpt: articles[0].excerpt,
      authorName: articles[0].author.name,
      categoryName: articles[0].category.name,
      readingTime: Math.ceil(articles[0].content.split(/\s+/).length / 200),
      commentCount: articles[0]._count.comments,
      image: articles[0].imageUrl,
      format: articles[0].format,
      aiFreeDeclaration: articles[0].aiFreeDeclaration,
      publishAt: articles[0].publishAt?.toISOString() ?? null,
    } : null

    const remainingArticles = articles.slice(1).map((a) => ({
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
    }))

    const totalArticles = articles.length
    const totalAuthors = new Set(articles.map((a) => a.authorId)).size
    const totalComments = articles.reduce((sum, a) => sum + a._count.comments, 0)

    let trendingArticles = articles
      .filter((a) => a._count.comments > 0)
      .map((a) => ({ slug: a.slug, title: a.title, commentCount: a._count.comments }))
      .slice(0, 5)

    if (trendingArticles.length === 0) {
      trendingArticles = articles.slice(0, 5).map((a) => ({
        slug: a.slug, title: a.title, commentCount: 0,
      }))
    }

    return (
      <NewHomepage
        articles={remainingArticles}
        featuredArticle={featuredArticle}
        categories={categories}
        totalArticles={totalArticles}
        totalAuthors={totalAuthors}
        totalComments={totalComments}
        trending={trendingArticles}
      />
    )
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-4">
        <WelcomeBanner />

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-border pb-2 text-xs text-text-muted dark:border-border-dark">
              <span className="font-medium text-text-primary dark:text-slate-100">Hot</span>
              <span>·</span>
              <span className="cursor-pointer hover:text-primary">New</span>
              <span>·</span>
              <span className="cursor-pointer hover:text-primary">Top</span>
            </div>

            {articles.length > 0 && (
              <ArticleCard
                key={articles[0].slug}
                title={articles[0].title}
                slug={articles[0].slug}
                excerpt={articles[0].excerpt}
                content={articles[0].content}
                authorName={articles[0].author.name}
                categorySlug={articles[0].category.slug}
                categoryName={articles[0].category.name}
                publishAt={articles[0].publishAt?.toISOString() ?? null}
                tags={articles[0].tags.map((t) => ({ name: t.tag.name, slug: t.tag.slug }))}
                image={articles[0].imageUrl}
                variant="featured"
                commentCount={articles[0]._count.comments}
              />
            )}

            {articles.slice(1).map((article) => (
              <ArticleCard
                key={article.slug}
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
              <IllustratedEmptyState message="Wala pang nai-publish na artikulo." submessage="Ikaw ba ang unang magsusulat?" />
            )}
          </div>

          <div className="hidden lg:block">
            <HomeSidebar categories={categories} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
