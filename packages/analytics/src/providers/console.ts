import { registerAnalyticsProvider } from '../index'

export function useConsoleAnalytics() {
  registerAnalyticsProvider({
    pageview: (data) => console.log('[analytics] pageview:', data.pathname),
    event: (name, payload) => console.log('[analytics] event:', name, payload),
  })
}
