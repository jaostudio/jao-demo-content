import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'

const REPORT_THRESHOLD = 10

let violationCount = 0

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const report = body['csp-report']

    violationCount++

    console.log(JSON.stringify({
      type: 'csp_violation',
      count: violationCount,
      documentUri: report?.['document-uri'],
      blockedUri: report?.['blocked-uri'],
      violatedDirective: report?.['violated-directive'],
      effectiveDirective: report?.['effective-directive'],
      disposition: report?.['disposition'],
      sourceFile: report?.['source-file'],
      lineNumber: report?.['line-number'],
    }))

    if (violationCount <= REPORT_THRESHOLD) {
      Sentry.captureMessage(`CSP violation: ${report?.['violated-directive']}`, {
        level: 'warning',
        tags: { csp: 'violation' },
        extra: {
          blockedUri: report?.['blocked-uri'],
          documentUri: report?.['document-uri'],
          violatedDirective: report?.['violated-directive'],
        },
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[csp-report] Failed to process report:', String(err))
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}
