import { Header } from '../layout/header'
import { Footer } from '../layout/footer'
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

interface CategoryPageProps {
  categoryName: string
  articles: ArticleSummary[]
}

export function CategoryPage({ categoryName, articles }: CategoryPageProps) {
  return (
    <>
      <Header />
      <main className="container-likha py-4">
        <div className="mb-6">
          <h1 className="text-xl font-display font-bold text-text-primary">{categoryName}</h1>
          <p className="text-xs text-text-muted mt-1">{articles.length} articles</p>
        </div>

        <div className="space-y-3">
          {articles.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-sm text-text-muted">Wala pang kwento sa kategoryang ito.</p>
            </div>
          )}
          {articles.map((article, i) => (
            <div key={article.slug} className={`animate-fade-in-up stagger-${(i % 6) + 1}`}>
              <ArticleCard {...article} />
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
