# Bug 001: Transition functions don't reset machine state

## Summary

All four `transition*` functions (`transitionContent`, `transitionBooking`,
`transitionListing`, `transitionPayment`, `transitionFulfillment`) use a
module-level singleton machine but never reset its internal state to match the
caller-supplied `state` parameter. This means transitions based on any state
other than the machine's current internal state will produce incorrect results.

## Example

```ts
import { contentMachine } from '@jaostudio/core/state-machines/content'

// Initially the machine is at 'draft' (the configured initial state).
// First call: contentMachine.transition('submit') → 'pending_review' ✓
// contentMachine internal state is now 'pending_review'.

// Second call: contentMachine.transition('submit') from 'published'
// contentMachine internal state is 'pending_review', so:
//   'pending_review' + 'submit' → null (no transition defined)
// Expected: 'published' + 'archive' → 'archived'
// Actual: returns null because machine is at 'pending_review', not 'published'
```

## Affected Functions

| Function | File |
|---|---|
| `transitionContent` | `packages/core/src/state-machines/content/transitions.ts` |
| `transitionBooking` | `packages/core/src/state-machines/booking/transitions.ts` |
| `transitionListing` | `packages/core/src/state-machines/listing/transitions.ts` |
| `transitionPayment` | `packages/core/src/state-machines/order/transitions.ts` |
| `transitionFulfillment` | `packages/core/src/state-machines/order/transitions.ts` |

## Root Cause

The machines are created as module-level singletons:

```ts
export const contentMachine = createMachine<ContentState, ContentEvent>({...})
```

But the `transition*` function never calls `contentMachine.reset()` or
re-creates the machine with the caller's state. The machine's internal
`current` variable persists across calls.

## Impact

- **Content-platform-demo**: bypassed the shared function entirely, using a
  local transition table instead.
- **Other demos**: may produce incorrect results under concurrent access or when
  transitioning from non-sequential states.
- The existing architecture tests only test raw machine definitions, not the
  `transition*` wrapper functions, so this was never caught.

## Fix Required

Before calling `.transition(event)`, reset the machine to the caller-supplied
state:

```ts
// Before:
const next = contentMachine.transition(event)

// After:
contentMachine.reset()          // reset to initial
contentMachine.transition(state) // fast-forward to current state
const next = contentMachine.transition(event) // apply the event
```

Or, simpler: create a fresh machine per call with `initial: state`.

## Test

See `tests/architecture/bug-001-transition-state-reset.test.ts` for a
reproducing test that fails with the current code.
