import { contentMachineConfig } from './machine'
import type { ContentState, ContentEvent, ContentContext } from './types'

export function transitionContent(
  state: ContentState,
  event: ContentEvent,
  context: ContentContext
): ContentState {
  if (event === 'submit' && context.actor !== 'author') return state
  if (event === 'approve' && !(context.actor === 'admin' || context.actor === 'system')) return state
  if (event === 'reject' && !(context.actor === 'admin' || context.actor === 'system')) return state
  if (event === 'publish' && !(context.actor === 'admin' || context.actor === 'system')) return state
  if (event === 'publish' && !context.isReviewed) return 'pending_review'
  if (event === 'approve' && !context.isReviewed) return state
  if (event === 'archive' && !(context.actor === 'admin' || context.actor === 'system')) return state
  if (event === 'schedule' && !(context.actor === 'admin' || context.actor === 'system')) return state
  if (event === 'unpublish' && !(context.actor === 'admin' || context.actor === 'system')) return state
  const next = contentMachineConfig.states[state]?.on[event] ?? null
  return next ?? state
}
