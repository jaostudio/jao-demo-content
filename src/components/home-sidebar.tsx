import Link from 'next/link'
import { prisma } from '@/lib/prisma'

interface HomeSidebarProps {
  categories: { name: string; slug: string; _count: { articles: number } }[]
}

export async function HomeSidebar({ categories }: HomeSidebarProps) {
  const trending = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    select: { title: true, slug: true, _count: { select: { comments: true } } },
    orderBy: { publishAt: 'desc' },
    take: 5,
  })

  const totalArticles = await prisma.article.count({ where: { status: 'PUBLISHED' } })
  const totalAuthors = await prisma.author.count()
  const totalComments = await prisma.comment.count()

  return (
    <aside className="space-y-3">
      {/* Community Info */}
      <div className="overflow-hidden rounded-lg border border-border bg-card dark:border-border-dark dark:bg-card-dark">
        <div className="bg-primary px-3 py-2 text-xs font-bold text-white">About Likha</div>
        <div className="p-3">
          <p className="text-xs text-text-secondary">
            The Philippine Community Information Hub — opinyon, kwento, at impormasyon para sa bawat Pilipino.
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center dark:border-border-dark">
            <div>
              <p className="text-sm font-bold text-text-primary dark:text-slate-100">{totalArticles}</p>
              <p className="text-[10px] text-text-muted">Articles</p>
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary dark:text-slate-100">{totalAuthors}</p>
              <p className="text-[10px] text-text-muted">Authors</p>
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary dark:text-slate-100">{totalComments}</p>
              <p className="text-[10px] text-text-muted">Comments</p>
            </div>
          </div>
          <Link href="/register" className="mt-3 block w-full rounded-full bg-primary py-1.5 text-center text-xs font-medium text-white transition-colors hover:bg-primary-hover">
            Join Likha
          </Link>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="overflow-hidden rounded-lg border border-border bg-card dark:border-border-dark dark:bg-card-dark">
        <div className="px-3 py-2 text-xs font-bold text-text-primary dark:text-slate-100">Popular Categories</div>
        <div className="px-3 pb-3">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`} className="flex items-center justify-between py-1.5 text-xs transition-colors hover:text-primary">
              <span className="text-text-secondary">{cat.name}</span>
              <span className="text-text-muted">{cat._count.articles}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Trending */}
      <div className="overflow-hidden rounded-lg border border-border bg-card dark:border-border-dark dark:bg-card-dark">
        <div className="px-3 py-2 text-xs font-bold text-text-primary dark:text-slate-100">Trending</div>
        <div className="px-3 pb-3">
          {trending.map((article, i) => (
            <Link key={article.slug} href={`/articles/${article.slug}`} className="flex items-start gap-2 py-1.5 transition-colors hover:text-primary">
              <span className="mt-0.5 text-[10px] font-bold text-text-muted">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-text-primary line-clamp-2 dark:text-slate-100">{article.title}</p>
                <p className="mt-0.5 text-[10px] text-text-muted">{article._count.comments} comments</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}
