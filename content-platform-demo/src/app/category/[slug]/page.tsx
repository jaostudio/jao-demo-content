import { fetchAPI } from '@/lib/api/server'
import type { ArticleSummary, CategoryResponse } from '@content-platform/shared'
import { notFound } from 'next/navigation'
import { AppShell } from '@/components/new/layout/app-shell'
import { ArticleCard } from '@/components/new/article/article-card'
import { EmptyState } from '@/components/new/ui/empty-state'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

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
  let error = false
  try {
    articles = await fetchAPI<ArticleSummary[]>('/api/articles')
  } catch {
    error = true
  }
  const filteredArticles = articles.filter((a) => a.categoryName === category.name)

  if (error && filteredArticles.length === 0) {
    return (
      <AppShell>
        <EmptyState
          title="Could not load works"
          description="Something went wrong. Try again."
          action={<a href={`/category/${slug}`} className="btn btn-accent btn-sm">Retry</a>}
        />
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-[17px] font-semibold text-text-primary">{category.name}</h1>
        <p className="text-[12px] text-fog-gray mt-1">{filteredArticles.length} work{filteredArticles.length !== 1 ? 's' : ''}</p>
      </div>

      {filteredArticles.length === 0 ? (
        <EmptyState title="No works in this category yet" description="Check back later for new works." />
      ) : (
        <div className="space-y-4">
          {filteredArticles.map((article) => (
            <ArticleCard
              key={article.slug}
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
