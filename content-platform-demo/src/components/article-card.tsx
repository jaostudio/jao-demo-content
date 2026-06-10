import Link from 'next/link'
import Image from 'next/image'
import { CategoryBadge } from '@/components/category-badge'

interface ArticleCardProps {
  title: string
  slug: string
  excerpt: string | null
  authorName: string
  categorySlug: string
  categoryName: string
  publishAt: string | null
  tags: { name: string; slug: string }[]
  image?: string | null
  content?: string | null
  variant?: 'featured' | 'standard'
}

const stripeClass: Record<string, string> = {
  technology: 'category-stripe-tech',
  design: 'category-stripe-design',
  business: 'category-stripe-business',
}

export function ArticleCard({ title, slug, excerpt, authorName, categorySlug, categoryName, publishAt, tags, image, content, variant = 'standard' }: ArticleCardProps) {
  const readingTime = content ? Math.ceil(content.split(/\s+/).length / 200) : null

  if (variant === 'featured') {
    return (
      <article className={`group overflow-hidden border-2 border-black bg-white nb-shadow transition-all hover:nb-shadow-lg dark:border-white dark:bg-black animate-card-drop ${stripeClass[categorySlug] ?? 'category-stripe-default'}`}>
        {image && (
          <div className="overflow-hidden">
            <Image src={image} alt={title} width={800} height={256} className="h-64 w-full object-cover transition-all group-hover:scale-105 bw-image" />
          </div>
        )}
        <div className="p-6">
          <div className="mb-3 flex items-center gap-3 text-sm">
            <CategoryBadge slug={categorySlug} name={categoryName} />
            <span className="text-neutral-500">{authorName}</span>
            {publishAt && <span className="text-neutral-400">{new Date(publishAt).toLocaleDateString()}</span>}
          </div>
          <Link href={`/articles/${slug}`}>
            <h2 className="mb-2 font-display text-2xl font-bold text-black transition-colors group-hover:text-indigo-deep-600 dark:text-white dark:group-hover:text-saffron-400">{title}</h2>
          </Link>
          {excerpt && <p className="mb-4 text-base text-neutral-600 dark:text-neutral-400">{excerpt}</p>}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {readingTime && <span className="text-xs text-neutral-400">{readingTime} min read</span>}
              {tags.map((tag) => (
                <span key={tag.slug} className="rounded-none border border-black bg-black px-2 py-0.5 text-xs font-bold text-white dark:border-white dark:bg-white dark:text-black">{tag.name}</span>
              ))}
            </div>
            <Link href={`/articles/${slug}`} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-saffron-500 text-black transition-all group-hover:translate-x-1 dark:border-white dark:text-black" aria-label="Read more">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className={`group border-2 border-black bg-white p-5 nb-shadow transition-all hover:nb-shadow-lg dark:border-white dark:bg-black animate-card-drop ${stripeClass[categorySlug] ?? 'category-stripe-default'}`}>
      <div className="mb-3 flex items-center gap-2 text-xs">
        <CategoryBadge slug={categorySlug} name={categoryName} />
        <span className="text-neutral-400">{authorName}</span>
        {publishAt && <span className="text-neutral-400">{new Date(publishAt).toLocaleDateString()}</span>}
      </div>
      <Link href={`/articles/${slug}`}>
        <h2 className="mb-1 font-display text-lg font-bold text-black transition-colors group-hover:text-indigo-deep-600 dark:text-white dark:group-hover:text-saffron-400">{title}</h2>
      </Link>
      {excerpt && <p className="mb-3 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">{excerpt}</p>}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {readingTime && <span className="mr-1 text-xs text-neutral-400">{readingTime} min read</span>}
          {tags.map((tag) => (
            <span key={tag.slug} className="rounded-none border border-black bg-black px-1.5 py-0.5 text-[10px] font-bold text-white dark:border-white dark:bg-white dark:text-black">{tag.name}</span>
          ))}
        </div>
        <Link href={`/articles/${slug}`} className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-black bg-saffron-500 text-black transition-all group-hover:translate-x-1 dark:border-white dark:text-black" aria-label="Read more">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
            <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </article>
  )
}
