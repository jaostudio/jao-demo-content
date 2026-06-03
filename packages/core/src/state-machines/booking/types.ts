import type { ActorContext } from '../actor'

export type BookingState = 'pending' | 'confirmed' | 'cancelled'
export type BookingEvent = 'confirm' | 'cancel'

export interface BookingContext extends ActorContext {
  date: Date
}
