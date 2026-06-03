#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASELINE_PATH = resolve(__dirname, '..', '.analytics-baseline.json')

function loadEnv() {
  try {
    const envPath = resolve(__dirname, '..', '.env.local')
    const content = readFileSync(envPath, 'utf-8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      const val = trimmed.slice(eq + 1).trim()
      process.env[key] = val
    }
  } catch {
    console.error('.env.local not found. Create it with:\n')
    console.error('  POSTHOG_API_KEY=<personal-api-key>')
    console.error('  POSTHOG_PROJECT_ID=<project-id>')
    console.error('  POSTHOG_HOST=https://app.posthog.com')
    console.error('  CHANGE_ID=<optional-v2.2.2-hero-copy-01>\n')
    process.exit(1)
  }
}

loadEnv()

const API_KEY = process.env.POSTHOG_API_KEY
const PROJECT_ID = process.env.POSTHOG_PROJECT_ID
const HOST = process.env.POSTHOG_HOST || 'https://app.posthog.com'
const CHANGE_ID = process.env.CHANGE_ID || null

if (!API_KEY || !PROJECT_ID) {
  console.error('Missing POSTHOG_API_KEY or POSTHOG_PROJECT_ID in .env.local')
  process.exit(1)
}

const BASE = `${HOST}/api/projects/${PROJECT_ID}`
const MIN_SAMPLE = 50
const RELIABLE_SAMPLE = 100

async function queryEvents(event, properties, days = 7) {
  const url = new URL(`${BASE}/events`)
  url.searchParams.set('event', event)
  url.searchParams.set('date_from', `-${days}d`)
  if (properties) {
    url.searchParams.set('properties', JSON.stringify(properties))
  }

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  })
  if (!res.ok) {
    console.error(`  API error (${event}): ${res.status} ${res.statusText}`)
    return []
  }
  const data = await res.json()
  return data.results || []
}

async function countCTAClick(label, days = 7) {
  const events = await queryEvents('cta_click', [{ key: 'label', value: label, operator: 'exact' }], days)
  return events.length
}

async function countDistinctScrollDepths(days = 7) {
  const events = await queryEvents('scroll_depth', [], days)
  const depths = { 25: 0, 50: 0, 75: 0, 90: 0 }
  for (const e of events) {
    const d = e.properties?.depth
    if (d !== undefined && depths[d] !== undefined) depths[d]++
  }
  return depths
}

async function countAuditSubmits(days = 7) {
  const events = await queryEvents('audit_request_submitted', [], days)
  return events.length
}

async function countCaseStudyScrollDepths(days = 7) {
  const events = await queryEvents('case_study_scroll_depth', [], days)
  const depths = { 25: 0, 50: 0, 75: 0, 90: 0 }
  for (const e of events) {
    const d = e.properties?.depth
    if (d !== undefined && depths[d] !== undefined) depths[d]++
  }
  return depths
}

function pct(part, total) {
  if (total === 0) return '-'
  return ((part / total) * 100).toFixed(1) + '%'
}

function lossPct(from, to) {
  if (from === 0) return null
  return ((1 - to / from) * 100).toFixed(1)
}

function classifyFixType(stage) {
  const map = {
    'Hero → Projects':          { type: 'Message clarity',     risk: 'LOW' },
    'Projects → Case Studies':  { type: 'Structural hierarchy', risk: 'MEDIUM' },
    'Case Studies → Contact':   { type: 'Conversion mechanics', risk: 'HIGH' },
    'Contact → Audit Submit':   { type: 'Conversion mechanics', risk: 'HIGH' },
  }
  return map[stage] || { type: 'Unknown', risk: 'MEDIUM' }
}

function computeConfidence(n, ctrHistory) {
  if (n < MIN_SAMPLE) return 'Low'
  if (n >= RELIABLE_SAMPLE && (!ctrHistory || ctrHistory.length < 2)) return 'High'

  if (ctrHistory && ctrHistory.length >= 2) {
    const max = Math.max(...ctrHistory)
    const min = Math.min(...ctrHistory)
    if (max - min > 0.10) return 'Low (high variance)'
    if (max - min > 0.05) return 'Medium'
  }

  return n >= RELIABLE_SAMPLE ? 'High' : 'Medium'
}

function isSignificant(delta, n) {
  return Math.abs(delta) > 0.08 || n > 200
}

function loadBaseline() {
  if (!existsSync(BASELINE_PATH)) return null
  try {
    return JSON.parse(readFileSync(BASELINE_PATH, 'utf-8'))
  } catch {
    return null
  }
}

function saveBaseline(snapshot) {
  writeFileSync(BASELINE_PATH, JSON.stringify(snapshot, null, 2))
}

