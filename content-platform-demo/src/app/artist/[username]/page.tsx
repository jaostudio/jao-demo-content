import { fetchAPI } from '@/lib/api/server'
import { notFound } from 'next/navigation'
import { Avatar } from '@/components/new/ui/avatar'
import { FollowButton } from '@/components/follow-button'
import { LeftRail } from '@/components/new/layout/left-rail'
import { Header } from '@/components/new/layout/header'
import { RightPanel } from '@/components/new/layout/right-panel'
import { WorkCard } from '@/components/new/work/work-card'
import { Reveal } from '@/components/new/motion/reveal'
import type { Metadata } from 'next'

export const revalidate = 60

interface AuthorResponse {
  id: string
  name: string
  email: string
  image: string | null
  bio: string | null
  specialty: string | null
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

  const initials = author.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark">
      <LeftRail />
      <div className="lg:ml-[68px]">
        <Header />
        <main className="mx-auto max-w-[1080px] px-5 py-5">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              {/* Artist Cover */}
              <div className="studio-frame relative h-32 overflow-hidden rounded-xl bg-gradient-to-br from-reactor-green/10 via-surface-alt to-voltage-pink/5 border border-hairline">
                <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, var(--color-reactor-green) 8px, var(--color-reactor-green) 9px)',
                }} />
              </div>

              {/* Artist Identity */}
              <div className="flex flex-col sm:flex-row items-start gap-4 -mt-16 relative z-10 px-2">
                <div className="rounded-full border-2 border-surface bg-surface-dark shadow-md overflow-hidden">
                  {author.image ? (
                    <img src={author.image} alt={`${author.name} avatar`} className="h-16 w-16 object-cover sm:h-20 sm:w-20" />
                  ) : (
                    <Avatar name={author.name} size="xl" />
                  )}
                </div>
                <div className="min-w-0 flex-1 pt-2">
                  <h1 className="text-[20px] font-semibold text-text-primary">{author.name}</h1>
                  <p className="text-[12px] text-fog-gray mt-0.5">{author.role} &middot; Joined {new Date(author.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                  {author.specialty && (
                    <p className="text-[11px] text-graphite mt-1">{author.specialty}</p>
                  )}
                  <div className="mt-3 flex items-center gap-4">
                    <FollowButton authorId={author.id} />
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="process-line pl-6 flex gap-6 px-2">
                <div>
                  <p className="text-[18px] font-semibold text-text-primary">{author.articleCount}</p>
                  <p className="text-[11px] text-fog-gray">works</p>
                </div>
                <div>
                  <p className="text-[18px] font-semibold text-text-primary">{author.followerCount}</p>
                  <p className="text-[11px] text-fog-gray">followers</p>
                </div>
                <div>
                  <p className="text-[18px] font-semibold text-text-primary">{author.followingCount}</p>
                  <p className="text-[11px] text-fog-gray">following</p>
                </div>
              </div>

              {/* Bio */}
              {author.bio && (
                <div className="studio-frame rounded-xl border border-hairline bg-surface p-4">
                  <p className="text-[13px] text-text-body leading-relaxed">{author.bio}</p>
                </div>
              )}

              {/* Sticky Tab Bar */}
              <div className="flex gap-0 border-b border-hairline sticky top-0 bg-surface dark:bg-surface-dark z-10">
                {['Works', 'Collections', 'About'].map((tab, i) => (
                  <button
                    key={tab}
                    className={`relative px-4 py-2.5 text-[13px] font-medium transition-colors ${i === 0 ? 'text-text-primary' : 'text-fog-gray hover:text-text-primary'}`}
                  >
                    {tab}
                    {i === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-reactor-green" />
                    )}
                  </button>
                ))}
              </div>

              {/* Works Grid */}
              {author.articles.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-[14px] text-fog-gray">No published works yet.</p>
                  <p className="text-[12px] text-ash mt-1">Check back later.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {author.articles.map((a, i) => (
                    <Reveal key={a.id}>
                      <WorkCard
                        articleId={a.id}
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
                        variant={i === 0 ? 'featured' : 'feed'}
                      />
                    </Reveal>
                  ))}
                </div>
              )}
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
