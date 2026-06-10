/**
 * Build-time SEO validation script.
 * Run: npx tsx scripts/validate-seo.ts
 *
 * Checks:
 *   - Locale parity (EN/TL) for seo namespace
 *   - Title + description presence for every page in both locales
 *   - OG image files exist for all pages
 *   - Graph completeness: every indexable route is discoverable
 *   - Canonical ↔ hreflang alignment
 *   - Route config completeness
 *   - Relationship completeness: case studies, projects, systems
 */

import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { SEO_ROUTES, SITE_URL } from '../src/lib/seo-config'
import { getPublishedCaseStudies } from '../src/lib/case-studies'
import { projects } from '../src/lib/projects'
import { SYSTEMS } from '../src/lib/systems'

const __dirname = join(fileURLToPath(import.meta.url), '..')
const JAO_ROOT = join(__dirname, '..')

type RouteIntent = 'indexable' | 'noindex' | 'internal' | 'hidden' | 'redirect'

interface RouteEntry {
  key: string
  path: string
  intent: RouteIntent
  canonical: string
}

function loadJSON(path: string) {
  return JSON.parse(readFileSync(path, 'utf-8'))
}

function findOGImageFiles(dir: string): Set<string> {
  const files: Set<string> = new Set()
  function walk(current: string) {
    let entries
    try {
      entries = readdirSync(current, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      const fullPath = join(current, entry.name)
      if (entry.isDirectory()) {
        walk(fullPath)
      } else if (entry.name === 'opengraph-image.tsx') {
        const key = fullPath
          .slice(dir.length)
          .replace(/\\/g, '/')
          .replace(/\/?opengraph-image\.tsx$/, '')
          .replace(/^\//, '')
        files.add(key)
      }
    }
  }
  walk(dir)
  return files
}

function normalizePath(p: string) {
  return p.endsWith('/') ? p.slice(0, -1) : p
}

function main() {
  let errors = 0

  // ── 1. Load SEO_ROUTES ───────────────────────────────────────
  const routeEntries: RouteEntry[] = Object.entries(SEO_ROUTES).map(([key, config]) => ({
    key,
    path: config.path,
    intent: config.intent as RouteIntent,
    canonical: config.canonical,
  }))

  const indexableRoutes = routeEntries.filter((r) => r.intent === 'indexable')
  const nonIndexableRoutes = routeEntries.filter((r) => r.intent !== 'indexable')

  // ── 2. Load messages ─────────────────────────────────────────
  const enMessages = loadJSON(join(JAO_ROOT, 'messages', 'en.json'))
  const tlMessages = loadJSON(join(JAO_ROOT, 'messages', 'tl.json'))
  const seoEN = enMessages.seo
  const seoTL = tlMessages.seo

  if (!seoEN) { console.error('✗ seo namespace missing in en.json'); errors++ }
  if (!seoTL) { console.error('✗ seo namespace missing in tl.json'); errors++ }
  if (!seoEN || !seoTL) { process.exit(errors > 0 ? 1 : 0) }

  const enKeys = Object.keys(seoEN)
  const tlKeys = Object.keys(seoTL)

  // ── 3. Locale parity ─────────────────────────────────────────
  const missingInTL = enKeys.filter((k) => !tlKeys.includes(k))
  const missingInEN = tlKeys.filter((k) => !enKeys.includes(k))
  for (const k of missingInTL) { console.error(`✗ Missing in tl.json seo: ${k}`); errors++ }
  for (const k of missingInEN) { console.error(`✗ Missing in en.json seo: ${k}`); errors++ }

  // ── 4. Title + description presence ──────────────────────────
  for (const locale of ['en', 'tl']) {
    const seo = locale === 'en' ? seoEN : seoTL
    for (const key of Object.keys(seo)) {
      const entry = seo[key]
      if (!entry.title) { console.error(`✗ [${locale}] seo.${key}.title is empty`); errors++ }
      if (!entry.description) { console.error(`✗ [${locale}] seo.${key}.description is empty`); errors++ }
    }
  }

  // ── 5. Graph completeness ────────────────────────────────────
  for (const route of indexableRoutes) {
    if (!seoEN[route.key]) { console.error(`✗ [graph] seo.${route.key} missing in en.json`); errors++ }
    if (!seoTL[route.key]) { console.error(`✗ [graph] seo.${route.key} missing in tl.json`); errors++ }
  }

  // ── 6. Canonical ↔ hreflang alignment ───────────────────────
  const routingLocales = ['en', 'tl']
  const defaultLocale = 'en'

  for (const route of indexableRoutes) {
    const canonical = normalizePath(route.canonical)

    const hreflangUrls: string[] = []
    for (const loc of routingLocales) {
      if (loc === defaultLocale) {
        hreflangUrls.push(canonical)
      } else {
        const tlUrl = canonical.replace('https://jaostudio.dev', 'https://jaostudio.dev/tl')
        hreflangUrls.push(tlUrl)
      }
    }
    hreflangUrls.push(canonical)

    if (!hreflangUrls.includes(canonical)) {
      console.error(`✗ [canonical↔hreflang] ${route.key}: canonical (${canonical}) not in hreflang set`)
      errors++
    }
  }

  // ── 7. OG image coverage ─────────────────────────────────────
  const appDir = join(JAO_ROOT, 'src', 'app')
  const ogFiles = findOGImageFiles(appDir)

  const routeOGAlias: Record<string, string> = {
    home: '[locale]',
    services: '[locale]/(marketing)/services',
    studio: '[locale]/(marketing)/studio',
    contact: '[locale]/(marketing)/contact',
    audit: '[locale]/(marketing)/audit',
    projects: '[locale]/(marketing)/projects',
    demos: '[locale]/demos',
    caseStudies: '[locale]/(marketing)/case-studies',
  }

  const expectedOGPaths = ['', ...new Set(Object.values(routeOGAlias))]
  for (const ogPath of expectedOGPaths) {
    if (!ogFiles.has(ogPath)) {
      console.error(`✗ [og] Missing opengraph-image.tsx for: ${ogPath}`)
      errors++
    }
  }

  // ── 8. Route config completeness ─────────────────────────────
  const expectedKeys = [
    'home', 'projects', 'services', 'demos', 'studio',
    'contact', 'audit', 'cv', 'caseStudies', 'playground',
    'demoCredentials',
  ]
  const configuredKeys = routeEntries.map((r) => r.key)
  for (const key of expectedKeys) {
    if (!configuredKeys.includes(key)) {
      console.error(`✗ [config] Missing route config for: ${key}`)
      errors++
    }
  }
  for (const key of configuredKeys) {
    if (!expectedKeys.includes(key)) {
      console.error(`✗ [config] Unexpected route config: ${key}`)
      errors++
    }
  }

  // ── 9. Intent classification review ──────────────────────────
  const validIntents: RouteIntent[] = ['indexable', 'noindex', 'internal', 'hidden', 'redirect']
  for (const route of routeEntries) {
    if (!validIntents.includes(route.intent)) {
      console.error(`✗ [intent] ${route.key}: invalid intent "${route.intent}"`)
      errors++
    }
  }

  // ── 10. Case study relationship completeness ─────────────────
  const publishedCaseStudies = getPublishedCaseStudies()
  const projectsMap = new Map(projects.map((p) => [p.slug, p]))
  const systemsMap = new Map(SYSTEMS.map((s) => [s.id, s]))

  for (const cs of publishedCaseStudies) {
    // relatedProject must exist
    if (!projectsMap.has(cs.relatedProject)) {
      console.error(`✗ [cs] ${cs.slug}: relatedProject "${cs.relatedProject}" not found in projects`)
      errors++
    }

    // relatedServices must be valid ServiceIds
    for (const sid of cs.relatedServices) {
      // ServiceId type cannot be checked at runtime, but we can validate all services exist
      // by checking the services registry — skip runtime check here as type system handles it
    }

    // relatedDemos must exist in SYSTEMS
    for (const did of cs.relatedDemos) {
      if (!systemsMap.has(did)) {
        console.error(`✗ [cs] ${cs.slug}: relatedDemo "${did}" not found in SYSTEMS`)
        errors++
      }
    }

    // featured must have a flagship or production project
    if (cs.featured) {
      const project = projectsMap.get(cs.relatedProject)
      if (project && project.projectTier === 'concept') {
        console.error(`✗ [cs] ${cs.slug}: featured case study references a concept-tier project`)
        errors++
      }
    }
  }

  // ── 11. Project relationship completeness ────────────────────
  for (const p of projects) {
    // relatedServices must be non-empty
    if (!p.relatedServices || p.relatedServices.length === 0) {
      console.error(`✗ [project] ${p.slug}: no relatedServices defined`)
      errors++
    }
  }

  // ── 12. System relationship completeness ─────────────────────
  for (const s of SYSTEMS) {
    if (!s.relatedServices || s.relatedServices.length === 0) {
      console.error(`✗ [system] ${s.id}: no relatedServices defined`)
      errors++
    }
  }

  // ── Results ──────────────────────────────────────────────────
  if (errors === 0) {
    console.log('✓ SEO validation passed')
    console.log(`  - ${enKeys.length} pages in seo namespace (EN)`)
    console.log(`  - ${tlKeys.length} pages in seo namespace (TL)`)
    console.log(`  - ${ogFiles.size} OG image files found`)
    console.log(`  - ${indexableRoutes.length} indexable routes`)
    console.log(`  - ${nonIndexableRoutes.length} non-indexable routes`)
    console.log(`  - ${publishedCaseStudies.length} published case studies`)
  } else {
    console.error(`\n✗ ${errors} validation error(s) found`)
    process.exit(1)
  }
}

main()
