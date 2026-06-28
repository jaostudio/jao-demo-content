export type SecurityLabSimulation =
  | 'cross-tenant'
  | 'admin-action'
  | 'org-id-injection'
  | 'audit-tamper'
  | 'escalated-edit'

export type SimulationStep = {
  label: string
  passed: boolean
  detail: string
}

export type SimulationResult = {
  steps: SimulationStep[]
  result: 'ALLOWED' | 'BLOCKED'
  responseCode: number
  auditEvent: string
  auditRecorded: boolean
}
