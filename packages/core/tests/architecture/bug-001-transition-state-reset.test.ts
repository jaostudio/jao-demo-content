/**
 * Bug 001: Transition functions don't reset machine state.
 *
 * This test reproduces the bug by calling transitionContent multiple times
 * with non-sequential states. The function should transition from whatever
 * state the caller passes, but the current implementation uses a module-level
 * singleton machine without resetting, so transitions fail after the first call.
 *
 * Expected: all assertions pass
 * Actual:   second assertion fails because machine state is stale
 */

import { transitionContent } from '../../src/state-machines/content/transitions'
import type { ContentContext } from '../../src/state-machines/content/types'

const errors: string[] = []

// Author context — can submit articles
const authorCtx: ContentContext = {
  id: 'author-1',
  role: 'author',
  actor: 'author',
  hasRequiredSections: true,
  isReviewed: false,
}

// Admin context — can approve/reject/archive
const adminCtx: ContentContext = {
  id: 'admin-1',
  role: 'admin',
  actor: 'admin',
  hasRequiredSections: true,
  isReviewed: true,
}

// Call 1: draft + submit = pending_review (via author)
const r1 = transitionContent('draft', 'submit', authorCtx)
if (r1 !== 'pending_review') {
  errors.push(`Call 1: 'draft' + 'submit': expected 'pending_review', got '${r1}'`)
}

// Call 2: pending_review + approve = published (via admin)
// Bug: machine state is 'pending_review' from call 1's internal mutation.
//      This call happens to work because the internal state matches.
//      The bug manifests when states don't match (calls 3-4).
const r2 = transitionContent('pending_review', 'approve', adminCtx)
if (r2 !== 'published') {
  errors.push(`Call 2: 'pending_review' + 'approve': expected 'published', got '${r2}'`)
}

// Call 3: draft + submit = pending_review (via author, fresh)
// Bug: machine internal state is 'published' from call 2.
//      'published' + 'submit' → null, so function returns input state ('draft').
const r3 = transitionContent('draft', 'submit', authorCtx)
if (r3 !== 'pending_review') {
  errors.push(`Call 3: 'draft' + 'submit' from fresh: expected 'pending_review', got '${r3}' (BUG: machine not reset)`)
}

// Call 4: archived + schedule = pending_review (via admin)
// Bug: machine internal state is 'draft' (returned from call 3).
//      'draft' + 'schedule' → null, so function returns input state ('archived').
const r4 = transitionContent('archived', 'schedule', adminCtx)
if (r4 !== 'pending_review') {
  errors.push(`Call 4: 'archived' + 'schedule': expected 'pending_review', got '${r4}' (BUG: machine not reset)`)
}

if (errors.length > 0) {
  console.error('Bug 001 reproduced — transition state not reset:\n' + errors.map((e) => `  ❌ ${e}`).join('\n'))
  process.exit(1)
}

console.log('✅ Bug 001: all transitions correct (bug is fixed)')
