import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { CategoryBadge } from '@/components/category-badge'
import { JsonLd } from '@/components/json-ld'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import { CommentSection } from '@/components/comment-section'
import { ArticleSidebar } from '@/components/article-sidebar'
import { Footer } from '@/components/footer'
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
    },
  })
  if (!article) notFound()

  const comments = await prisma.comment.findMany({
    where: { articleId: article.id },
    orderBy: { createdAt: 'desc' },
  })

  const readingTime = Math.ceil(article.content.split(/\s+/).length / 200)

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
          image: article.image ?? undefined,
        }}
      />
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="mb-3">
                <CategoryBadge slug={article.category.slug} name={article.category.name} />
              </div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-black dark:text-white md:text-4xl">{article.title}</h1>
              {article.excerpt && (
                <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">{article.excerpt}</p>
              )}
            </div>

            <div className="prose prose-gray max-w-none">
              <MarkdownRenderer content={article.content} />
            </div>

            {article.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {article.tags.map((t) => (
                  <span key={t.tag.id} className="border-2 border-black bg-black px-3 py-1 text-xs font-bold text-white dark:border-white dark:bg-white dark:text-black">{t.tag.name}</span>
                ))}
              </div>
            )}

            <div className="mt-12">
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
