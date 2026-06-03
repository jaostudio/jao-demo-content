import Link from 'next/link'

interface ArticleCardProps {
  title: string
  slug: string
  excerpt: string | null
  authorName: string
  categorySlug: string
  categoryName: string
  publishAt: string | null
  tags: { name: string; slug: string }[]
}

export function ArticleCard({ title, slug, excerpt, authorName, categorySlug, categoryName, publishAt, tags }: ArticleCardProps) {
  return (
    <article className="rounded-lg border p-5 transition-shadow hover:shadow-md">
      <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
        <Link href={`/category/${categorySlug}`} className="rounded bg-gray-100 px-2 py-0.5 font-medium hover:bg-gray-200">
          {categoryName}
        </Link>
        <span>{authorName}</span>
        {publishAt && <span>{new Date(publishAt).toLocaleDateString()}</span>}
      </div>
      <Link href={`/articles/${slug}`}>
        <h2 className="mb-1 text-xl font-semibold hover:text-gray-600">{title}</h2>
      </Link>
      {excerpt && <p className="mb-3 text-sm text-gray-600">{excerpt}</p>}
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span key={tag.slug} className="rounded bg-gray-50 px-2 py-0.5 text-xs text-gray-500">{tag.name}</span>
        ))}
      </div>
    </article>
  )
}
