import { createMachine, type MachineConfig } from '../factory'
import type { ContentState, ContentEvent } from './types'

export const contentMachineConfig: MachineConfig<ContentState, ContentEvent> = {
  initial: 'draft',
  states: {
    draft: { on: { submit: 'pending_review' } },
    pending_review: {
      on: { approve: 'published', publish: 'published', reject: 'draft' },
    },
    published: { on: { archive: 'archived', unpublish: 'draft' } },
    archived: { on: { schedule: 'pending_review' } },
  },
}

export const contentMachine = createMachine(contentMachineConfig)
