import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Content Platform Demo — CMS & SEO Engine',
    template: '%s | Content Platform Demo',
  },
  description: 'A content management and publishing platform: editorial workflow, SEO pipeline, and dynamic content generation.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
