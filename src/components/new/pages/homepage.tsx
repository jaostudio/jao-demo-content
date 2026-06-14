import { LeftRail } from '../layout/left-rail'
import { Header } from '../layout/header'
import { RightPanel } from '../layout/right-panel'
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
    <div className="min-h-screen bg-surface dark:bg-surface-dark">
      <LeftRail />
      <div className="lg:ml-[68px]">
        <Header />
        <main className="mx-auto max-w-[1080px] px-5 py-5">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* Center Feed */}
            <div className="space-y-4">
              {/* Sort Bar */}
              <div className="flex items-center gap-4 pb-3 text-[13px]">
                <span className="font-medium text-text-primary">Hot</span>
                <span className="text-ash">&middot;</span>
                <span className="cursor-pointer text-graphite hover:text-text-primary transition-colors">New</span>
                <span className="text-ash">&middot;</span>
                <span className="cursor-pointer text-graphite hover:text-text-primary transition-colors">Top</span>
              </div>

              {/* Article List */}
              {articles.length === 0 && (
                <div className="py-16 text-center">
                  <p className="text-[14px] text-fog-gray">Wala pang kwento dito.</p>
                  <p className="text-[12px] text-ash mt-1">Ikaw ba ang unang magsusulat?</p>
                </div>
              )}
              {articles.map((article) => (
                <ArticleCard key={article.slug} {...article} />
              ))}
            </div>

            {/* Right Panel */}
            <div className="hidden lg:block">
              <RightPanel
                categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
                trending={trending}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
