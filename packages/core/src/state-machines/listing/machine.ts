import { createMachine, type MachineConfig } from '../factory'
import type { ListingState, ListingEvent } from './types'

export const listingMachineConfig: MachineConfig<ListingState, ListingEvent> = {
  initial: 'draft',
  states: {
    draft: { on: { submit: 'pending_review' } },
    pending_review: { on: { approve: 'approved', reject: 'rejected' } },
    approved: { on: { sell: 'sold', archive: 'archived' } },
    rejected: { on: { archive: 'archived', submit: 'pending_review' } },
    sold: { on: {} },
    archived: { on: { republish: 'pending_review' } },
  },
}

export const listingMachine = createMachine(listingMachineConfig)
