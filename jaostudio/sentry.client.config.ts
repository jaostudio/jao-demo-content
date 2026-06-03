const enabled = process.env.NODE_ENV === 'production' && !!process.env.SENTRY_DSN

if (enabled) {
  import('@sentry/nextjs').then(Sentry => {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 0,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0,
      enabled: true,
    })
  }).catch(err => {
    // If dynamic import fails, don't break the app
    // eslint-disable-next-line no-console
    console.error('Failed to load Sentry client:', err)
  })
}
