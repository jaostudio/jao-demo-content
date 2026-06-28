import { fetchAPI } from '@/lib/api/server'
import type { ArticleDetail, ArticleVersionResponse } from '@content-platform/shared'
import { notFound } from 'next/navigation'
import { WorkDetailPage } from '@/components/new/work/work-detail-page'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const article = await fetchAPI<ArticleDetail>(`/api/articles/${slug}`)
    return {
      title: article.title,
      description: article.excerpt ?? undefined,
      openGraph: {
        title: article.title,
        description: article.excerpt ?? undefined,
        type: 'article',
        publishedTime: article.publishAt ?? undefined,
        authors: [article.authorName],
      },
    }
  } catch {
    return {}
  }
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let detail: ArticleDetail
  try {
    detail = await fetchAPI<ArticleDetail>(`/api/articles/${slug}`)
  } catch {
    notFound()
  }

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

  return <WorkDetailPage article={detail} versions={versions} comments={comments} />
}
