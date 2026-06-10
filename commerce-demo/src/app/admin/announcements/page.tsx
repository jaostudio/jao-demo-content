import { prisma } from '@/lib/prisma'
import { AnnouncementEditor } from './editor'

export const dynamic = 'force-dynamic'

export default async function AdminAnnouncementsPage() {
  const [msgSetting, enabledSetting] = await Promise.all([
    prisma.appSetting.findUnique({ where: { key: 'announcement_message' } }),
    prisma.appSetting.findUnique({ where: { key: 'announcement_enabled' } }),
  ])

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-[var(--font-display)] text-2xl font-bold">Store Announcement</h1>
      <p className="mt-1 text-sm text-muted">Set a banner announcement shown to all customers.</p>
      <AnnouncementEditor
        initialMessage={msgSetting?.value ?? ''}
        initialEnabled={enabledSetting?.value === 'true'}
      />
    </div>
  )
}
