'use client'

import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { AppShell } from '../layout/app-shell'
import { WorkCard } from '../work/work-card'
import { Search, TrendingUp, Users, Tags, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { LikhaLogo } from '@/components/brand/likha-logo'

interface SearchResult {
  id: string
  title: string
  slug: string
  excerpt: string | null
  authorName: string
  categoryName: string
  readingTime: number
  commentCount: number
  image: string | null
  format: string
  aiFreeDeclaration: boolean
  publishAt: string | null
}

type TabId = 'works' | 'artists' | 'tags' | 'collections'

const TABS: { id: TabId; label: string; icon: typeof BookOpen }[] = [
  { id: 'works', label: 'Works', icon: BookOpen },
  { id: 'artists', label: 'Artists', icon: Users },
  { id: 'tags', label: 'Tags', icon: Tags },
  { id: 'collections', label: 'Collections', icon: TrendingUp },
]

const FEATURED_TAGS = [
  { name: 'Technology', slug: 'technology' },
  { name: 'Design', slug: 'design' },
  { name: 'Process', slug: 'process' },
  { name: 'Philippines', slug: 'philippines' },
]

export function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>('works')

  const handleSearch = useCallback(async (q: string) => {
    if (!q.trim()) return
    setLoading(true)
    setSearched(true)
    setError(null)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`)
      if (res.ok) {
        const data = await res.json()
        setResults(data.articles || [])
      } else {
        setError('Search request failed. Please try again.')
        setResults([])
      }
    } catch {
      setError('Network error. Check your connection and try again.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery)
    }
  }, [initialQuery, handleSearch])

  return (
    <AppShell>
      <div className="mb-6 max-w-[520px]">
        <div className="flex items-center gap-2 mb-3">
          <LikhaLogo variant="mark" size="sm" className="text-fog-gray" />
          <h1 className="text-[17px] font-semibold text-text-primary">Search</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-fog-gray" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
            placeholder="Search works, artists, topics..."
            aria-label="Search"
            className="input h-11 w-full pl-11 pr-4 text-[14px]"
            autoFocus
          />
        </div>
      </div>

      {/* Tab bar */}
      {searched && (
        <div className="flex gap-0 border-b border-hairline mb-4">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = tab.id === activeTab
            const isDisabled = tab.id !== 'works'
            return (
              <button
                key={tab.id}
                onClick={() => !isDisabled && setActiveTab(tab.id)}
                className={`relative px-4 py-2 text-[13px] font-medium transition-colors flex items-center gap-1.5 ${
                  isDisabled ? 'text-ash cursor-not-allowed' : isActive ? 'text-text-primary' : 'text-fog-gray hover:text-text-primary'
                }`}
                title={isDisabled ? 'Coming soon' : tab.label}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-reactor-green" />
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="rounded-lg border border-danger/20 bg-danger-light dark:bg-transparent px-4 py-3 mb-4">
          <p className="text-[13px] text-danger">{error}</p>
          <button
            onClick={() => handleSearch(query)}
            className="mt-2 text-[12px] font-medium text-text-primary hover:text-reactor-green transition-colors"
          >
            Retry search
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="py-12 text-center">
          <div className="animate-pulse flex flex-col items-center gap-2">
            <div className="h-4 w-32 rounded bg-hairline" />
            <div className="h-3 w-48 rounded bg-hairline" />
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && searched && !error && results.length > 0 && (
        <div className="space-y-4">
          <p className="text-[12px] text-fog-gray">{results.length} result{results.length !== 1 ? 's' : ''}</p>
          {results.map((article) => (
            <WorkCard key={article.slug} articleId={article.id} {...article} />
          ))}
        </div>
      )}

      {/* Empty state — search with no results */}
      {!loading && searched && !error && results.length === 0 && (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-alt">
            <Search className="h-5 w-5 text-fog-gray" strokeWidth={1.5} />
          </div>
          <p className="text-[14px] text-fog-gray">No matches for &ldquo;{query}&rdquo;</p>
          <p className="text-[12px] text-ash mt-1">Try different terms or browse fields.</p>
          <div className="mt-4 flex justify-center gap-2">
            {FEATURED_TAGS.map((tag) => (
              <Link
                key={tag.slug}
                href={`/category/${tag.slug}`}
                className="rounded-full border border-hairline px-3 py-1 text-[12px] text-graphite hover:bg-surface-alt transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Pre-search — featured content */}
      {!searched && !loading && (
        <div className="py-8">
          <div className="text-center mb-8">
            <p className="text-[14px] text-fog-gray">Search works, artists, fields, and process notes.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="kard p-4">
              <h3 className="text-[13px] font-semibold text-text-primary mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-reactor-green" strokeWidth={1.5} />
                Trending Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {FEATURED_TAGS.map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/category/${tag.slug}`}
                    className="rounded-full border border-hairline px-3 py-1 text-[12px] text-graphite hover:bg-surface-alt hover:border-reactor-green/30 transition-colors"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="kard p-4">
              <h3 className="text-[13px] font-semibold text-text-primary mb-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-voltage-pink" strokeWidth={1.5} />
                Featured Artists
              </h3>
              <p className="text-[12px] text-fog-gray">
                <Link href="/artist/sarah" className="text-text-primary hover:text-reactor-green transition-colors">Sarah Chen</Link>,&nbsp;
                <Link href="/artist/marcus" className="text-text-primary hover:text-reactor-green transition-colors">Marcus Reyes</Link>,&nbsp;
                <Link href="/artist/tala" className="text-text-primary hover:text-reactor-green transition-colors">Tala Santos</Link>,&nbsp;
                <Link href="/artist/leo" className="text-text-primary hover:text-reactor-green transition-colors">Leo Mercado</Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}
