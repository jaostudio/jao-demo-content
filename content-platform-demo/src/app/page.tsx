import { prisma } from '@/lib/prisma'
import { Header } from '@/components/header'
import { ArticleCard } from '@/components/article-card'

export const revalidate = 60

export default async function HomePage() {
  const articles = await (prisma as any).article.findMany({
    where: { status: 'PUBLISHED' },
    include: { author: true, category: true, tags: { include: { tag: true } } },
    orderBy: { publishAt: 'desc' },
  }) as any[]

  const categories = await (prisma as any).category.findMany({
    include: { _count: { select: { articles: { where: { status: 'PUBLISHED' } } } } },
  }) as any[]

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <section className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight">Content Platform</h1>
          <p className="text-lg text-gray-600">A publishing platform with editorial workflows and SEO optimization.</p>
        </section>

        <aside className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat: any) => (
            <a key={cat.slug} href={`/category/${cat.slug}`}
              className="rounded-full border px-3 py-1 text-sm hover:bg-gray-50">
              {cat.name} ({cat._count.articles})
            </a>
          ))}
        </aside>

        <div className="grid gap-6 sm:grid-cols-2">
          {articles.map((article: any) => (
            <ArticleCard
              key={article.id}
              title={article.title}
              slug={article.slug}
              excerpt={article.excerpt}
              authorName={article.author.name}
              categorySlug={article.category.slug}
              categoryName={article.category.name}
              publishAt={article.publishAt?.toISOString() ?? null}
              tags={article.tags.map((t: any) => ({ name: t.tag.name, slug: t.tag.slug }))}
            />
          ))}
        </div>

        {articles.length === 0 && (
          <p className="py-16 text-center text-gray-500">No published articles yet.</p>
        )}
      </main>
    </>
  )
}
