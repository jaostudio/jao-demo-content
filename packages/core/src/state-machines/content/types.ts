import type { ActorContext } from '../actor'

export type ContentState = 'draft' | 'pending_review' | 'published' | 'archived'
export type ContentEvent = 'submit' | 'approve' | 'publish' | 'reject' | 'archive' | 'schedule' | 'unpublish'

export interface ContentContext extends ActorContext {
  hasRequiredSections: boolean
  isReviewed: boolean
}
