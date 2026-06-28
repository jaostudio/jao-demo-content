import { SearchPage } from '@/components/new/pages/search-page'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search works on Likha.',
}

export default function SearchRoutePage() {
  return <SearchPage />
}
