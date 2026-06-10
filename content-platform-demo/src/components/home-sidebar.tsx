import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { CategoryBadge } from '@/components/category-badge'

export async function HomeSidebar() {
  const [trending, categories] = await Promise.all([
    prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      select: { title: true, slug: true, category: { select: { slug: true, name: true } }, content: true },
      orderBy: { publishAt: 'desc' },
      take: 5,
    }),
    prisma.category.findMany({
      include: { _count: { select: { articles: { where: { status: 'PUBLISHED' } } } } },
    }),
  ])

  return (
    <aside className="space-y-8">
      <div className="border-2 border-black bg-saffron-100 p-4 nb-shadow dark:border-white dark:bg-saffron-900/30">
        <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-black dark:text-white">Trending</h3>
        <div className="space-y-3">
          {trending.map((article, i) => (
            <Link key={article.slug} href={`/articles/${article.slug}`} className="group flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border-2 border-black bg-coral-400 text-xs font-bold text-black dark:border-white">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-black transition-colors group-hover:text-indigo-deep-600 dark:text-white dark:group-hover:text-saffron-400 line-clamp-2">
                  {article.title}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <CategoryBadge slug={article.category.slug} name={article.category.name} />
                  <span className="text-xs text-neutral-500">{Math.ceil((article.content?.split(/\s+/).length ?? 0) / 200)} min read</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="border-2 border-black bg-cream p-4 nb-shadow dark:border-white dark:bg-black">
        <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-black dark:text-white">Categories</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`} className="group flex items-center justify-between border-b border-dashed border-black/20 px-3 py-2 transition-colors hover:bg-saffron-100 dark:border-white/20 dark:hover:bg-saffron-900/20">
              <span className="text-sm font-bold text-black transition-colors group-hover:text-indigo-deep-600 dark:text-white dark:group-hover:text-saffron-400">{cat.name}</span>
              <span className="border border-black bg-black px-2 py-0.5 text-xs font-bold text-saffron-500 dark:border-white dark:bg-white dark:text-black">{cat._count.articles}</span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}
