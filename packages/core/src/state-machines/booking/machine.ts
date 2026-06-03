import { createMachine, type MachineConfig } from '../factory'
import type { BookingState, BookingEvent } from './types'

export const bookingMachineConfig: MachineConfig<BookingState, BookingEvent> = {
  initial: 'pending',
  states: {
    pending: { on: { confirm: 'confirmed', cancel: 'cancelled' } },
    confirmed: { on: { cancel: 'cancelled' } },
    cancelled: { on: {} },
  },
}

export const bookingMachine = createMachine(bookingMachineConfig)
