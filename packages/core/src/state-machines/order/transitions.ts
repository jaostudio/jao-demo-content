import { paymentMachineConfig } from './payment-machine'
import { fulfillmentMachineConfig } from './fulfillment-machine'
import type { PaymentState, PaymentEvent, FulfillmentState, FulfillmentEvent, OrderContext } from './types'

export function transitionPayment(
  state: PaymentState,
  event: PaymentEvent,
  context: OrderContext
): PaymentState {
  if (event === 'confirm_payment' && context.total <= 0) return state
  if (event === 'confirm_payment' && context.actor === 'vendor') return state
  if (event === 'refund_payment' && !(context.actor === 'admin' || context.actor === 'system')) return state
  const next = paymentMachineConfig.states[state]?.on[event] ?? null
  return next ?? state
}

export function transitionFulfillment(
  state: FulfillmentState,
  event: FulfillmentEvent,
  context: OrderContext
): FulfillmentState {
  if (event === 'process' && context.actor === 'buyer') return state
  if (event === 'ship' && state !== 'processing') return state
  if (event === 'ship' && context.actor === 'buyer') return state
  if (event === 'return_fulfillment' && context.actor === 'vendor') return state
  const next = fulfillmentMachineConfig.states[state]?.on[event] ?? null
  return next ?? state
}