function printChangeImpact(current, baseline) {
  const stages = ['heroProjectsCtr', 'projectsCaseStudyCtr', 'caseStudyContactCtr', 'auditSubmitCtr']
  const labels = ['Hero → Projects', 'Projects → Case Studies', 'Case Studies → Contact', 'Audit → Submit']
  const totalSessions = baseline.totalSessions || 0

  console.log('  Change Impact:\n')

  for (let i = 0; i < stages.length; i++) {
    const key = stages[i]
    const prev = baseline[key]
    const curr = current[key]
    if (prev === undefined || curr === undefined) continue

    const rawDelta = curr - prev
    const pctDelta = ((curr - prev) / Math.abs(prev || 1)) * 100

    if (!isSignificant(rawDelta, totalSessions)) {
      console.log(`  ${labels[i]}: ${pct(curr, 1).replace('%', '')}% → ${pct(prev, 1).replace('%', '')}% (insufficient signal — Δ <8% threshold)`)
      continue
    }

    const arrow = pctDelta > 0 ? '+' : ''
    console.log(`  ${labels[i]}: ${pct(prev, 1).replace('%', '')}% → ${pct(curr, 1).replace('%', '')}% (${arrow}${pctDelta.toFixed(1)}% vs baseline) ✓`)
  }
  console.log()
}

