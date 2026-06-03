export type GlossaryContext = 'ui' | 'marketing' | 'technical' | 'cta'

export type GlossaryIntent =
  | 'label'
  | 'action'
  | 'description'
  | 'delivery_definition'
  | 'delivery_output'
  | 'delivery_input'
  | 'engagement_model'
  | 'technical_term'
  | 'cta_primary'
  | 'cta_secondary'
  | 'form_field'
  | 'form_error'
  | 'form_success'
  | 'section_heading'
  | 'section_subheading'
  | 'nav_item'

export interface GlossaryEntry {
  key: string
  en: string
  tl: string
  context: GlossaryContext
  intent?: GlossaryIntent
  domain?: string
}

export type GlossaryDomain = Record<string, GlossaryEntry>

export type Locale = 'en' | 'tl'
