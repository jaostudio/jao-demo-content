'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { LeftRail } from '@/components/new/layout/left-rail'
import { Header } from '@/components/new/layout/header'
import { WorkCard } from '@/components/new/work/work-card'
import { Reveal } from '@/components/new/motion/reveal'
import { Skeleton, SkeletonCard } from '@/components/new/ui/skeleton'
import Link from 'next/link'

interface CollectionItem {
  id: string
  title: string
  slug: string
  excerpt: string | null
  image: string | null
  format: string
  authorName: string
  categoryName: string
  commentCount: number
}

interface CollectionDetail {
  id: string
  title: string
  slug: string
  description: string | null
  visibility: string
  items: CollectionItem[]
}

export default function CollectionPage() {
  const params = useParams()
  const slug = params.slug as string
  const [collection, setCollection] = useState<CollectionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('likha-token')
    if (!stored) {
      setLoading(false)
      setError('Sign in to view collections.')
      return
    }

    fetch(`/api/collections/${slug}`, {
      headers: { Authorization: `Bearer ${stored}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Collection not found')
        return res.json()
      })
      .then((data) => {
        setCollection(data)
        setLoading(false)
      })
      .catch((e) => {
        setError(e.message)
        setLoading(false)
      })
  }, [slug])

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark">
      <LeftRail />
      <div className="lg:ml-[68px]">
        <Header />
        <main className="mx-auto max-w-[1080px] px-5 py-5">
          {loading && (
            <div className="space-y-4">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-3 w-72" />
              <Skeleton className="h-3 w-48" />
              <div className="space-y-3 mt-6">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-[14px] text-fog-gray">{error}</p>
              {error.includes('Sign in') && (
                <Link href="/signin" className="mt-3 btn btn-sm btn-dark">
                  Sign In
                </Link>
              )}
            </div>
          )}

          {collection && (
            <>
              {/* Collection Hero */}
              <div className="studio-frame relative overflow-hidden rounded-xl border border-hairline bg-gradient-to-br from-surface-alt to-surface p-6 mb-6">
                <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{
                  backgroundImage: 'radial-gradient(circle at 30% 40%, var(--color-voltage-pink) 0%, transparent 60%), radial-gradient(circle at 70% 60%, var(--color-reactor-green) 0%, transparent 60%)',
                }} />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block rounded-full bg-surface-alt border border-hairline px-2 py-0.5 text-[10px] text-fog-gray">
                      {collection.visibility}
                    </span>
                    <span className="text-[11px] text-fog-gray">{collection.items.length} item{collection.items.length !== 1 ? 's' : ''}</span>
                  </div>
                  <h1 className="text-[22px] font-semibold text-text-primary tracking-[-0.03em]">{collection.title}</h1>
                  {collection.description && (
                    <p className="mt-2 text-[14px] text-graphite leading-relaxed max-w-lg">{collection.description}</p>
                  )}
                  <p className="mt-3 text-[12px] text-fog-gray">
                    Curated collection &middot; Works selected for their creative process and craft.
                  </p>
                </div>
              </div>

              {/* Curated Grid */}
              {collection.items.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-[14px] text-fog-gray">This collection is empty.</p>
                  <p className="text-[12px] text-ash mt-1">Collected works will appear here.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {collection.items.map((item, i) => (
                    <Reveal key={item.id}>
                      <WorkCard
                        articleId={item.id}
                        title={item.title}
                        slug={item.slug}
                        excerpt={item.excerpt}
                        authorName={item.authorName}
                        categoryName={item.categoryName}
                        readingTime={3}
                        commentCount={item.commentCount}
                        image={item.image}
                        format={item.format}
                        publishAt={null}
                        variant={i === 0 ? 'featured' : i < 3 ? 'compact' : 'feed'}
                      />
                    </Reveal>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
