'use client'

import Link from 'next/link'
import { Avatar } from '@/components/new/ui/avatar'
import { Marquee } from '@/components/new/motion/marquee'

interface FeaturedArtistsRailProps {
  artists: { id: string; name: string }[]
}

export function FeaturedArtistsRail({ artists }: FeaturedArtistsRailProps) {
  if (artists.length === 0) return null

  return (
    <section className="mb-8">
      <h2 className="text-[13px] font-semibold text-text-primary mb-3 uppercase tracking-wider">Featured Artists</h2>
      <Marquee pauseOnHover>
        <div className="flex gap-3">
          {[...artists, ...artists, ...artists].map((artist, i) => (
            <Link
              key={`${artist.id}-${i}`}
              href={`/artist/${artist.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="flex shrink-0 items-center gap-2 rounded-lg border border-hairline bg-card px-3 py-2 hover:bg-surface-alt hover:border-reactor-green/30 transition-all"
            >
              <Avatar name={artist.name} size="sm" />
              <span className="text-[13px] font-medium text-text-primary whitespace-nowrap">{artist.name}</span>
            </Link>
          ))}
        </div>
      </Marquee>
    </section>
  )
}
