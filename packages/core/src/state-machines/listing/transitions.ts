import { listingMachineConfig } from './machine'
import type { ListingState, ListingEvent, ListingContext } from './types'

export function transitionListing(
  state: ListingState,
  event: ListingEvent,
  context: ListingContext
): ListingState {
  if (event === 'submit' && !(context.actor === 'vendor' || context.actor === 'system')) return state
  if (event === 'submit' && !context.hasRequiredFields) return state
  if (event === 'approve' && !(context.actor === 'admin' || context.actor === 'system')) return state
  if (event === 'approve' && !context.isVerifiedVendor) return state
  if (event === 'reject' && !(context.actor === 'admin' || context.actor === 'system')) return state
  if (event === 'sell' && context.actor !== 'system') return state
  if (event === 'archive' && context.actor === 'buyer') return state
  if (event === 'republish' && context.actor !== 'vendor') return state
  const next = listingMachineConfig.states[state]?.on[event] ?? null
  return next ?? state
}
