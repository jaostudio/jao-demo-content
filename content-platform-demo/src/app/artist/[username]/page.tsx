import { fetchAPI } from '@/lib/api/server'
import { notFound } from 'next/navigation'
import { Avatar } from '@/components/new/ui/avatar'
import { FollowButton } from '@/components/follow-button'
import { LeftRail } from '@/components/new/layout/left-rail'
import { Header } from '@/components/new/layout/header'
import { RightPanel } from '@/components/new/layout/right-panel'
import { ArticleCard } from '@/components/new/article/article-card'
import type { Metadata } from 'next'

export const revalidate = 60

interface AuthorResponse {
  id: string
  name: string
  email: string
  image: string | null
  role: string
  createdAt: string
  followerCount: number
  followingCount: number
  articleCount: number
  articles: {
    id: string
    title: string
    slug: string
    excerpt: string | null
    image: string | null
    format: string
    aiFreeDeclaration: boolean
    provenanceStatus: string
    readingTime: number
    status: string
    publishAt: string | null
    createdAt: string
    likes: number
    categoryName: string
    categorySlug: string
    commentCount: number
  }[]
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params
  try {
    const author = await fetchAPI<AuthorResponse>(`/api/authors/${username}`)
    return { title: author.name, description: `Works by ${author.name} on Likha.` }
  } catch {
    return { title: 'Artist Not Found' }
  }
}

export default async function ArtistPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params

  let author: AuthorResponse
  let categories: { slug: string; name: string }[] = []
  try {
    author = await fetchAPI<AuthorResponse>(`/api/authors/${username}`)
    categories = await fetchAPI<{ slug: string; name: string }[]>('/api/categories').catch(() => [])
  } catch {
    notFound()
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark">
      <LeftRail />
      <div className="lg:ml-[68px]">
        <Header />
        <main className="mx-auto max-w-[1080px] px-5 py-5">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <div className="flex items-start gap-5">
                <Avatar name={author.name} size="lg" />
                <div className="min-w-0 flex-1">
                  <h1 className="text-[17px] font-semibold text-text-primary">{author.name}</h1>
                  <div className="mt-1 flex items-center gap-4 text-[12px] text-fog-gray">
                    <span>{author.articleCount} works</span>
                    <span>{author.followerCount} followers</span>
                    <span>{author.followingCount} following</span>
                  </div>
                  <div className="mt-3">
                    <FollowButton authorId={author.id} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {author.articles.map((a) => (
                  <ArticleCard
                    key={a.id}
                    title={a.title}
                    slug={a.slug}
                    excerpt={a.excerpt}
                    authorName={author.name}
                    categoryName={a.categoryName}
                    readingTime={a.readingTime}
                    commentCount={a.commentCount}
                    image={a.image}
                    format={a.format}
                    aiFreeDeclaration={a.aiFreeDeclaration}
                    provenanceStatus={a.provenanceStatus}
                    publishAt={a.publishAt}
                  />
                ))}
                {author.articles.length === 0 && (
                  <div className="py-16 text-center">
                    <p className="text-[14px] text-fog-gray">No published works yet.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="hidden lg:block">
              <RightPanel
                categories={categories}
                suggestedAuthors={[]}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
