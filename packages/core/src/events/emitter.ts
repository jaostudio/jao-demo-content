import type { EventSource, EventDomain } from './types'
import { dispatch } from './dispatch'
import type {
  PageViewed,
  SectionRendered,
  ActionClicked,
  OrderCreated,
  OrderTransitioned,
  ListingViewed,
  ListingTransitioned,
  ContentTransitioned,
  BookingTransitioned,
} from './types'

let seq = 0

function envelope(source: EventSource, domain: EventDomain, traceId?: string, causationId?: string) {
  return {
    id: `evt_${Date.now()}_${++seq}`,
    timestamp: Date.now(),
    source,
    domain,
    traceId,
    causationId,
  }
}

export const emit = {
  pageview(pathname: string, search?: string, traceId?: string, causationId?: string) {
    const event: PageViewed = {
      ...envelope('ui', 'ui', traceId, causationId),
      type: 'page:viewed',
      pathname,
      search,
    }
    dispatch(event)
  },

  sectionRendered(sectionType: string, index: number, traceId?: string, causationId?: string) {
    const event: SectionRendered = {
      ...envelope('ui', 'ui', traceId, causationId),
      type: 'section:rendered',
      sectionType,
      index,
    }
    dispatch(event)
  },

  actionClicked(label: string, href?: string, traceId?: string, causationId?: string) {
    const event: ActionClicked = {
      ...envelope('ui', 'ui', traceId, causationId),
      type: 'action:clicked',
      label,
      href,
    }
    dispatch(event)
  },

  orderCreated(orderId: string, total: number, currency: string, traceId?: string, causationId?: string) {
    const event: OrderCreated = {
      ...envelope('system', 'order', traceId, causationId),
      type: 'order:created',
      orderId,
      total,
      currency,
    }
    dispatch(event)
  },

  orderTransitioned(orderId: string, fromState: string, toState: string, traceId?: string, causationId?: string) {
    const event: OrderTransitioned = {
      ...envelope('system', 'order', traceId, causationId),
      type: 'order:transitioned',
      orderId,
      fromState,
      toState,
    }
    dispatch(event)
  },

  listingViewed(listingId: string, vendorId: string, traceId?: string, causationId?: string) {
    const event: ListingViewed = {
      ...envelope('ui', 'listing', traceId, causationId),
      type: 'listing:viewed',
      listingId,
      vendorId,
    }
    dispatch(event)
  },

  listingTransitioned(listingId: string, fromState: string, toState: string, traceId?: string, causationId?: string) {
    const event: ListingTransitioned = {
      ...envelope('system', 'listing', traceId, causationId),
      type: 'listing:transitioned',
      listingId,
      fromState,
      toState,
    }
    dispatch(event)
  },

  contentTransitioned(contentId: string, fromState: string, toState: string, traceId?: string, causationId?: string) {
    const event: ContentTransitioned = {
      ...envelope('system', 'content', traceId, causationId),
      type: 'content:transitioned',
      contentId,
      fromState,
      toState,
    }
    dispatch(event)
  },

  bookingTransitioned(bookingId: string, fromState: string, toState: string, traceId?: string, causationId?: string) {
    const event: BookingTransitioned = {
      ...envelope('system', 'booking', traceId, causationId),
      type: 'booking:transitioned',
      bookingId,
      fromState,
      toState,
    }
    dispatch(event)
  },
}
