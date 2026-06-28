import Link from 'next/link'
import { Avatar } from '@/components/new/ui/avatar'

interface FeaturedArtistsRailProps {
  artists: { id: string; name: string }[]
}

export function FeaturedArtistsRail({ artists }: FeaturedArtistsRailProps) {
  if (artists.length === 0) return null

  return (
    <section className="mb-8">
      <h2 className="text-[13px] font-semibold text-text-primary mb-3 uppercase tracking-wider">Featured Artists</h2>
      <div className="flex flex-wrap gap-3">
        {artists.map((artist) => (
          <Link
            key={artist.id}
            href={`/artist/${artist.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="flex items-center gap-2 rounded-lg border border-hairline bg-card px-3 py-2 hover:bg-surface-alt transition-colors"
          >
            <Avatar name={artist.name} size="sm" />
            <span className="text-[13px] font-medium text-text-primary">{artist.name}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
