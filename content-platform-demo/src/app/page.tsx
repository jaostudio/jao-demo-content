import { prisma } from '@/lib/prisma'
import { Header } from '@/components/header'
import { ArticleCard } from '@/components/article-card'
import { HeroSection } from '@/components/hero-section'
import { WelcomeBanner } from '@/components/welcome-banner'
import { IllustratedEmptyState } from '@/components/illustrated-empty-state'
import { HomeSidebar } from '@/components/home-sidebar'
import { Footer } from '@/components/footer'

export const revalidate = 60

export default async function HomePage() {
  const [articles, categories, articleCount, authorCount, categoryCount] = await Promise.all([
    prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      include: { author: true, category: true, tags: { include: { tag: true } } },
      orderBy: { publishAt: 'desc' },
    }),
    prisma.category.findMany({
      include: { _count: { select: { articles: { where: { status: 'PUBLISHED' } } } } },
    }),
    prisma.article.count({ where: { status: 'PUBLISHED' } }),
    prisma.author.count(),
    prisma.category.count(),
  ])

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <HeroSection stats={{ articles: articleCount, authors: authorCount, categories: categoryCount }} />

        <div className="mt-8">
          <WelcomeBanner />
        </div>

        <aside className="mb-8 mt-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <a key={cat.slug} href={`/category/${cat.slug}`}
              className="stamp border-2 border-black bg-cream px-3 py-1 text-sm font-bold text-black transition-all hover:bg-saffron-100 dark:border-white dark:bg-[#1A1A1A] dark:text-white dark:hover:bg-saffron-900/30"
            >
              {cat.name} ({cat._count.articles})
            </a>
          ))}
        </aside>

        {categories.length === 0 && (
          <IllustratedEmptyState message="No categories yet." submessage="" />
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
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
                image={articles[0].image}
                variant="featured"
              />
            )}
            <div className="grid gap-6 sm:grid-cols-2">
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
                  image={article.image}
                />
              ))}
            </div>
            {articles.length === 0 && (
              <IllustratedEmptyState message="Wala pang nai-publish na artikulo." submessage="Ikaw ba ang unang magsusulat?" />
            )}
          </div>
          <div className="hidden lg:block">
            <HomeSidebar />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
