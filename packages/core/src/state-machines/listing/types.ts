import type { ActorContext } from '../actor'

export type ListingState = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'sold' | 'archived'
export type ListingEvent = 'submit' | 'approve' | 'reject' | 'sell' | 'archive' | 'republish'

export interface ListingContext extends ActorContext {
  hasRequiredFields: boolean
  isVerifiedVendor: boolean
}
