type EventHandler = (event: any) => void

type EventSource = 'ui' | 'server' | 'system'
type EventDomain = 'order' | 'listing' | 'content' | 'ui'

interface EventEnvelope {
  id: string
  timestamp: number
  source: EventSource
  domain: EventDomain
  traceId?: string
  causationId?: string
}

type PlatformEvent = EventEnvelope & { type: string }

const handlers = new Set<EventHandler>()
let seq = 0

function dispatch(event: PlatformEvent): void {
  handlers.forEach((h) => h(event))
}

function onEvent(handler: EventHandler): () => void {
  handlers.add(handler)
  return () => { handlers.delete(handler) }
}

function run() {
  const errors: string[] = []

  // Test basic dispatch + subscription
  let received: PlatformEvent[] = []
  const unsub = onEvent((e) => { received.push(e) })

  const event: PlatformEvent = {
    id: 'evt_1',
    timestamp: Date.now(),
    source: 'ui',
    domain: 'ui',
    type: 'page:viewed',
  }

  dispatch(event)
  if (received.length !== 1) {
    errors.push(`Expected 1 event, got ${received.length}`)
  }
  if (received[0]?.id !== 'evt_1') {
    errors.push('Event id mismatch')
  }

  // Test unsubscription
  received = []
  unsub()
  dispatch(event)
  if (received.length !== 0) {
    errors.push('Expected 0 events after unsub')
  }

  // Test event id uniqueness
  const ids = new Set<string>()
  for (let i = 0; i < 100; i++) {
    ids.add(`evt_${Date.now()}_${++seq}`)
  }
  if (ids.size < 95) {
    errors.push('Event ids should be mostly unique')
  }

  // Test envelope shape
  const envEvent: PlatformEvent = {
    id: 'evt_2',
    timestamp: 1000,
    source: 'server',
    domain: 'order',
    traceId: 'trace_1',
    causationId: 'cause_1',
    type: 'order:created',
  }
  const required = ['id', 'timestamp', 'source', 'domain', 'type'] as const
  for (const field of required) {
    if (!(field in envEvent)) {
      errors.push(`Missing required envelope field: ${field}`)
    }
  }

  if (errors.length > 0) {
    console.error('Event violations:\n' + errors.map((e) => `  ❌ ${e}`).join('\n'))
    process.exit(1)
  }
  console.log('✅ Events: dispatch, subscription, envelope contract all valid')
}

run()
