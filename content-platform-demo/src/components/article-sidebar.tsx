import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { CategoryBadge } from '@/components/category-badge'
import { StatusBadge } from '@/components/status-badge'

interface ArticleSidebarProps {
  currentSlug: string
  authorName: string
  categorySlug: string
  categoryName: string
  status: string
  readingTime: number
  publishAt: Date | null
}

const avatarColors = ['bg-saffron-500', 'bg-indigo-deep-600', 'bg-coral-400', 'bg-cat-tech', 'bg-saffron-700']

function getAvatarColor(name: string) {
  const index = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return avatarColors[index % avatarColors.length]
}

export async function ArticleSidebar({ currentSlug, authorName, categorySlug, categoryName, status, readingTime, publishAt }: ArticleSidebarProps) {
  const related = await prisma.article.findMany({
    where: { category: { slug: categorySlug }, slug: { not: currentSlug }, status: 'PUBLISHED' },
    select: { title: true, slug: true },
    take: 3,
  })

  return (
    <aside className="space-y-6">
      <div className="border-2 border-black bg-cream p-5 nb-shadow dark:border-white dark:bg-black">
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-black text-sm font-bold text-white dark:border-white ${getAvatarColor(authorName)}`}>
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-black dark:text-white">{authorName}</p>
            <p className="text-xs text-neutral-500">Author</p>
          </div>
        </div>
      </div>

      <div className="border-2 border-black bg-cream p-5 nb-shadow dark:border-white dark:bg-black">
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Reading time</span>
            <span className="stamp border-neutral-400 text-[10px] text-neutral-600 dark:text-neutral-300">{readingTime} min</span>
          </div>
          {publishAt && (
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Published</span>
              <span className="font-bold text-black dark:text-white">{new Date(publishAt).toLocaleDateString()}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Category</span>
            <CategoryBadge slug={categorySlug} name={categoryName} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Status</span>
            <StatusBadge status={status} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="border-2 border-black bg-saffron-100 p-5 nb-shadow dark:border-white dark:bg-saffron-900/30">
          <h3 className="mb-3 font-display text-sm font-bold text-black dark:text-white">Related</h3>
          <div className="space-y-3">
            {related.map((r) => (
              <Link key={r.slug} href={`/articles/${r.slug}`} className="group flex items-center gap-2 border-b border-dashed border-black/20 pb-2 dark:border-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-1">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-bold text-black transition-colors group-hover:text-indigo-deep-600 dark:text-white dark:group-hover:text-saffron-400 line-clamp-2">{r.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
