import { createMachine, type MachineConfig } from '../factory'
import type { PaymentState, PaymentEvent } from './types'

export const paymentMachineConfig: MachineConfig<PaymentState, PaymentEvent> = {
  initial: 'pending_payment',
  states: {
    pending_payment: { on: { confirm_payment: 'paid' } },
    paid: { on: { refund_payment: 'refunded' } },
    refunded: { on: {} },
  },
}

export const paymentMachine = createMachine(paymentMachineConfig)
