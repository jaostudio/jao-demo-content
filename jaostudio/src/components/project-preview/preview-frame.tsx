'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/cn'

interface PreviewFrameProps {
  url: string
  title: string
  className?: string
}

export function PreviewFrame({ url, title, className }: PreviewFrameProps) {
  const [activated, setActivated] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleLoad = useCallback(() => {
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (activated) return
    if (typeof IntersectionObserver === 'undefined') {
      setActivated(true)
      return
    }
    const node = containerRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setActivated(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [activated])

  if (error) {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-bg-surface p-8', className)} style={{ minHeight: '16rem' }}>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface-hover">
          <span className="text-lg text-text-tertiary">!</span>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-text-primary">Preview unavailable</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-xs text-text-tertiary transition-colors hover:text-text-primary"
          >
            Open Live Site →
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden rounded-xl border border-border bg-bg-surface', className)}>
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-red-500/60" />
        <div className="h-3 w-3 rounded-full bg-amber-500/60" />
        <div className="h-3 w-3 rounded-full bg-emerald-500/60" />
        <div className="ml-3 flex-1 rounded-md bg-surface-hover px-3 py-1.5">
          <p className="truncate text-center text-[10px] text-text-tertiary">{url}</p>
        </div>
      </div>
      <div ref={containerRef} className="relative" style={{ aspectRatio: '16 / 10' }}>
        {activated ? (
          <iframe
            ref={iframeRef}
            src={url}
            title={title}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
            className="h-full w-full"
            style={{ border: 'none' }}
            onLoad={handleLoad}
            onError={() => setError(true)}
          />
        ) : (
          <div className="h-full w-full" aria-hidden="true" />
        )}
        {!loaded && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-bg-surface">
            <div className="animate-pulse text-[var(--text-meta)] text-text-tertiary">Loading preview...</div>
          </div>
        )}
      </div>
    </div>
  )
}
