import { AppShell } from '@/components/new/layout/app-shell'
import { RightPanel } from '@/components/new/layout/right-panel'
import { StudioShell } from '@/components/new/layout/studio-shell'
import { fetchAPI } from '@/lib/api/server'

export const dynamic = 'force-dynamic'

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  let categories: { slug: string; name: string }[] = []
  try {
    categories = await fetchAPI<{ slug: string; name: string }[]>('/api/categories').catch(() => [])
  } catch {
    // backend unavailable
  }

  return (
    <AppShell rightPanel={<RightPanel categories={categories} />} hideFooter>
      <StudioShell>
        {children}
      </StudioShell>
    </AppShell>
  )
}
