type MachineConfig<S extends string, E extends string> = {
  initial: S
  states: Record<S, { on: Partial<Record<E, S>> }>
}

function testMachine<S extends string, E extends string>(
  name: string,
  config: MachineConfig<S, E>,
  validCases: Array<{ from: S; event: E; to: S }>,
  invalidCases: Array<{ from: S; event: E }>,
): string[] {
  const errors: string[] = []

  for (const { from, event, to } of validCases) {
    const machine = createMachine({ ...config, initial: from })
    const result = machine.transition(event)
    if (result !== to) {
      errors.push(`[${name}] ${from} + ${event}: expected ${to}, got ${result ?? 'null'}`)
    }
  }

  for (const { from, event } of invalidCases) {
    const machine = createMachine({ ...config, initial: from })
    const result = machine.transition(event)
    if (result !== null) {
      errors.push(`[${name}] ${from} + ${event}: expected null (invalid), got ${result}`)
    }
  }

  return errors
}

function createMachine<S extends string, E extends string>(config: MachineConfig<S, E>) {
  let current: S = config.initial
  return {
    transition(event: E) {
      const next = config.states[current].on[event]
      if (!next) return null
      current = next
      return current
    },
  }
}

function run() {
  const errors: string[] = []

  // ── Payment machine ──
  errors.push(...testMachine(
    'payment',
    {
      initial: 'pending_payment',
      states: {
        pending_payment: { on: { confirm_payment: 'paid' } },
        paid: { on: { refund_payment: 'refunded' } },
        refunded: { on: {} },
      },
    },
    [
      { from: 'pending_payment', event: 'confirm_payment', to: 'paid' },
      { from: 'paid', event: 'refund_payment', to: 'refunded' },
    ],
    [
      { from: 'pending_payment', event: 'refund_payment' },
      { from: 'paid', event: 'confirm_payment' },
      { from: 'refunded', event: 'confirm_payment' },
      { from: 'refunded', event: 'refund_payment' },
    ],
  ) as any)

  // ── Fulfillment machine ──
  errors.push(...testMachine(
    'fulfillment',
    {
      initial: 'unfulfilled',
      states: {
        unfulfilled: { on: { process: 'processing' } },
        processing: { on: { ship: 'fulfilled' } },
        fulfilled: { on: { return_fulfillment: 'returned' } },
        returned: { on: {} },
      },
    },
    [
      { from: 'unfulfilled', event: 'process', to: 'processing' },
      { from: 'processing', event: 'ship', to: 'fulfilled' },
      { from: 'fulfilled', event: 'return_fulfillment', to: 'returned' },
    ],
    [
      { from: 'unfulfilled', event: 'ship' },
      { from: 'unfulfilled', event: 'return_fulfillment' },
      { from: 'processing', event: 'process' },
      { from: 'fulfilled', event: 'ship' },
      { from: 'returned', event: 'return_fulfillment' },
    ],
  ) as any)

  // ── Listing machine ──
  errors.push(...testMachine(
    'listing',
    {
      initial: 'draft',
      states: {
        draft: { on: { submit: 'pending_review' } },
        pending_review: { on: { approve: 'approved', reject: 'rejected' } },
        approved: { on: { sell: 'sold', archive: 'archived' } },
        rejected: { on: { archive: 'archived', submit: 'pending_review' } },
        sold: { on: {} },
        archived: { on: { republish: 'pending_review' } },
      },
    },
    [
      { from: 'draft', event: 'submit', to: 'pending_review' },
      { from: 'pending_review', event: 'approve', to: 'approved' },
      { from: 'pending_review', event: 'reject', to: 'rejected' },
      { from: 'approved', event: 'sell', to: 'sold' },
      { from: 'approved', event: 'archive', to: 'archived' },
      { from: 'rejected', event: 'submit', to: 'pending_review' },
      { from: 'rejected', event: 'archive', to: 'archived' },
      { from: 'archived', event: 'republish', to: 'pending_review' },
    ],
    [
      { from: 'draft', event: 'sell' },
      { from: 'draft', event: 'approve' },
      { from: 'approved', event: 'submit' },
      { from: 'sold', event: 'archive' },
      { from: 'sold', event: 'sell' },
    ],
  ) as any)

  // ── Content machine ──
  errors.push(...testMachine(
    'content',
    {
      initial: 'draft',
      states: {
        draft: { on: { submit: 'pending_review' } },
        pending_review: { on: { approve: 'published', publish: 'published', reject: 'draft' } },
        published: { on: { archive: 'archived', unpublish: 'draft' } },
        archived: { on: { schedule: 'pending_review' } },
      },
    },
    [
      { from: 'draft', event: 'submit', to: 'pending_review' },
      { from: 'pending_review', event: 'approve', to: 'published' },
      { from: 'pending_review', event: 'publish', to: 'published' },
      { from: 'pending_review', event: 'reject', to: 'draft' },
      { from: 'published', event: 'archive', to: 'archived' },
      { from: 'published', event: 'unpublish', to: 'draft' },
      { from: 'archived', event: 'schedule', to: 'pending_review' },
    ],
    [
      { from: 'draft', event: 'publish' },
      { from: 'draft', event: 'archive' },
      { from: 'published', event: 'submit' },
      { from: 'archived', event: 'archive' },
    ],
  ) as any)

  if (errors.length > 0) {
    console.error('State machine violations:\n' + errors.map((e) => `  ❌ ${e}`).join('\n'))
    process.exit(1)
  }
  console.log('✅ State machines: all transitions correct')
}

run()
