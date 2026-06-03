const RIPPLE_CSS_CLASS = 'theme-ripple-overlay'

function getReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function isMobileGPU(): boolean {
  if (typeof navigator === 'undefined') return false
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

export function runThemeRipple(
  origin: { x: number; y: number },
  signal: AbortSignal,
): Promise<void> {
  if (getReducedMotion()) {
    return Promise.resolve()
  }

  return new Promise<void>((resolve) => {
    const el = document.createElement('div')
    el.className = RIPPLE_CSS_CLASS

    const isDark = document.documentElement.classList.contains('dark')
    const scaleFactor = isMobileGPU() ? 2.5 : 4
    const rippleColor = isDark ? 'rgba(255,255,255,0.88)' : 'rgba(5,5,5,0.92)'
    const peakOpacity = isDark ? '0.92' : '0.95'

    el.style.setProperty('--ripple-x', `${origin.x}px`)
    el.style.setProperty('--ripple-y', `${origin.y}px`)
    el.style.setProperty('--ripple-color', rippleColor)
    el.style.setProperty('--ripple-scale', String(scaleFactor))
    el.style.setProperty('--ripple-peak-opacity', peakOpacity)

    document.body.appendChild(el)

    const cleanup = () => {
      if (el.parentNode) el.remove()
      resolve()
    }

    signal.addEventListener('abort', cleanup, { once: true })

    requestAnimationFrame(() => {
      el.classList.add('animate')
    })

    el.addEventListener('animationend', cleanup, { once: true })
  })
}
