export type AccessDecisionResult = 'ALLOWED' | 'DENIED' | 'BLOCKED'

export type AccessDecisionCheck = {
  label: string
  status: 'passed' | 'failed' | 'skipped' | 'recorded'
  detail?: string
}

export type AccessDecision = {
  result: AccessDecisionResult
  statusCode: 200 | 201 | 400 | 401 | 403 | 404 | 405
  checks: AccessDecisionCheck[]
  auditEventId?: string
  requestId?: string
}