async function main() {
  const days = 7
  const baseline = loadBaseline()

  console.log(`\n  Funnel Snapshot (last ${days}d)\n`)
  if (CHANGE_ID) console.log(`  Change ID: ${CHANGE_ID}\n`)

  const heroWork = await countCTAClick('hero_view_work', days)
  const heroDiscuss = await countCTAClick('hero_discuss_project', days)
  const viewAllProjects = await countCTAClick('view_all_projects', days)
  const ctaViewWork = await countCTAClick('cta_view_work', days)
  const ctaStartProject = await countCTAClick('cta_start_project', days)
  const auditSubmit = await countCTAClick('audit_submit', days)
  const caseStudyLive = await countCTAClick('case_study_live_site', days)
  const caseStudySimilar = await countCTAClick('case_study_start_similar', days)
  const auditRequested = await countAuditSubmits(days)

  const totalHeroCTAs = heroWork + heroDiscuss
  const totalCaseStudyCTAs = caseStudyLive + caseStudySimilar
  const totalProjectCTAs = viewAllProjects + ctaViewWork
  const totalExplore = totalHeroCTAs

  const rates = {
    heroProjectsCtr: totalExplore > 0 ? totalProjectCTAs / totalExplore : 0,
    projectsCaseStudyCtr: totalProjectCTAs > 0 ? totalCaseStudyCTAs / totalProjectCTAs : 0,
    caseStudyContactCtr: totalCaseStudyCTAs > 0 ? ctaStartProject / totalCaseStudyCTAs : 0,
    auditSubmitCtr: ctaStartProject > 0 ? (auditSubmit + auditRequested) / ctaStartProject : 0,
  }

  console.log(`  Hero → Projects CTR:         ${pct(totalProjectCTAs, totalHeroCTAs)}`)
  console.log(`  Projects → Case Study CTR:   ${pct(totalCaseStudyCTAs, totalProjectCTAs)}`)
  console.log(`  Case Study → Contact CTR:    ${pct(ctaStartProject, totalCaseStudyCTAs)}`)
  console.log(`  Audit → Submit CTR:          ${pct(auditSubmit + auditRequested, ctaStartProject)}`)
  console.log()

  const depths = await countDistinctScrollDepths(days)
  console.log('  Homepage Scroll Depth:\n')
  console.log(`    25%: ${depths[25]}  50%: ${depths[50]}`)
  console.log(`    75%: ${depths[75]}  90%: ${depths[90]}`)
  console.log()

  const csDepths = await countCaseStudyScrollDepths(days)
  const csTotal = Object.values(csDepths).reduce((a, b) => a + b, 0)
  if (csTotal > 0) {
    console.log('  Case Study Scroll Depth:\n')
    console.log(`    25%: ${csDepths[25]}  50%: ${csDepths[50]}`)
    console.log(`    75%: ${csDepths[75]}  90%: ${csDepths[90]}`)
    console.log()
  }

  console.log('  Raw Event Counts:\n')
  console.log(`    hero_view_work:          ${heroWork}`)
  console.log(`    hero_discuss_project:    ${heroDiscuss}`)
  console.log(`    view_all_projects:       ${viewAllProjects}`)
  console.log(`    cta_view_work:           ${ctaViewWork}`)
  console.log(`    cta_start_project:       ${ctaStartProject}`)
  console.log(`    case_study_live_site:    ${caseStudyLive}`)
  console.log(`    case_study_start_similar:${caseStudySimilar}`)
  console.log(`    audit_submit (btn):      ${auditSubmit}`)
  console.log(`    audit_request_submitted: ${auditRequested}`)
  console.log()

  // Change impact report
  if (baseline && CHANGE_ID && baseline.changeId !== CHANGE_ID) {
    printChangeImpact(rates, baseline)
  }

  // Bottleneck ranking by impact score (visits × loss_rate)
  const bottlenecks = []

  if (totalExplore >= MIN_SAMPLE && totalExplore > 0) {
    const visits = totalExplore
    const lost = totalExplore - totalProjectCTAs
    bottlenecks.push({
      stage: 'Hero → Projects',
      lossPct: parseFloat(lossPct(totalExplore, totalProjectCTAs)),
      visits,
      lost,
      impactScore: visits * (lost / visits),
    })
  }
  if (totalProjectCTAs >= MIN_SAMPLE && totalProjectCTAs > 0) {
    const visits = totalProjectCTAs
    const lost = totalProjectCTAs - totalCaseStudyCTAs
    bottlenecks.push({
      stage: 'Projects → Case Studies',
      lossPct: parseFloat(lossPct(totalProjectCTAs, totalCaseStudyCTAs)),
      visits,
      lost,
      impactScore: visits * (lost / visits),
    })
  }
  if (totalCaseStudyCTAs >= MIN_SAMPLE && totalCaseStudyCTAs > 0) {
    const visits = totalCaseStudyCTAs
    const lost = totalCaseStudyCTAs - ctaStartProject
    bottlenecks.push({
      stage: 'Case Studies → Contact',
      lossPct: parseFloat(lossPct(totalCaseStudyCTAs, ctaStartProject)),
      visits,
      lost,
      impactScore: visits * (lost / visits),
    })
  }

  const auditTotal = auditSubmit + auditRequested
  if (ctaStartProject >= MIN_SAMPLE && ctaStartProject > 0) {
    const visits = ctaStartProject
    const lost = ctaStartProject - auditTotal
    bottlenecks.push({
      stage: 'Contact → Audit Submit',
      lossPct: parseFloat(lossPct(ctaStartProject, auditTotal)),
      visits,
      lost,
      impactScore: visits * (lost / visits),
    })
  }

  console.log('  ---')
  if (totalExplore === 0) {
    console.log('  Status: No hero engagement yet — need traffic before diagnosis.')
  } else if (totalExplore < MIN_SAMPLE) {
    console.log(`  Status: Early signal (${totalExplore} top-funnel events). Need ${MIN_SAMPLE}+ for reliable diagnosis, ${RELIABLE_SAMPLE}+ for confident decisions.`)
  } else if (bottlenecks.length === 0) {
    console.log('  Status: Insufficient downstream data to rank bottlenecks.')
  } else {
    bottlenecks.sort((a, b) => b.impactScore - a.impactScore)
    const primary = bottlenecks[0]
    const fixType = classifyFixType(primary.stage)
    const confidence = computeConfidence(totalExplore, baseline?.history?.heroProjectsCtr)

    console.log(`  Ranked by impact score (users lost × weight):\n`)
    for (const b of bottlenecks) {
      const marker = b === primary ? '  ▶' : '   '
      console.log(`${marker} ${b.stage}: lost ${b.lost} of ${b.visits} users (${b.lossPct}%) — impact ${Math.round(b.impactScore)}`)
    }

    console.log(`\n  Primary Friction: ${primary.stage} (${Math.round(primary.impactScore)} impact score)`)
    console.log(`  Confidence: ${confidence} (n=${totalExplore})`)
    console.log(`  Fix Type:   ${fixType.type} (${fixType.risk} RISK)`)
    console.log(`  ---`)
    console.log(`  Fix target: Optimize ONLY "${primary.stage}" — then set CHANGE_ID and re-measure.`)
  }

  // Save baseline for change tracking on next run
  if (CHANGE_ID) {
    const prevHistory = baseline?.history || {}
    const history = {}
    for (const key of Object.keys(rates)) {
      history[key] = [...(prevHistory[key] || []).slice(-4), rates[key]]
    }

    saveBaseline({
      changeId: CHANGE_ID,
      timestamp: new Date().toISOString(),
      totalSessions: totalExplore,
      ...rates,
      history,
    })
    console.log(`  Baseline saved for change ID: ${CHANGE_ID}`)
  }

  console.log()
}

main().catch((err) => {
  console.error('Script failed:', err)
  process.exit(1)
})
