import * as Sentry from '@sentry/nextjs'
import { logHealthReport } from '@/lib/runtime-health'

export async function register() {
  logHealthReport()

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0,
    enabled: process.env.NODE_ENV === 'production' && !!process.env.SENTRY_DSN,
  })
}
