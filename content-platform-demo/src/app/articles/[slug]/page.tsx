import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import Link from 'next/link'
import { StatusBadge } from '@/components/status-badge'
import { JsonLd } from '@/components/json-ld'
import type { Metadata } from 'next'

export const revalidate = 60

export async function generateStaticParams() {
  const articles = await (prisma as any).article.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true },
  })
  return articles.map((a: any) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = await (prisma as any).article.findUnique({
    where: { slug },
    include: { author: true, category: true },
  })
  if (!article) return {}

  return {
    title: article.metaTitle ?? article.title,
    description: article.metaDescription ?? article.excerpt,
    openGraph: {
      title: article.metaTitle ?? article.title,
      description: article.metaDescription ?? article.excerpt,
      type: 'article',
      publishedTime: article.publishAt?.toISOString(),
      authors: [article.author.name],
    },
    alternates: article.canonicalUrl ? { canonical: article.canonicalUrl } : undefined,
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await (prisma as any).article.findUnique({
    where: { slug },
    include: {
      author: true,
      category: true,
      tags: { include: { tag: true } },
    },
  })
  if (!article) notFound()

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
        }}
      />
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-6">
          <Link href={`/category/${article.category.slug}`}
            className="rounded bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200">
            {article.category.name}
          </Link>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">{article.title}</h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
            <span>{article.author.name}</span>
            {article.publishAt && <span>{new Date(article.publishAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>}
            <StatusBadge status={article.status} />
          </div>
          {article.excerpt && (
            <p className="mt-4 text-lg text-gray-600">{article.excerpt}</p>
          )}
        </div>

        <div className="prose prose-gray max-w-none">
          {article.content.split('\n').map((line: string, i: number) => {
            if (line.startsWith('## ')) return <h2 key={i} className="mt-8 mb-3 text-2xl font-semibold">{line.slice(3)}</h2>
            if (line.startsWith('### ')) return <h3 key={i} className="mt-6 mb-2 text-xl font-semibold">{line.slice(4)}</h3>
            if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc text-gray-700">{line.slice(2)}</li>
            if (line.trim() === '') return <div key={i} className="h-4" />
            return <p key={i} className="mb-4 leading-relaxed text-gray-700">{line}</p>
          })}
        </div>

        {article.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {article.tags.map((t: any) => (
              <span key={t.tag.id} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">{t.tag.name}</span>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
