import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { ThemeProviderWrapper } from '@/components/theme-provider-wrapper'
import Script from 'next/script'
import { cookies } from 'next/headers'
import dynamic from 'next/dynamic'
import './globals.css'
import { AuthProvider } from '@/components/auth-provider'
import { IntlProvider } from '@/components/intl-provider'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { PageViewTracker } from '@/components/page-view-tracker'
import { DemoBanner } from '@/components/demo-banner'
import { Toaster } from 'sonner'
import { ErrorBoundaryWrapper } from '@/components/error-boundary-wrapper'
import { AbandonedCartTracker } from '@/components/abandoned-cart-tracker'
import { ServiceWorkerRegister } from '@/components/service-worker-register'
import { PwaInstallPrompt } from '@/components/pwa-install-prompt'

const DemoControlPanel = dynamic(() => import('@/components/demo-control-panel').then(m => m.DemoControlPanel))
const LiveChatWidget = dynamic(() => import('@/components/live-chat-widget').then(m => m.LiveChatWidget))

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Likha — Discover Filipino Craft',
  description:
    'A multi-vendor marketplace for authentic Filipino artisan goods. Handwoven textiles, pottery, woodcraft, artisan food, and more — direct from island makers.',
  keywords: ['marketplace', 'Filipino', 'artisan', 'handmade', 'Philippines', 'craft'],
  authors: [{ name: 'Likha' }],
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Likha — Discover Filipino Craft',
    description: 'Authentic artisanal goods, straight from the islands.',
    type: 'website',
    locale: 'en_PH',
    siteName: 'Likha',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FDF8F2' },
    { media: '(prefers-color-scheme: dark)', color: '#0D0A07' },
  ],
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en'
  const messages = (await import(`../../messages/${locale}.json`)).default

  return (
    <html lang={locale === 'tl' ? 'tl' : 'en'} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <Script
          id="suppress-react-theme-warning"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: 'if(!console._themeSuppressed){console._themeSuppressed=true;var _ce=console.error;console.error=function(){if(arguments[0]&&typeof arguments[0]==="string"&&arguments[0].indexOf("Encountered a script tag while rendering React component")!==-1)return;_ce.apply(console,arguments)}}',
          }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans min-h-screen bg-neutral-50 text-neutral-800 antialiased dark:bg-neutral-950 dark:text-neutral-100`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-primary-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-warm-md"
        >
          Skip to main content
        </a>
        <ThemeProviderWrapper attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <IntlProvider locale={locale} messages={messages}>
              <DemoBanner show={process.env.DEMO_MODE !== 'false'} />
              <Nav />
              <PageViewTracker />
              <AbandonedCartTracker />
              <main id="main" className="min-h-[calc(100vh-4rem)]"><ErrorBoundaryWrapper>{children}</ErrorBoundaryWrapper></main>
              <Toaster richColors position="top-right" />
              {process.env.DEMO_MODE !== 'false' && <DemoControlPanel />}
              <PwaInstallPrompt />
              <ServiceWorkerRegister />
              <LiveChatWidget />
              <Footer />
            </IntlProvider>
          </AuthProvider>
        </ThemeProviderWrapper>
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <Script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  )
}
