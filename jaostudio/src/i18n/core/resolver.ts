import type { GlossaryEntry, GlossaryContext, GlossaryIntent } from './glossary'
import { uiGlossary } from '../domains/ui'
import { marketingGlossary } from '../domains/marketing'
import { technicalGlossary } from '../domains/technical'
import { ctaGlossary } from '../domains/cta'
import { sharedStagesGlossary } from '../domains/shared/stages'
import { sharedDeliveryGlossary } from '../domains/shared/delivery'
import { sharedModelsGlossary } from '../domains/shared/models'

const domains: Record<string, GlossaryEntry[]> = {
  ui: uiGlossary,
  marketing: marketingGlossary,
  technical: technicalGlossary,
  cta: ctaGlossary,
  stages: sharedStagesGlossary,
  delivery: sharedDeliveryGlossary,
  models: sharedModelsGlossary,
}

const allEntries = Object.values(domains).flat()

const byKey: Map<string, GlossaryEntry> = new Map()
const byContext: Map<GlossaryContext, Map<string, GlossaryEntry>> = new Map()
const byDomainIntent: Map<string, GlossaryEntry> = new Map()
const globalFallback: Map<string, GlossaryEntry> = new Map()

for (const entry of allEntries) {
  // Index by key
  if (!byKey.has(entry.key)) {
    byKey.set(entry.key, entry)
  }

  // Index by context
  if (!byContext.has(entry.context)) {
    byContext.set(entry.context, new Map())
  }
  if (!byContext.get(entry.context)!.has(entry.en.toLowerCase())) {
    byContext.get(entry.context)!.set(entry.en.toLowerCase(), entry)
  }

  // Index by domain + intent
  if (entry.domain && entry.intent) {
    const diKey = `${entry.domain}:${entry.intent}:${entry.en.toLowerCase()}`
    if (!byDomainIntent.has(diKey)) {
      byDomainIntent.set(diKey, entry)
    }
  }

  // Global fallback (first entry wins)
  if (!globalFallback.has(entry.en.toLowerCase())) {
    globalFallback.set(entry.en.toLowerCase(), entry)
  }
}

export interface ResolveOptions {
  context?: GlossaryContext
  intent?: GlossaryIntent
  domain?: string
}

export function resolveGlossary(
  keyOrEn: string,
  opts?: ResolveOptions,
): GlossaryEntry | undefined {
  // 1. Exact key match
  const exact = byKey.get(keyOrEn)
  if (exact) return exact

  // 2. Domain + intent match
  if (opts?.domain && opts?.intent) {
    const diMatch = byDomainIntent.get(`${opts.domain}:${opts.intent}:${keyOrEn.toLowerCase()}`)
    if (diMatch) return diMatch
  }

  // 3. Domain match (any intent)
  if (opts?.domain) {
    for (const [diKey, entry] of byDomainIntent) {
      if (diKey.startsWith(`${opts.domain}:`) && diKey.endsWith(`:${keyOrEn.toLowerCase()}`)) {
        return entry
      }
    }
  }

  // 4. Context match
  if (opts?.context) {
    const ctxMatch = byContext.get(opts.context)?.get(keyOrEn.toLowerCase())
    if (ctxMatch) return ctxMatch
  }

  // 5. Global fallback
  return globalFallback.get(keyOrEn.toLowerCase())
}

export function tl(keyOrEn: string, opts?: ResolveOptions): string {
  return resolveGlossary(keyOrEn, opts)?.tl ?? keyOrEn
}

export function hasGlossaryEntry(keyOrEn: string): boolean {
  return byKey.has(keyOrEn) || globalFallback.has(keyOrEn.toLowerCase())
}

export function getContextEntries(context: GlossaryContext): GlossaryEntry[] {
  return Array.from(byContext.get(context)?.values() ?? [])
}
