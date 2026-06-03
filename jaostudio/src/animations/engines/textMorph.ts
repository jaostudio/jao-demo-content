const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

function randomChar(): string {
  return CHARS[Math.floor(Math.random() * CHARS.length)]
}

function getReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function runTextMorph(
  payload: { fromText: string; toText: string; selector: string; frames?: number },
  signal: AbortSignal,
): Promise<void> {
  if (getReducedMotion()) {
    return Promise.resolve()
  }

  return new Promise<void>((resolve) => {
    const el = document.querySelector(payload.selector) as HTMLElement | null
    if (!el) return resolve()

    const frames = payload.frames ?? 18
    let frame = 0

    const tick = () => {
      if (signal.aborted) return resolve()

      const progress = frame / frames

      if (progress < 0.6) {
        el.textContent = payload.fromText
          .split('')
          .map(() => randomChar())
          .join('')
      } else {
        el.textContent = payload.toText
      }

      frame++

      if (frame >= frames) return resolve()

      requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  })
}
