'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { LeftRail } from '@/components/new/layout/left-rail'
import { Header } from '@/components/new/layout/header'
import { WorkCard } from '@/components/new/work/work-card'
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
  const [token, setToken] = useState<string | null>(null)
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
    setToken(stored)

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
  }, [slug, token])

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark">
      <LeftRail />
      <div className="lg:ml-[68px]">
        <Header />
        <main className="mx-auto max-w-[1080px] px-5 py-5">
          {loading && (
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-3 w-72" />
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
              <div className="mb-6">
                <h1 className="text-[17px] font-semibold text-text-primary">{collection.title}</h1>
                {collection.description && (
                  <p className="text-[12px] text-fog-gray mt-1">{collection.description}</p>
                )}
                <span className="mt-2 inline-block rounded-full bg-surface-alt px-2 py-0.5 text-[10px] text-fog-gray">
                  {collection.visibility}
                </span>
              </div>

              <div className="space-y-3">
                {collection.items.length === 0 && (
                  <div className="py-16 text-center">
                    <p className="text-[14px] text-fog-gray">This collection is empty.</p>
                    <p className="text-[12px] text-ash mt-1">Collected works will appear here.</p>
                  </div>
                )}
                {collection.items.map((item) => (
                  <WorkCard
                    key={item.id}
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
                  />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
