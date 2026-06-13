import { Header } from '../layout/header'
import { Footer } from '../layout/footer'
import { Sidebar } from '../layout/sidebar'
import { ArticleCard } from '../article/article-card'

interface ArticleSummary {
  title: string
  slug: string
  excerpt: string | null
  authorName: string
  categoryName: string
  readingTime: number
  commentCount: number
  image: string | null
  format: string
  aiFreeDeclaration: boolean
  publishAt: Date | string | null
}

interface HomepageProps {
  articles: ArticleSummary[]
  featuredArticle: ArticleSummary | null
  categories: { slug: string; name: string; _count: { articles: number } }[]
  totalArticles: number
  totalAuthors: number
  totalComments: number
  trending: { slug: string; title: string; commentCount: number }[]
}

export function Homepage({ articles, featuredArticle, categories, totalArticles, totalAuthors, totalComments, trending }: HomepageProps) {
  return (
    <>
      <Header />
      <main className="container-likha py-4">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Main Feed */}
          <div className="space-y-4">
            {/* Sort Bar */}
            <div className="flex items-center gap-3 border-b border-border pb-2 text-xs text-text-muted">
              <span className="font-medium text-text-primary">Hot</span>
              <span className="text-border">·</span>
              <span className="cursor-pointer hover:text-text-primary transition-colors">New</span>
              <span className="text-border">·</span>
              <span className="cursor-pointer hover:text-text-primary transition-colors">Top</span>
            </div>

            {/* Featured Article */}
            {featuredArticle && (
              <div className="animate-fade-in-up stagger-1">
                <ArticleCard {...featuredArticle} isFeatured />
              </div>
            )}

            {/* Article List */}
            <div className="space-y-3">
              {articles.length === 0 && (
                <div className="py-16 text-center">
                  <p className="text-sm text-text-muted">Wala pang kwento dito.</p>
                  <p className="text-xs text-text-muted mt-1">Ikaw ba ang unang magsusulat?</p>
                </div>
              )}
              {articles.map((article, i) => (
                <div key={article.slug} className={`animate-fade-in-up stagger-${(i % 6) + 1}`}>
                  <ArticleCard {...article} />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="animate-fade-in-up stagger-2">
              <Sidebar
                categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
                totalArticles={totalArticles}
                totalAuthors={totalAuthors}
                totalComments={totalComments}
                trending={trending}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
