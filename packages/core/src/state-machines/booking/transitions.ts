import { bookingMachineConfig } from './machine'
import type { BookingState, BookingEvent, BookingContext } from './types'

export function transitionBooking(
  state: BookingState,
  event: BookingEvent,
  context: BookingContext
): BookingState {
  if (event === 'confirm' && context.actor === 'buyer') return state
  const next = bookingMachineConfig.states[state]?.on[event] ?? null
  return next ?? state
}
