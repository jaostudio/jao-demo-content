'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/cn'

interface ScreenshotPreviewProps {
  src: string
  alt: string
  className?: string
}

export function ScreenshotPreview({ src, alt, className }: ScreenshotPreviewProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div className={cn('relative overflow-hidden rounded-xl border border-border bg-bg-surface', className)}>
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-red-500/60" />
        <div className="h-3 w-3 rounded-full bg-amber-500/60" />
        <div className="h-3 w-3 rounded-full bg-emerald-500/60" />
        <div className="ml-3 flex-1 rounded-md bg-surface-hover px-3 py-1.5">
          <p className="truncate text-center text-xs text-text-tertiary">{alt}</p>
        </div>
      </div>
      <div className="relative aspect-[16/10] bg-bg-surface">
        {!error && (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            loading="lazy"
            className={cn(
              'object-cover object-top transition-opacity duration-500',
              loaded ? 'opacity-100' : 'opacity-0',
            )}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        )}
        {error && (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
            <p className="text-sm font-medium text-text-primary">{alt}</p>
          </div>
        )}
        {!loaded && !error && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.03)] to-transparent" />
        )}
      </div>
    </div>
  )
}
