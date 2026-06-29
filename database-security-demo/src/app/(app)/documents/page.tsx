import { getCurrentUser } from '@/lib/auth/get-session'
import { getPrisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createDocument, deleteDocument } from '@/lib/actions'
import { Badge } from '@/components/ui/badge'
import { GlassCard } from '@/components/ui/glass-card'

export const dynamic = 'force-dynamic'

export default async function DocumentsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/signin')
  if (!user.orgId && user.role !== 'SYSTEM_ADMIN') redirect('/dashboard')
  const prisma = await getPrisma()

  const where = user.role === 'SYSTEM_ADMIN' ? {} : { organizationId: user.orgId }
  const documents = await (prisma as any).document.findMany({
    where,
    include: { uploadedBy: true, organization: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-isla-white">Documents</h1>
        <p className="text-sm text-isla-muted mt-1">All document access is scoped to your organization.</p>
      </div>

      <GlassCard hover={false}>
        <div className="text-xs text-isla-pacific mono mb-2">Effective Query Scope</div>
        <div className="text-xs mono text-isla-muted bg-isla-volcanic rounded p-2">
          model: Document<br />
          where:<br />
          &nbsp;&nbsp;organizationId: &quot;{user.orgId ?? 'all (SYSTEM_ADMIN)'}&quot;
        </div>
      </GlassCard>

      <GlassCard hover={false}>
        <h2 className="text-sm font-semibold text-isla-white mb-3">Create Document</h2>
        <form action={createDocument} className="space-y-3">
          <input name="title" placeholder="Document title" required
            className="w-full rounded-lg bg-isla-volcanic border border-isla-border px-3 py-2 text-sm text-isla-white placeholder:text-isla-muted focus:outline-none focus:border-isla-amethyst transition-colors" />
          <textarea name="body" placeholder="Document content" rows={6} required
            className="w-full rounded-lg bg-isla-volcanic border border-isla-border px-3 py-2 text-sm text-isla-white placeholder:text-isla-muted font-mono focus:outline-none focus:border-isla-amethyst transition-colors" />
          <button type="submit" className="rounded-lg bg-isla-amethyst px-4 py-2 text-sm text-white hover:bg-isla-amethyst/90 transition-colors">
            Create Document
          </button>
        </form>
      </GlassCard>

      <div className="space-y-3">
        {documents.map((doc: any) => (
          <GlassCard key={doc.id} hover={false}>
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Link href={`/documents/${doc.id}`} className="font-medium text-sm text-isla-white hover:text-isla-pacific transition-colors">{doc.title}</Link>
                  <Badge variant={doc.status === 'ACTIVE' ? 'audit' : 'tenant'}>{doc.status}</Badge>
                </div>
                <p className="text-xs text-isla-muted whitespace-pre-wrap line-clamp-2">{doc.body}</p>
                <div className="mt-2 text-xs text-isla-muted flex gap-3">
                  <span>By {doc.uploadedBy.name}</span>
                  <span className="mono">{new Date(doc.createdAt).toLocaleString()}</span>
                  {user.role === 'SYSTEM_ADMIN' && (
                    <Badge variant="tenant">{doc.organization.name}</Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <form action={deleteDocument.bind(null, doc.id)}>
                  <button type="submit" className="text-xs text-isla-danger hover:underline">Delete</button>
                </form>
              </div>
            </div>
          </GlassCard>
        ))}
        {documents.length === 0 && (
          <p className="text-center text-sm text-isla-muted py-8">No documents yet.</p>
        )}
      </div>
    </div>
  )
}
