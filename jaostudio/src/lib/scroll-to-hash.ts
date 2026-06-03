let _retryCount = 0

export function scrollToHash(hash: string) {
  const id = hash.includes('#') ? hash.split('#').at(-1) : hash
  if (!id) return
  const el = document.getElementById(id)
  if (!el) return

  const lenis = (window as unknown as Record<string, unknown>).__lenis

  if (lenis && typeof (lenis as { scrollTo: unknown }).scrollTo === 'function') {
    _retryCount = 0
    ;(lenis as { scrollTo: (target: Element, opts: Record<string, unknown>) => void }).scrollTo(el, {
      duration: 1.2,
    })
    return
  }

  if (_retryCount < 10) {
    _retryCount++
    setTimeout(() => scrollToHash(hash), 200)
    return
  }

  _retryCount = 0
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
}

/**
 * Update the URL to include a hash fragment without triggering Next.js
 * navigation. The current history entry is replaced (not pushed), so
 * browser back goes to the prior page, not back-and-forth between
 * /page and /page#section.
 *
 * Used by same-page hash links (NavHashLink, mobile menu hash links) to
 * preserve deep-linkability. App Router state is not affected because
 * the pathname does not change.
 *
 * No-op when the new URL equals the current URL.
 */
export function updateUrlHash(href: string): void {
  if (typeof window === 'undefined') return
  const currentUrl = window.location.pathname + window.location.search + window.location.hash
  const target = href.startsWith('#') ? window.location.pathname + window.location.search + href : href
  if (currentUrl === target) return
  window.history.replaceState(window.history.state, '', target)
}
