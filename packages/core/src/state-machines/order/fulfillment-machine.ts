import { createMachine, type MachineConfig } from '../factory'
import type { FulfillmentState, FulfillmentEvent } from './types'

export const fulfillmentMachineConfig: MachineConfig<FulfillmentState, FulfillmentEvent> = {
  initial: 'unfulfilled',
  states: {
    unfulfilled: { on: { process: 'processing' } },
    processing: { on: { ship: 'fulfilled' } },
    fulfilled: { on: { return_fulfillment: 'returned' } },
    returned: { on: {} },
  },
}

export const fulfillmentMachine = createMachine(fulfillmentMachineConfig)
