import { Header } from '../layout/header'
import { Footer } from '../layout/footer'
import { CategoryPill } from '../article/category-pill'
import { AuthorCard } from '../article/author-card'
import { CommentThread } from '../article/comment-thread'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Tatak } from '../ui/tatak'
import { ArticleContent } from '@/components/block-editor/public/article-content'
import { JsonLd } from '@/components/json-ld'
import { Clock, Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface RelatedArticle {
  title: string
  slug: string
  readingTime: number
  commentCount: number
}

interface ArticleDetailProps {
  title: string
  excerpt: string | null
  content: string
  authorName: string
  authorRole?: string
  authorArticleCount?: number
  categorySlug: string
  categoryName: string
  status: string
  readingTime: number
  publishAt: Date | string | null
  tags: { id: string; name: string }[]
  relatedArticles: RelatedArticle[]
  comments: { id: string; authorName: string; body: string; createdAt: string }[]
  articleId: string
  jsonLd: Record<string, unknown>
  image?: string | null
}

export function ArticleDetail({
  title, excerpt, content, authorName, authorRole, authorArticleCount,
  categorySlug, categoryName, status, readingTime, publishAt, tags,
  relatedArticles, comments, articleId, jsonLd, image,
}: ArticleDetailProps) {
  return (
    <>
      <JsonLd data={jsonLd} />
      <Header />
      <main className="container-likha py-4">
        <Link href="/" className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-primary transition-colors mb-4">
          <ArrowLeft className="h-3 w-3" />
          Back to kwento
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          {/* Main Content */}
          <article>
            {image && (
              <div className="mb-6 overflow-hidden rounded-lg bg-surface-alt">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={title} className="w-full h-64 object-cover" />
              </div>
            )}

            <div className="mb-3">
              <CategoryPill slug={categorySlug} name={categoryName} />
            </div>

            <h1 className="text-3xl font-display font-bold text-text-primary leading-tight mb-3">
              {title}
            </h1>

            {excerpt && (
              <p className="text-sm text-text-secondary leading-relaxed mb-4">{excerpt}</p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted mb-8 pb-6 border-b border-border">
              <div className="flex items-center gap-1.5">
                <div className="avatar avatar-sm bg-primary text-white text-[10px]">
                  {authorName.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-text-secondary">{authorName}</span>
              </div>
              <span className="text-border">·</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {readingTime} min read
              </span>
              {publishAt && (
                <>
                  <span className="text-border">·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(publishAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </>
              )}
              {status !== 'PUBLISHED' && (
                <>
                  <span className="text-border">·</span>
                  <Tatak status={status as 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'ARCHIVED'} />
                </>
              )}
            </div>

            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ArticleContent content={content} />
            </div>

            {tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Badge key={tag.id} variant="default">{tag.name}</Badge>
                ))}
              </div>
            )}

            {/* Comments */}
            <div className="mt-10">
              <CommentThread articleId={articleId} initialComments={comments} />
            </div>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block space-y-4">
            <AuthorCard
              name={authorName}
              role={authorRole}
              articleCount={authorArticleCount}
            />

            <Card className="p-4">
              <h3 className="text-xs font-display font-bold text-text-primary mb-3">Article Info</h3>
              <div className="space-y-2 text-xs text-text-secondary">
                <div className="flex justify-between">
                  <span className="text-text-muted">Reading time</span>
                  <span>{readingTime} min</span>
                </div>
                {publishAt && (
                  <div className="flex justify-between">
                    <span className="text-text-muted">Published</span>
                    <span>{new Date(publishAt).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-text-muted">Category</span>
                  <CategoryPill slug={categorySlug} name={categoryName} />
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Status</span>
                  <Tatak status={status as 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'ARCHIVED'} />
                </div>
              </div>
            </Card>

            {relatedArticles.length > 0 && (
              <Card className="p-4">
                <h3 className="text-xs font-display font-bold text-text-primary mb-3">Related Kwento</h3>
                <div className="space-y-2">
                  {relatedArticles.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/articles/${r.slug}`}
                      className="block rounded px-1.5 py-1.5 hover:bg-primary-light transition-colors group"
                    >
                      <p className="text-xs font-medium text-text-primary group-hover:text-primary transition-colors line-clamp-2">
                        {r.title}
                      </p>
                      <p className="text-[10px] text-text-muted mt-0.5">{r.readingTime} min</p>
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}
