export { createMachine } from './factory'
export type { MachineConfig } from './factory'

export type { Actor, Role, ActorContext } from './actor'

// Order — split into payment + fulfillment sub-domains
export type {
  PaymentState,
  PaymentEvent,
  FulfillmentState,
  FulfillmentEvent,
  OrderStatus,
  OrderContext,
} from './order'
export { paymentMachine, fulfillmentMachine, transitionPayment, transitionFulfillment } from './order'

// Listing
export type { ListingState, ListingEvent, ListingContext } from './listing'
export { listingMachine, transitionListing } from './listing'

// Content
export type { ContentState, ContentEvent, ContentContext } from './content'
export { contentMachine, transitionContent } from './content'

// Booking
export type { BookingState, BookingEvent, BookingContext } from './booking'
export { bookingMachine, transitionBooking } from './booking'
