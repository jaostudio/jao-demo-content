const STORAGE_KEY = 'jao:locale-transition'
const EXIT_TIMEOUT = 320

export function runExitAnimation(el: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    el.classList.add('locale-exit')

    const done = () => {
      el.removeEventListener('transitionend', onEnd)
      resolve()
    }

    const onEnd = (e: TransitionEvent) => {
      if (e.propertyName !== 'opacity') return
      done()
    }

    el.addEventListener('transitionend', onEnd, { once: true })
    setTimeout(done, EXIT_TIMEOUT)
  })
}

export function markPendingEntry(): void {
  sessionStorage.setItem(STORAGE_KEY, '1')
}

export function shouldRunEntry(): boolean {
  return sessionStorage.getItem(STORAGE_KEY) === '1'
}

export function clearPendingEntry(): void {
  sessionStorage.removeItem(STORAGE_KEY)
}
