import { runThemeRipple } from '../engines/themeRipple'
import type { TransitionRequest, TransitionContext } from './types'

let activeController: AbortController | null = null
let _isRunning = false

async function runTransition(req: TransitionRequest): Promise<void> {
  if (_isRunning) return

  if (activeController) {
    activeController.abort()
    activeController = null
  }

  const controller = new AbortController()
  activeController = controller
  _isRunning = true

  try {
    const p = req.payload as { origin: { x: number; y: number }; commit: () => void }
    await runThemeRipple(p.origin, controller.signal)
    p.commit()
  } finally {
    activeController = null
    _isRunning = false
  }
}

function cancelTransition() {
  activeController?.abort()
  activeController = null
  _isRunning = false
}

export function createTransitionContext(): TransitionContext {
  return {
    run: runTransition,
    cancel: cancelTransition,
    get isRunning() {
      return _isRunning
    },
  }
}
