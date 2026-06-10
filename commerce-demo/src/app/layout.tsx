import type { Metadata } from 'next'
import Link from 'next/link'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { Nav } from '@/components/nav'
import { DemoControlPanel } from '@/components/demo-control-panel'
import { ChatBubble } from '@/components/chat-bubble'
import { NetworkStatus } from '@/components/network-status'
import { Toaster } from 'sonner'
import { Providers } from '@/components/providers'
import { getLang } from '@/lib/lang'

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })
const poppins = Poppins({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-display' })

export const metadata: Metadata = {
  metadataBase: new URL('https://sari-sari-demo.vercel.app'),
  title: 'Sari-Sari — Isang tindahan, libong paninda',
  description: 'Bawat piso, may kwento. Nostalgic Filipino corner store online — snacks, noodles, candies, and household essentials.',
  openGraph: {
    title: 'Sari-Sari — Isang tindahan, libong paninda',
    description: 'Nostalgic Filipino corner store online — snacks, noodles, candies, and household essentials.',
    type: 'website',
    locale: 'en_PH',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    other: [
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang()
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} flex min-h-screen flex-col font-[var(--font-body)] antialiased`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-flag-blue focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none">
          {lang === 'tl' ? 'Laktawan sa pangunahing content' : 'Skip to main content'}
        </a>
        <Providers>
          <Nav />
          <main id="main-content" className="flex-1">{children}</main>
          <div className="flag-divider" />
          <footer className="px-4 py-8 text-center text-xs text-muted">
            <p>{lang === 'tl' ? 'Ang Sari-Sari ay isang demo website. Lahat ng pangalan ng produkto, tatak, at larawan ay ginagamit para sa ilustrasyon lamang. Walang tunay na transaksyong nagaganap.' : 'Sari-Sari is a demo website. All product names, brands, and images are used for illustrative purposes only. No real transactions occur.'}</p>
            <div className="mt-3 flex items-center justify-center gap-4">
              <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground transition-colors">{lang === 'tl' ? 'Pribasidad' : 'Privacy'}</Link>
              <Link href="/terms" className="underline underline-offset-2 hover:text-foreground transition-colors">{lang === 'tl' ? 'Mga Tuntunin' : 'Terms'}</Link>
              <span>&copy; {new Date().getFullYear()} Sari-Sari Demo</span>
            </div>
          </footer>
          <DemoControlPanel />
          <ChatBubble />
          <NetworkStatus />
        </Providers>
        <Toaster position="bottom-center" toastOptions={{ className: 'text-sm rounded-xl shadow-lg border border-subtle bg-surface' }} />
      </body>
    </html>
  )
}
