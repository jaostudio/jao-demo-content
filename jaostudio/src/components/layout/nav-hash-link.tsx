'use client'

import { usePathname } from 'next/navigation'
import { scrollToHash, updateUrlHash } from '@/lib/scroll-to-hash'
import type { ReactNode, MouseEvent } from 'react'

interface NavHashLinkProps {
  href: string
  className?: string
  children: ReactNode
  onActivate?: () => void
  scrollDelay?: number
}

export function NavHashLink({ href, className, children, onActivate, scrollDelay = 0 }: NavHashLinkProps) {
  const pathname = usePathname()
  const isSamePage = pathname === '/' || pathname === '/tl'

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!isSamePage) {
      // Cross-page: let Next.js/browser handle navigation.
      // The navbar's pathname useEffect calls scrollToHash(hash) on mount.
      onActivate?.()
      return
    }
    e.preventDefault()
    onActivate?.()
    updateUrlHash(href)
    if (scrollDelay > 0) {
      setTimeout(() => scrollToHash(href), scrollDelay)
    } else {
      scrollToHash(href)
    }
  }

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}
