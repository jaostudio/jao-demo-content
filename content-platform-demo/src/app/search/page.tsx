import { NEW_LAYOUT_ENABLED } from '@/lib/new/flags'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SearchPage as NewSearchPage } from '@/components/new/pages/search-page'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search works on Likha.',
}

export default function SearchRoutePage() {
  if (NEW_LAYOUT_ENABLED) {
    return <NewSearchPage />
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-4">
        <h1 className="text-xl font-semibold text-text-primary dark:text-slate-100 mb-4">Search</h1>
        <p className="text-sm text-text-muted">Search functionality coming soon.</p>
      </main>
      <Footer />
    </>
  )
}
