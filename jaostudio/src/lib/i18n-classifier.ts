const TECHNICAL_WHITELIST = new Set([
  'ai', 'automation', 'api', 'crm', 'erp', 'analytics', 'dashboard',
  'workflow', 'saas', 'web app', 'mobile app', 'react', 'next.js',
  'typescript', 'postgresql', 'infrastructure', 'devops', 'performance', 'seo',
  'lighthouse', 'lcp', 'cls', 'inp', 'ttfb', 'bundle',
])

export type ClassificationContext = 'cta' | 'ui_label' | 'form_field' | 'description' | 'section_heading'

export interface ClassificationResult {
  strategy: 'translate_full' | 'taglish' | 'keep_english'
  reason: string
}

function hasTechnicalTerms(text: string): boolean {
  const words = text.toLowerCase().split(/[\s,;&–—]+/)
  return words.some((w) => TECHNICAL_WHITELIST.has(w))
}

export function shouldTranslateFully(text: string, context: ClassificationContext): ClassificationResult {
  const wordCount = text.split(/\s+/).length

  // Rule: CTAs always translate
  if (context === 'cta') {
    return { strategy: 'translate_full', reason: 'CTA context — always translate' }
  }

  // Rule: Form fields always translate
  if (context === 'form_field') {
    return { strategy: 'translate_full', reason: 'Form field — always translate' }
  }

  // Rule: UI labels always translate
  if (context === 'ui_label') {
    return { strategy: 'translate_full', reason: 'UI label — always translate' }
  }

  // Rule: Section headings translate except when they're technical terms
  if (context === 'section_heading') {
    if (hasTechnicalTerms(text)) {
      return { strategy: 'keep_english', reason: 'Section heading contains technical terms' }
    }
    return { strategy: 'translate_full', reason: 'Section heading — translate unless technical' }
  }

  // Rule: Descriptions > 12 words → Taglish eligible
  if (context === 'description' && wordCount > 12) {
    return { strategy: 'taglish', reason: `Description exceeds 12 words (${wordCount}) — Taglish eligible` }
  }

  // Rule: Descriptions ≤ 12 words → translate fully
  if (context === 'description') {
    return { strategy: 'translate_full', reason: `Description ≤ 12 words (${wordCount}) — translate fully` }
  }

  // Default
  return { strategy: 'taglish', reason: 'Default: Taglish' }
}
