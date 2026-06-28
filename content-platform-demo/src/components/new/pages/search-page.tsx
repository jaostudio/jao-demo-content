'use client'

import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { AppShell } from '../layout/app-shell'
import { WorkCard } from '../work/work-card'
import { Search } from 'lucide-react'

interface SearchResult {
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

export function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = useCallback(async (q: string) => {
    if (!q.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`)
      if (res.ok) {
        const data = await res.json()
        setResults(data.articles || [])
      }
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Auto-search on mount if URL has query
  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery)
    }
  }, [initialQuery, handleSearch])

  return (
    <AppShell>
      <div className="mb-6 max-w-[520px]">
        <h1 className="text-[17px] font-semibold text-text-primary mb-3">Search</h1>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-fog-gray" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
            placeholder="Search works..."
            className="input h-11 w-full pl-11 pr-4 text-[14px]"
            autoFocus
          />
        </div>
      </div>

      {loading && (
        <div className="py-8 text-center">
          <p className="text-[13px] text-fog-gray">Searching...</p>
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-[14px] text-fog-gray">No results for &ldquo;{query}&rdquo;</p>
          <p className="text-[12px] text-ash mt-1">Try different search terms</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-4">
          <p className="text-[12px] text-fog-gray">{results.length} result{results.length !== 1 ? 's' : ''}</p>
          {results.map((article) => (
            <WorkCard key={article.slug} {...article} />
          ))}
        </div>
      )}

      {!searched && !loading && (
        <div className="py-16 text-center">
          <p className="text-[14px] text-fog-gray">Type something to search</p>
          <p className="text-[12px] text-ash mt-1">Works, authors, topics</p>
        </div>
      )}
    </AppShell>
  )
}
