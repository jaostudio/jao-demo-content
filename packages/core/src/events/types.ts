export type EventSource = 'ui' | 'server' | 'system'
export type EventDomain = 'order' | 'listing' | 'content' | 'booking' | 'ui'

interface EventEnvelope {
  id: string
  timestamp: number
  source: EventSource
  domain: EventDomain
  traceId?: string
  causationId?: string
}

export type PageViewed = EventEnvelope & {
  type: 'page:viewed'
  pathname: string
  search?: string
}

export type SectionRendered = EventEnvelope & {
  type: 'section:rendered'
  sectionType: string
  index: number
}

export type ActionClicked = EventEnvelope & {
  type: 'action:clicked'
  label: string
  href?: string
}

export type OrderCreated = EventEnvelope & {
  type: 'order:created'
  orderId: string
  total: number
  currency: string
}

export type OrderTransitioned = EventEnvelope & {
  type: 'order:transitioned'
  orderId: string
  fromState: string
  toState: string
}

export type ListingViewed = EventEnvelope & {
  type: 'listing:viewed'
  listingId: string
  vendorId: string
}

export type ListingTransitioned = EventEnvelope & {
  type: 'listing:transitioned'
  listingId: string
  fromState: string
  toState: string
}

export type ContentTransitioned = EventEnvelope & {
  type: 'content:transitioned'
  contentId: string
  fromState: string
  toState: string
}

export type BookingTransitioned = EventEnvelope & {
  type: 'booking:transitioned'
  bookingId: string
  fromState: string
  toState: string
}

export type PlatformEvent =
  | PageViewed
  | SectionRendered
  | ActionClicked
  | OrderCreated
  | OrderTransitioned
  | ListingViewed
  | ListingTransitioned
  | ContentTransitioned
  | BookingTransitioned
