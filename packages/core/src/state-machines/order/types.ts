import type { ActorContext } from '../actor'

export type PaymentState = 'pending_payment' | 'paid' | 'refunded'
export type PaymentEvent = 'confirm_payment' | 'refund_payment'

export type FulfillmentState = 'unfulfilled' | 'processing' | 'fulfilled' | 'returned'
export type FulfillmentEvent = 'process' | 'ship' | 'return_fulfillment'

export type OrderStatus = 'draft' | 'active' | 'closed'

export interface OrderContext extends ActorContext {
  total: number
  items: number
}
