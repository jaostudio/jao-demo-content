const requiredVars = ['RESEND_API_KEY', 'NEXT_PUBLIC_POSTHOG_KEY', 'SITE_URL'] as const

function validateEnv() {
  if (process.env.NODE_ENV !== 'production') return

  const missing: string[] = []
  for (const key of requiredVars) {
    if (!process.env[key]) {
      missing.push(key)
    }
  }

  if (missing.length > 0) {
    console.error(
      `Missing required environment variables: ${missing.join(', ')}.\n` +
      `Set them in your Vercel project dashboard.`
    )
  }
}

validateEnv()

export const env = {
  resendApiKey: process.env.RESEND_API_KEY || '',
  posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY || '',
  siteUrl: process.env.SITE_URL || 'https://jaostudio.dev',
  contactEmail: process.env.CONTACT_EMAIL || 'jameson.olitoquit@gmail.com',
  fromEmail: process.env.FROM_EMAIL || 'JAOstudio <jameson.olitoquit@gmail.com>',
  upstashUrl: process.env.UPSTASH_REDIS_REST_URL,
  upstashToken: process.env.UPSTASH_REDIS_REST_TOKEN,
  posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
  sentryDsn: process.env.SENTRY_DSN,
  posthogProjectId: process.env.POSTHOG_PROJECT_ID || '',
  posthogPersonalApiKey: process.env.POSTHOG_PERSONAL_API_KEY || '',
} as const
