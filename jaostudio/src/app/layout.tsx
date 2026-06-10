import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import { Providers } from '@/components/layout/providers'
import ClientProviders from '@/components/layout/client-providers'
import { PageViewTracker } from '@/components/layout/pageview-tracker'
import { ScrollDepthTracker } from '@/components/layout/scroll-depth-tracker'
import { ClientScrollGlow } from '@/components/layout/client-scroll-glow'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { SkipLink } from '@/components/layout/skip-link'
import { ORG_ID, PERSON_ID, SERVICE_ID, WEBSITE_ID } from '@/lib/json-ld-ids'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { PageTransition } from '@/components/layout/page-transition'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'JAOstudio — Custom Websites & Web Applications',
  description:
    'Custom websites, web applications, and dashboards built for startups, agencies, and established businesses. Focus on performance, clarity, and measurable results.',
  metadataBase: new URL('https://jaostudio.dev'),
  openGraph: {
    title: 'JAOstudio — Custom Websites & Web Applications',
    description:
      'Custom websites, web applications, and dashboards built for startups, agencies, and established businesses. Focus on performance, clarity, and measurable results.',
    url: 'https://jaostudio.dev',
    siteName: 'JAOstudio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JAOstudio — Custom Websites & Web Applications',
    description:
      'Custom websites, web applications, and dashboards built for startups, agencies, and established businesses. Focus on performance, clarity, and measurable results.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.ico',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = await getMessages()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ORG_ID,
        name: 'JAOstudio',
        url: 'https://jaostudio.dev',
        description:
          'Custom websites, web applications, and dashboards for startups, agencies, and established businesses.',
        logo: 'https://jaostudio.dev/favicon.svg',
        sameAs: [
          'https://github.com/jaoce',
          'https://linkedin.com/in/jamesonolitoquit',
        ],
      },
      {
        '@type': 'ProfessionalService',
        '@id': SERVICE_ID,
        name: 'JAOstudio',
        url: 'https://jaostudio.dev',
        description:
          'Custom websites, dashboards, and tools built for performance.',
        areaServed: 'Worldwide',
        serviceType: 'Web Development',
        provider: { '@id': ORG_ID },
      },
      {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: 'Jameson Olitoquit',
        jobTitle: 'Independent Web Developer',
        url: 'https://jaostudio.dev',
        sameAs: [
          'https://github.com/jaoce',
          'https://linkedin.com/in/jamesonolitoquit',
        ],
        worksFor: { '@id': ORG_ID },
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        name: 'JAOstudio',
        url: 'https://jaostudio.dev',
      },
    ],
  }

  return (
    <html lang={locale} suppressHydrationWarning>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-bg-primary`}>
        <div className="noise-overlay" />
        <Providers>
          <ClientProviders>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <ScrollDepthTracker />
              <ClientScrollGlow />
              <Suspense fallback={null}>
                <PageViewTracker />
              </Suspense>
              <SkipLink />
              <Navbar />
              <main id="main-content" className="min-h-screen">
                <PageTransition>{children}</PageTransition>
              </main>
              <Footer />
            </NextIntlClientProvider>
          </ClientProviders>
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  )
}
