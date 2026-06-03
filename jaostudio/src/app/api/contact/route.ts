import { NextRequest, NextResponse } from 'next/server'
import { contactSchema, auditSchema, calculateLeadScore } from '@/lib/validation/contact'
import { confirmationEmail, internalNotification } from '@/lib/email/templates'
import { checkRateLimit } from '@/lib/rate-limit'
import { AppError, isAppError } from '@/lib/errors'
import * as Sentry from '@sentry/nextjs'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'jameson.olitoquit@gmail.com'
const FROM_ADDRESS = process.env.FROM_EMAIL || 'JAOstudio <jameson.olitoquit@gmail.com>'

function requestId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

async function sendEmails(data: Record<string, string>, type: 'contact' | 'audit') {
  if (!RESEND_API_KEY) {
    console.log('[contact] Resend not configured — skipping email delivery')
    return
  }

  const { Resend } = await import('resend')
  const resend = new Resend(RESEND_API_KEY)

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: data.email,
      subject: type === 'contact'
        ? 'Thanks for reaching out — JAOstudio'
        : 'Audit request received — JAOstudio',
      html: confirmationEmail(data as any),
    })
  } catch (err) {
    const appErr = new AppError('EMAIL_FAILED', 500, 'Confirmation email failed', { to: data.email, type })
    console.error('[contact]', appErr.message, String(err))
    Sentry.captureException(err, { tags: appErr.sentryTags() })
  }

  try {
    const score = type === 'contact' ? calculateLeadScore(data as any) : 0
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: CONTACT_EMAIL,
      subject: `New ${type} from ${data.name}${type === 'contact' ? ` — Score: ${score}` : ''}`,
      html: internalNotification(data as any, score),
    })
  } catch (err) {
    const appErr = new AppError('EMAIL_FAILED', 500, 'Internal notification failed', { name: data.name, type })
    console.error('[contact]', appErr.message, String(err))
    Sentry.captureException(err, { tags: appErr.sentryTags() })
  }
}

export async function POST(req: NextRequest) {
  const rid = requestId()

  try {
    const rl = await checkRateLimit(req, 'contact')
    if (rl && !rl.ok) {
      return NextResponse.json(
        { ok: false, error: 'Too many requests' },
        {
          status: 429,
          headers: {
            'x-request-id': rid,
            'x-ratelimit-limit': String(rl.limit),
            'x-ratelimit-remaining': String(rl.remaining),
            'x-ratelimit-reset': String(rl.reset),
          },
        },
      )
    }

    const origin = req.headers.get('origin') || ''
    const host = req.headers.get('host') || ''
    if (origin && !origin.includes(host) && !origin.includes('localhost')) {
      return NextResponse.json({ ok: false, error: 'Invalid origin' }, { status: 403, headers: { 'x-request-id': rid } })
    }

    let body: any
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400, headers: { 'x-request-id': rid } })
    }

    const isAudit = body._type === 'audit'

    const limiter = isAudit ? 'audit' : 'contact'
    const auditRl = isAudit ? await checkRateLimit(req, 'audit') : null
    if (auditRl && !auditRl.ok) {
      return NextResponse.json(
        { ok: false, error: 'Too many requests' },
        {
          status: 429,
          headers: {
            'x-request-id': rid,
            'x-ratelimit-limit': String(auditRl.limit),
            'x-ratelimit-remaining': String(auditRl.remaining),
            'x-ratelimit-reset': String(auditRl.reset),
          },
        },
      )
    }

    const result = isAudit ? auditSchema.safeParse(body) : contactSchema.safeParse(body)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      return NextResponse.json({ ok: false, errors }, { status: 422, headers: { 'x-request-id': rid } })
    }

    const data = result.data

    console.log(JSON.stringify({
      request_id: rid,
      type: isAudit ? 'audit_submission' : 'contact_submission',
      ...data,
      leadScore: isAudit ? 0 : calculateLeadScore(data as any),
    }))

    await sendEmails(data as any, isAudit ? 'audit' : 'contact')

    const rlHeaders: Record<string, string> = { 'x-request-id': rid }
    if (rl) {
      rlHeaders['x-ratelimit-limit'] = String(rl.limit)
      rlHeaders['x-ratelimit-remaining'] = String(rl.remaining)
      rlHeaders['x-ratelimit-reset'] = String(rl.reset)
    }

    return NextResponse.json({ ok: true }, { headers: rlHeaders })
  } catch (err) {
    const safeErr = isAppError(err) ? err : new AppError('INTERNAL_ERROR', 500, 'Internal error', { rid })
    console.error('[contact]', String(err))
    Sentry.captureException(err, { tags: safeErr.sentryTags() })
    return NextResponse.json(safeErr.toJSON(), { status: safeErr.status, headers: { 'x-request-id': rid } })
  }
}
