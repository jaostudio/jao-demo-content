import type { PlatformEvent } from './types'

type EventHandler = (event: PlatformEvent) => void

const handlers = new Set<EventHandler>()

export function onEvent(handler: EventHandler): () => void {
  handlers.add(handler)
  return () => { handlers.delete(handler) }
}

export function dispatch(event: PlatformEvent): void {
  handlers.forEach((h) => h(event))
}
