import { fetchAPI } from '@/lib/api/server'
import type { ArticleSummary, CategoryResponse } from '@content-platform/shared'
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
  let articles: ArticleSummary[] = []
  let categories: CategoryResponse[] = []
  try {
    const results = await Promise.all([
      fetchAPI<ArticleSummary[]>('/api/articles'),
      fetchAPI<CategoryResponse[]>('/api/categories'),
    ])
    articles = results[0]
    categories = results[1]
  } catch {
    // backend unavailable during build
  }

  if (NEW_LAYOUT_ENABLED) {
    const featuredArticle = articles.length > 0 ? {
      title: articles[0].title,
      slug: articles[0].slug,
      excerpt: articles[0].excerpt,
      authorName: articles[0].authorName,
      categoryName: articles[0].categoryName,
      readingTime: articles[0].readingTime,
      commentCount: articles[0].commentCount,
      image: articles[0].image,
      format: articles[0].format,
      aiFreeDeclaration: articles[0].aiFreeDeclaration,
      publishAt: articles[0].publishAt,
    } : null

    const remainingArticles = articles.slice(1).map((a) => ({
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
      publishAt: a.publishAt,
    }))

    const totalArticles = articles.length
    const totalAuthors = new Set(articles.map((a) => a.authorId)).size
    const totalComments = articles.reduce((sum, a) => sum + a.commentCount, 0)

    let trendingArticles = articles
      .filter((a) => a.commentCount > 0)
      .sort((a, b) => b.likes - a.likes)
      .map((a) => ({ slug: a.slug, title: a.title, commentCount: a.commentCount }))
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
        categories={categories.map((c) => ({ slug: c.slug, name: c.name, _count: { articles: c._count?.articles ?? 0 } }))}
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
                authorName={articles[0].authorName}
                categorySlug={categories.find(c => c.name === articles[0].categoryName)?.slug ?? ''}
                categoryName={articles[0].categoryName}
                publishAt={articles[0].publishAt}
                tags={[]}
                image={articles[0].image}
                variant="featured"
                commentCount={articles[0].commentCount}
              />
            )}

            {articles.slice(1).map((article) => (
              <ArticleCard
                key={article.slug}
                title={article.title}
                slug={article.slug}
                excerpt={article.excerpt}
                content={article.content}
                authorName={article.authorName}
                categorySlug={categories.find(c => c.name === article.categoryName)?.slug ?? ''}
                categoryName={article.categoryName}
                publishAt={article.publishAt}
                tags={[]}
                image={article.image}
                commentCount={article.commentCount}
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
