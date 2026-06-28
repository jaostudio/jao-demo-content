import { AppShell } from '../layout/app-shell'
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
  provenanceStatus?: string
  publishAt: Date | string | null
}

interface HomepageProps {
  articles: ArticleSummary[]
  rightPanel?: React.ReactNode
}

export function Homepage({ articles, rightPanel }: HomepageProps) {
  if (articles.length === 0) return null

  return (
    <AppShell rightPanel={rightPanel}>
      <div className="space-y-4">
        {articles.map((article, i) => (
          <ArticleCard
            key={article.slug}
            {...article}
            isFeatured={i === 0}
          />
        ))}
      </div>
    </AppShell>
  )
}
