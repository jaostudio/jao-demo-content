import { fetchAPI } from '@/lib/api/server'
import type { ArticleDetail, ArticleVersionResponse } from '@content-platform/shared'
import { notFound } from 'next/navigation'
import { NEW_LAYOUT_ENABLED } from '@/lib/new/flags'
import { Header } from '@/components/header'
import { CategoryBadge } from '@/components/category-badge'
import { JsonLd } from '@/components/json-ld'
import { ArticleContent } from '@/components/block-editor/public/article-content'
import { CommentSection } from '@/components/comment-section'
import { ArticleSidebar } from '@/components/article-sidebar'
import { Footer } from '@/components/footer'
import { ArticleDetail as NewArticleDetail } from '@/components/new/pages/article-detail'
import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jaostudio.dev'

export const revalidate = 60

export async function generateStaticParams() {
  try {
    const articles = await fetchAPI<{ slug: string }[]>('/api/articles?select=slug')
    return articles.map((a) => ({ slug: a.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const article = await fetchAPI<ArticleDetail>(`/api/articles/${slug}`)
    const canonicalUrl = `${SITE_URL}/articles/${article.slug}`

    return {
      title: article.title,
      description: article.excerpt ?? undefined,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: article.title,
        description: article.excerpt ?? undefined,
        type: 'article',
        publishedTime: article.publishAt ?? undefined,
        authors: [article.authorName],
        url: canonicalUrl,
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.excerpt ?? undefined,
      },
    }
  } catch {
    return {}
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let detail: ArticleDetail | null = null
  try {
    detail = await fetchAPI<ArticleDetail>(`/api/articles/${slug}`)
  } catch {
    notFound()
  }
  if (!detail) notFound()

  let comments: { id: string; authorName: string; body: string; createdAt: string }[] = []
  try {
    comments = await fetchAPI<{ id: string; authorName: string; body: string; createdAt: string }[]>(
      `/api/articles/${detail.id}/comments`,
    )
  } catch {
    // comments unavailable
  }

  let versions: ArticleVersionResponse[] = []
  try {
    versions = await fetchAPI<ArticleVersionResponse[]>(`/api/articles/${detail.id}/versions`)
  } catch {
    // versions unavailable
  }

  if (NEW_LAYOUT_ENABLED) {
    return (
      <NewArticleDetail
        title={detail.title}
        excerpt={detail.excerpt}
        content={detail.content}
        authorName={detail.authorName}
        authorRole={detail.authorRole}
        authorArticleCount={detail.authorArticleCount}
        categorySlug={detail.categoryId}
        categoryName={detail.categoryName}
        status={detail.status}
        readingTime={detail.readingTime}
        publishAt={detail.publishAt}
        tags={detail.tags}
        relatedArticles={detail.relatedArticles}
        comments={comments.map((c) => ({
          id: c.id,
          authorName: c.authorName,
          body: c.body,
          createdAt: c.createdAt,
        }))}
        articleId={detail.id}
        format={detail.format}
        aiFreeDeclaration={detail.aiFreeDeclaration}
        provenanceStatus={detail.provenanceStatus}
        likes={detail.likes}
        jsonLd={detail.jsonLd}
        image={detail.image}
        versions={versions}
      />
    )
  }

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: detail.title,
          description: detail.excerpt,
          author: { '@type': 'Person', name: detail.authorName },
          datePublished: detail.publishAt ?? undefined,
          dateModified: detail.createdAt,
          url: `${SITE_URL}/articles/${detail.slug}`,
          image: detail.image ?? undefined,
        }}
      />
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-4">
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div>
            <div className="mb-4">
              <div className="mb-2">
                <CategoryBadge slug={detail.categoryId} name={detail.categoryName} />
              </div>
              <h1 className="text-2xl font-semibold text-text-primary dark:text-slate-100">{detail.title}</h1>
              {detail.excerpt && (
                <p className="mt-2 text-sm text-text-secondary">{detail.excerpt}</p>
              )}
              <div className="mt-3 flex items-center gap-2 text-xs text-text-muted">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
                  {detail.authorName.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-text-secondary">{detail.authorName}</span>
                <span>·</span>
                {detail.publishAt && <span>{new Date(detail.publishAt).toLocaleDateString()}</span>}
                <span>·</span>
                <span>{detail.readingTime} min read</span>
              </div>
            </div>

            <div className="prose prose-sm prose-slate max-w-none dark:prose-invert">
              <ArticleContent content={detail.content} />
            </div>

            {detail.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-1.5">
                {detail.tags.map((t) => (
                  <span key={t.id} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-text-secondary dark:bg-slate-700 dark:text-slate-300">{t.name}</span>
                ))}
              </div>
            )}

            <div className="mt-8">
              <CommentSection
                articleId={detail.id}
                initialComments={comments.map((c) => ({
                  id: c.id,
                  authorName: c.authorName,
                  body: c.body,
                  createdAt: c.createdAt,
                }))}
              />
            </div>
          </div>

          <div className="hidden lg:block">
            <ArticleSidebar
              currentSlug={detail.slug}
              authorName={detail.authorName}
              categorySlug={detail.categoryId}
              categoryName={detail.categoryName}
              status={detail.status}
              readingTime={detail.readingTime}
              publishAt={detail.publishAt}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
