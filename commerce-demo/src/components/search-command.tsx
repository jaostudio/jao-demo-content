'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, Loader2, Package } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type SearchResult = {
  slug: string
  nameTl: string
  nameEn: string
  price: number
  image: string
}

export function SearchCommand() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (open) {
      setQuery('')
      setResults([])
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/products/search?q=${encodeURIComponent(q.trim())}`)
      if (res.ok) {
        const data = await res.json()
        setResults(data.products ?? [])
      }
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(query), 250)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, doSearch])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      setOpen(false)
      router.push(`/products/${results[selectedIndex].slug}`)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-lg rounded-xl border border-subtle bg-page-bg shadow-2xl dark:border-subtle dark:bg-surface">
        <div className="flex items-center border-b border-subtle px-4 dark:border-subtle">
          <Search className="h-4 w-4 shrink-0 text-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0) }}
            onKeyDown={handleKeyDown}
            placeholder="Maghanap ng tinda..."
            className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted"
          />
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted" />}
          <button onClick={() => setOpen(false)} className="ml-2 rounded-md p-1 text-muted hover:text-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {results.length > 0 ? (
            <div className="space-y-1">
              {results.map((product, idx) => (
                <Link
                  key={product.slug}
                  href={`/products/${product.slug}`}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    idx === selectedIndex ? 'bg-surface text-foreground' : 'text-muted hover:bg-surface dark:hover:bg-surface'
                  }`}
                >
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-subtle dark:border-subtle">
                    <img src={product.image} alt={product.nameTl} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{product.nameTl}</p>
                    <p className="truncate text-xs text-muted">{product.nameEn}</p>
                  </div>
                  <p className="shrink-0 text-xs font-semibold text-muted">₱{(product.price / 100).toFixed(2)}</p>
                </Link>
              ))}
            </div>
          ) : query.trim() && !loading ? (
            <div className="flex flex-col items-center py-8 text-muted">
              <Package className="h-8 w-8" />
              <p className="mt-2 text-sm">Walang nahanap na tinda</p>
            </div>
          ) : !query.trim() ? (
            <div className="py-6 text-center text-xs text-muted">
              Mag-type para maghanap ng produkto
            </div>
          ) : null}
        </div>

        <div className="border-t border-subtle px-4 py-2 text-[10px] text-muted dark:border-subtle">
          <kbd className="rounded border border-subtle px-1 py-0.5 font-mono text-[10px] dark:border-subtle">↑↓</kbd> navigate{' '}
          <kbd className="rounded border border-subtle px-1 py-0.5 font-mono text-[10px] dark:border-subtle">Enter</kbd> open{' '}
          <kbd className="rounded border border-subtle px-1 py-0.5 font-mono text-[10px] dark:border-subtle">Esc</kbd> close
        </div>
      </div>
    </div>
  )
}
