'use client'

import { LeftRail } from '../layout/left-rail'
import { Header } from '../layout/header'
import { ArticleCard } from '../article/article-card'

interface TrendingArticle {
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
  likes: number
}

interface TrendingPageProps {
  articles: TrendingArticle[]
}

export function TrendingPage({ articles }: TrendingPageProps) {
  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark">
      <LeftRail />
      <div className="lg:ml-[68px]">
        <Header />
        <main className="container-likha py-4">
          <div className="mb-4">
            <h1 className="text-[17px] font-semibold text-text-primary">Trending</h1>
            <p className="text-[12px] text-fog-gray mt-1">Most liked and discussed articles</p>
          </div>

          <div className="space-y-4">
            {articles.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-[14px] text-fog-gray">Wala pang trending articles.</p>
              </div>
            )}
            {articles.map((article) => (
              <ArticleCard key={article.slug} {...article} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
