import { LeftRail } from '../layout/left-rail'
import { Header } from '../layout/header'
import { CategoryPill } from '../article/category-pill'
import { AuthorCard } from '../article/author-card'
import { CommentThread } from '../article/comment-thread'
import { AiFreeBadge } from '../article/ai-free-badge'
import { LikeButton } from '@/components/like-button'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Tatak } from '../ui/tatak'
import { ArticleContent } from '@/components/block-editor/public/article-content'
import { JsonLd } from '@/components/json-ld'
import { Clock, Calendar, ArrowLeft, Image, PenLine, Video, Music } from 'lucide-react'
import Link from 'next/link'

interface RelatedArticle {
  title: string
  slug: string
  readingTime: number
  commentCount: number
}

const FORMAT_ICONS: Record<string, typeof Image> = {
  DRAWING: Image,
  WRITING: PenLine,
  VIDEO: Video,
  AUDIO: Music,
}

const FORMAT_LABELS: Record<string, string> = {
  DRAWING: 'Drawing',
  WRITING: 'Writing',
  VIDEO: 'Video',
  AUDIO: 'Audio',
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
  format: string
  aiFreeDeclaration: boolean
  likes: number
  jsonLd: Record<string, unknown>
  image?: string | null
}

export function ArticleDetail({
  title, excerpt, content, authorName, authorRole, authorArticleCount,
  categorySlug, categoryName, status, readingTime, publishAt, tags,
  relatedArticles, comments, articleId, format, aiFreeDeclaration, likes, jsonLd, image,
}: ArticleDetailProps) {
  const FormatIcon = FORMAT_ICONS[format] || null

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="min-h-screen bg-surface dark:bg-surface-dark">
        <LeftRail />
        <div className="lg:ml-[68px]">
          <Header />
          <main className="container-likha py-4">
            <Link href="/" className="inline-flex items-center gap-1 text-[11px] text-fog-gray hover:text-text-primary transition-colors mb-4">
              <ArrowLeft className="h-3 w-3" />
              Back
            </Link>

            <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
              {/* Main Content */}
              <article>
                {image && (
                  <div className="mb-4 overflow-hidden rounded-lg bg-surface-alt dark:bg-surface-dark">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt={title} className="w-full h-64 object-cover" />
                  </div>
                )}

                <div className="mb-2 flex items-center gap-1.5">
                  <CategoryPill slug={categorySlug} name={categoryName} />
                  {FormatIcon && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-fog-gray">
                      <FormatIcon className="h-3 w-3" />
                      {FORMAT_LABELS[format]}
                    </span>
                  )}
                  {aiFreeDeclaration && <AiFreeBadge />}
                </div>

                <h1 className="text-[21px] font-semibold text-text-primary leading-snug mb-2" style={{ letterSpacing: '-0.03em' }}>
                  {title}
                </h1>

                {excerpt && (
                  <p className="text-[13px] text-graphite leading-relaxed mb-3">{excerpt}</p>
                )}

                <div className="flex flex-wrap items-center gap-2 text-[11px] text-fog-gray mb-6 pb-4 border-b border-hairline">
                  <div className="flex items-center gap-1.5">
                    <div className="avatar avatar-sm bg-void-black text-white text-[10px]">
                      {authorName.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-graphite text-[13px]">{authorName}</span>
                  </div>
                  <span className="text-ash">&middot;</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {readingTime} min
                  </span>
                  {publishAt && (
                    <>
                      <span className="text-ash">&middot;</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(publishAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </>
                  )}
                  {status !== 'PUBLISHED' && (
                    <>
                      <span className="text-ash">&middot;</span>
                      <Tatak status={status as 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'ARCHIVED'} />
                    </>
                  )}
                </div>

                <div className="prose prose-sm max-w-none">
                  <ArticleContent content={content} />
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <div className="flex flex-wrap gap-1">
                    {tags.map((tag) => (
                      <Badge key={tag.id} variant="default">{tag.name}</Badge>
                    ))}
                  </div>
                  <div className="ml-auto">
                    <LikeButton articleId={articleId} initialLikes={likes} />
                  </div>
                </div>

                <div className="mt-8">
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

                <Card className="p-3">
                  <h3 className="text-[11px] font-semibold text-text-primary mb-2">Info</h3>
                  <div className="space-y-1.5 text-[11px] text-graphite">
                    <div className="flex justify-between">
                      <span className="text-fog-gray">Reading time</span>
                      <span>{readingTime} min</span>
                    </div>
                    {publishAt && (
                      <div className="flex justify-between">
                        <span className="text-fog-gray">Published</span>
                        <span>{new Date(publishAt).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-fog-gray">Category</span>
                      <CategoryPill slug={categorySlug} name={categoryName} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-fog-gray">Status</span>
                      <Tatak status={status as 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'ARCHIVED'} />
                    </div>
                  </div>
                </Card>

                {relatedArticles.length > 0 && (
                  <Card className="p-3">
                    <h3 className="text-[11px] font-semibold text-text-primary mb-2">Related</h3>
                    <div className="space-y-1">
                      {relatedArticles.map((r) => (
                        <Link
                          key={r.slug}
                          href={`/articles/${r.slug}`}
                          className="block rounded px-2 py-1.5 hover:bg-surface-alt transition-colors group"
                        >
                          <p className="text-[13px] font-medium text-text-primary group-hover:text-text-primary transition-colors line-clamp-2">
                            {r.title}
                          </p>
                          <p className="text-[10px] text-fog-gray mt-0.5">{r.readingTime} min</p>
                        </Link>
                      ))}
                    </div>
                  </Card>
                )}
              </aside>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
