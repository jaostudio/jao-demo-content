export const ANALYTICS_SCHEMA_VERSION = 2

export const EVENTS = {
  CTA_CLICKED: 'cta_clicked',
  PROJECT_VIEWED: 'project_viewed',
  PROJECT_CLICKED: 'project_clicked',
  SCROLL_DEPTH: 'scroll_depth',
  ENGAGED: 'engaged',
  CONTACT_FORM_STARTED: 'contact_form_started',
  CONTACT_FORM_SUBMITTED: 'contact_form_submitted',
  CONTACT_FORM_FAILED: 'contact_form_failed',
  CONTACT_FORM_VALIDATION_ERROR: 'contact_form_validation_error',
  AUDIT_FORM_STARTED: 'audit_form_started',
  AUDIT_VALIDATION_FAILED: 'audit_validation_failed',
  AUDIT_SUBMITTED: 'audit_request_submitted',
  CASE_STUDY_SCROLL: 'case_study_scroll_depth',
  PLAYGROUND_CARD_CLICK: 'playground_card_click',
  PROCESS_STEP_OPENED: 'process_step_opened',
  SERVICES_VIEW: 'services_view',
  ENGAGEMENT_MODEL_VIEW: 'engagement_model_view',
  PROJECT_FIT_VIEW: 'project_fit_view',
  DEMO_CLICK: 'demo_click',
} as const

export type EventName = (typeof EVENTS)[keyof typeof EVENTS]

export interface EventPayloadMap {
  [EVENTS.CTA_CLICKED]: { label: string; location: string }
  [EVENTS.PROJECT_VIEWED]: { project: string }
  [EVENTS.PROJECT_CLICKED]: { project: string; location: string }
  [EVENTS.SCROLL_DEPTH]: { depth: number }
  [EVENTS.ENGAGED]: { depth: number; time_on_page_ms: number }
  [EVENTS.CONTACT_FORM_STARTED]: { source?: string }
  [EVENTS.CONTACT_FORM_SUBMITTED]: { status: 'success' | 'error'; latency_ms: number }
  [EVENTS.CONTACT_FORM_FAILED]: { latency_ms: number }
  [EVENTS.CONTACT_FORM_VALIDATION_ERROR]: Record<string, never>
  [EVENTS.AUDIT_FORM_STARTED]: { source: string }
  [EVENTS.AUDIT_VALIDATION_FAILED]: { step: string }
  [EVENTS.AUDIT_SUBMITTED]: { status: 'success' | 'error'; latency_ms: number; error_type?: string }
  [EVENTS.CASE_STUDY_SCROLL]: { depth: number }
  [EVENTS.PLAYGROUND_CARD_CLICK]: { demo: string; category: string }
  [EVENTS.PROCESS_STEP_OPENED]: { step: number; title: string; viewport: string }
  [EVENTS.SERVICES_VIEW]: { locale: string }
  [EVENTS.ENGAGEMENT_MODEL_VIEW]: { locale: string }
  [EVENTS.PROJECT_FIT_VIEW]: { locale: string }
  [EVENTS.DEMO_CLICK]: { locale: string }
}
