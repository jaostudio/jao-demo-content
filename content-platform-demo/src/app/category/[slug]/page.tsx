import { fetchAPI } from '@/lib/api/server'
import type { ArticleSummary, CategoryResponse } from '@content-platform/shared'
import { notFound } from 'next/navigation'
import { NEW_LAYOUT_ENABLED } from '@/lib/new/flags'
import { Header } from '@/components/header'
import { ArticleCard } from '@/components/article-card'
import { IllustratedEmptyState } from '@/components/illustrated-empty-state'
import { Footer } from '@/components/footer'
import { CategoryPage as NewCategoryPage } from '@/components/new/pages/category-page'
import type { Metadata } from 'next'

export const revalidate = 60

export async function generateStaticParams() {
  try {
    const categories = await fetchAPI<CategoryResponse[]>('/api/categories')
    return categories.map((c) => ({ slug: c.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const categories = await fetchAPI<CategoryResponse[]>('/api/categories')
  const category = categories.find((c) => c.slug === slug)
  if (!category) return {}
  return {
    title: category.name,
    description: `Browse works in the ${category.name} category on Likha.`,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let categories: CategoryResponse[] = []
  try {
    categories = await fetchAPI<CategoryResponse[]>('/api/categories')
  } catch {
    // backend unavailable
  }
  const category = categories.find((c) => c.slug === slug)
  if (!category) notFound()

  let articles: ArticleSummary[] = []
  try {
    articles = await fetchAPI<ArticleSummary[]>('/api/articles')
  } catch {
    // backend unavailable
  }
  const filteredArticles = articles.filter((a) => a.categoryName === category.name)

  if (NEW_LAYOUT_ENABLED) {
    return (
      <NewCategoryPage
        categoryName={category.name}
        articles={filteredArticles.map((a) => ({
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
        }))}
      />
    )
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-4">
        <div className="mb-4 border-b border-border pb-4 dark:border-border-dark">
          <h1 className="text-xl font-semibold text-text-primary dark:text-slate-100">{category.name}</h1>
          <p className="text-xs text-text-muted">{filteredArticles.length} work{filteredArticles.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="space-y-3">
          {filteredArticles.map((article) => (
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
        </div>

        {filteredArticles.length === 0 && (
          <IllustratedEmptyState message="Wala pang work sa kategoryang ito." submessage="Balikan mo kami sa susunod!" />
        )}
      </main>
      <Footer />
    </>
  )
}
