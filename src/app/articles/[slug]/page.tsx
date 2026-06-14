import { prisma } from '@/lib/prisma'
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
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true },
  })
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { author: true, category: true },
  })
  if (!article) return {}

  const canonicalUrl = article.canonicalUrl ?? `${SITE_URL}/articles/${article.slug}`

  return {
    title: article.metaTitle ?? article.title,
    description: article.metaDescription ?? article.excerpt,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: article.metaTitle ?? article.title,
      description: article.metaDescription ?? article.excerpt ?? undefined,
      type: 'article',
      publishedTime: article.publishAt?.toISOString(),
      authors: [article.author.name],
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.metaTitle ?? article.title,
      description: article.metaDescription ?? article.excerpt ?? undefined,
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      author: true,
      category: true,
      tags: { include: { tag: true } },
      _count: { select: { comments: true } },
    },
  })
  if (!article) notFound()

  const comments = await prisma.comment.findMany({
    where: { articleId: article.id },
    orderBy: { createdAt: 'desc' },
  })

  const readingTime = Math.ceil(article.content.split(/\s+/).length / 200)

  if (NEW_LAYOUT_ENABLED) {
    const relatedArticles = await prisma.article.findMany({
      where: { categoryId: article.categoryId, id: { not: article.id }, status: 'PUBLISHED' },
      take: 4,
      select: { title: true, slug: true, content: true, _count: { select: { comments: true } } },
    })

    return (
      <NewArticleDetail
        title={article.title}
        excerpt={article.excerpt}
        content={article.content}
        authorName={article.author.name}
        authorRole={article.author.role === 'ADMIN' ? 'Editor' : 'Author'}
        authorArticleCount={await prisma.article.count({ where: { authorId: article.author.id } })}
        categorySlug={article.category.slug}
        categoryName={article.category.name}
        status={article.status}
        readingTime={readingTime}
        publishAt={article.publishAt?.toISOString() ?? null}
        tags={article.tags.map((t) => ({ id: t.tag.id, name: t.tag.name }))}
        relatedArticles={relatedArticles.map((r) => ({
          title: r.title,
          slug: r.slug,
          readingTime: Math.ceil(r.content.split(/\s+/).length / 200),
          commentCount: r._count.comments,
        }))}
        comments={comments.map((c) => ({
          id: c.id,
          authorName: c.authorName,
          body: c.body,
          createdAt: c.createdAt.toISOString(),
        }))}
        articleId={article.id}
        format={article.format}
        aiFreeDeclaration={article.aiFreeDeclaration}
        likes={article.likes}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: article.excerpt,
          author: { '@type': 'Person', name: article.author.name },
          datePublished: article.publishAt?.toISOString(),
          dateModified: article.updatedAt.toISOString(),
          url: `${SITE_URL}/articles/${article.slug}`,
          image: article.imageUrl ?? undefined,
        }}
        image={article.imageUrl}
      />
    )
  }

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: article.excerpt,
          author: { '@type': 'Person', name: article.author.name },
          datePublished: article.publishAt?.toISOString(),
          dateModified: article.updatedAt.toISOString(),
          url: `${SITE_URL}/articles/${article.slug}`,
          image: article.imageUrl ?? undefined,
        }}
      />
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-4">
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div>
            <div className="mb-4">
              <div className="mb-2">
                <CategoryBadge slug={article.category.slug} name={article.category.name} />
              </div>
              <h1 className="text-2xl font-semibold text-text-primary dark:text-slate-100">{article.title}</h1>
              {article.excerpt && (
                <p className="mt-2 text-sm text-text-secondary">{article.excerpt}</p>
              )}
              <div className="mt-3 flex items-center gap-2 text-xs text-text-muted">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
                  {article.author.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-text-secondary">{article.author.name}</span>
                <span>·</span>
                {article.publishAt && <span>{new Date(article.publishAt).toLocaleDateString()}</span>}
                <span>·</span>
                <span>{readingTime} min read</span>
              </div>
            </div>

            <div className="prose prose-sm prose-slate max-w-none dark:prose-invert">
              <ArticleContent content={article.content} />
            </div>

            {article.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-1.5">
                {article.tags.map((t) => (
                  <span key={t.tag.id} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-text-secondary dark:bg-slate-700 dark:text-slate-300">{t.tag.name}</span>
                ))}
              </div>
            )}

            <div className="mt-8">
              <CommentSection
                articleId={article.id}
                initialComments={comments.map((c) => ({
                  id: c.id,
                  authorName: c.authorName,
                  body: c.body,
                  createdAt: c.createdAt.toISOString(),
                }))}
              />
            </div>
          </div>

          <div className="hidden lg:block">
            <ArticleSidebar
              currentSlug={article.slug}
              authorName={article.author.name}
              categorySlug={article.category.slug}
              categoryName={article.category.name}
              status={article.status}
              readingTime={readingTime}
              publishAt={article.publishAt}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
