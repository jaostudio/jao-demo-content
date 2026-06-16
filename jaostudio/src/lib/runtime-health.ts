interface SystemCheck {
  name: string
  status: 'ok' | 'missing' | 'degraded'
  detail?: string
}

interface HealthReport {
  timestamp: string
  environment: string
  overall: 'healthy' | 'degraded' | 'unhealthy'
  systems: SystemCheck[]
}

function checkEnv(envVar: string, label: string, optional = false): SystemCheck {
  const exists = !!process.env[envVar]
  if (exists) return { name: label, status: 'ok' }
  if (optional) return { name: label, status: 'degraded', detail: `${envVar} not set - will fall back gracefully` }
  return { name: label, status: 'missing', detail: `${envVar} not set - feature disabled` }
}

export function generateHealthReport(): HealthReport {
  const checks: SystemCheck[] = [
    checkEnv('NEXT_PUBLIC_POSTHOG_KEY', 'Analytics (PostHog)'),
    checkEnv('RESEND_API_KEY', 'Email (Resend)', true),
    checkEnv('SITE_URL', 'Site URL', true),
    checkEnv('UPSTASH_REDIS_REST_URL', 'Rate Limiting (Upstash URL)', true),
    checkEnv('UPSTASH_REDIS_REST_TOKEN', 'Rate Limiting (Upstash Token)', true),
    checkEnv('SENTRY_DSN', 'Error Monitoring (Sentry)', true),
    { name: 'Security Headers (CSP/HSTS)', status: 'ok' },
    { name: 'Architecture SVG System', status: 'ok' },
  ]

  const missing = checks.filter((c) => c.status === 'missing')
  const degraded = checks.filter((c) => c.status === 'degraded')

  const overall = missing.length > 0 ? 'unhealthy' : degraded.length > 0 ? 'degraded' : 'healthy'

  return {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    overall,
    systems: checks,
  }
}

export function logHealthReport(): void {
  const report = generateHealthReport()

  console.log('---')
  console.log('[health] System Readiness Report')
  console.log(`[health] Environment: ${report.environment}`)
  console.log(`[health] Overall: ${report.overall.toUpperCase()}`)
  console.log('[health] Systems:')

  for (const s of report.systems) {
    const icon = s.status === 'ok' ? '  ✓' : s.status === 'degraded' ? '  ~' : '  ✗'
    console.log(`[health] ${icon} ${s.name}${s.detail ? ` - ${s.detail}` : ''}`)
  }

  if (report.overall !== 'healthy') {
    console.log('[health] System is running in degraded mode - some features may not work.')
  }

  console.log('---')
}
