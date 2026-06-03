'use client'

import Link from 'next/link'
import { trackProjectClick } from '@/lib/analytics'

export function ProjectCardLink({ slug, children }: { slug: string; children: React.ReactNode }) {
  return (
    <Link
      href={`/projects/${slug}`}
      onClick={() => trackProjectClick(slug, 'projects_listing')}
      data-project-card={slug}
    >
      {children}
    </Link>
  )
}
