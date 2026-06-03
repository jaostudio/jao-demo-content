export type TransitionType = 'theme'

export interface ThemePayload {
  origin: { x: number; y: number }
  commit: () => void
}

export interface TransitionRequest {
  type: TransitionType
  payload: ThemePayload
}

export interface TransitionContext {
  run: (req: TransitionRequest) => Promise<void>
  cancel: () => void
  isRunning: boolean
}
