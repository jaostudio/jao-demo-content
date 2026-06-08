import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'
import { AuthProvider } from '@/components/auth-provider'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { PageViewTracker } from '@/components/page-view-tracker'
import { DemoBanner } from '@/components/demo-banner'
import { Toaster } from 'sonner'
import { ErrorBoundaryWrapper } from '@/components/error-boundary-wrapper'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Likha — Discover Filipino Craft',
  description:
    'A multi-vendor marketplace for authentic Filipino artisan goods. Handwoven textiles, pottery, woodcraft, artisan food, and more — direct from island makers.',
  keywords: ['marketplace', 'Filipino', 'artisan', 'handmade', 'Philippines', 'craft'],
  authors: [{ name: 'Likha' }],
  openGraph: {
    title: 'Likha — Discover Filipino Craft',
    description: 'Authentic artisanal goods, straight from the islands.',
    type: 'website',
    locale: 'en_PH',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FDF8F2' },
    { media: '(prefers-color-scheme: dark)', color: '#0D0A07' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans min-h-screen bg-neutral-50 text-neutral-800 antialiased dark:bg-neutral-950 dark:text-neutral-100`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-primary-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-warm-md"
        >
          Skip to main content
        </a>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <DemoBanner show={process.env.DEMO_MODE !== 'false'} />
            <Nav />
            <PageViewTracker />
            <main id="main" className="min-h-[calc(100vh-4rem)]"><ErrorBoundaryWrapper>{children}</ErrorBoundaryWrapper></main>
            <Toaster richColors position="top-right" />
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
