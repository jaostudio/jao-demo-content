import { getCurrentUser } from '@/lib/auth/get-session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { createDocument, deleteDocument } from '@/lib/actions'

export const dynamic = 'force-dynamic'

export default async function DocumentsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/signin')
  if (!user.orgId && user.role !== 'SYSTEM_ADMIN') redirect('/dashboard')

  const where = user.role === 'SYSTEM_ADMIN' ? {} : { organizationId: user.orgId }
  const documents = await (prisma as any).document.findMany({
    where,
    include: { uploadedBy: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-bold">Secure Documents</h1>
        <p className="mb-8 text-sm text-gray-500">All document access is scoped to your organization.</p>

        <div className="mb-8 rounded-lg border p-6">
          <h2 className="mb-4 font-semibold">Upload Document</h2>
          <form action={createDocument} className="space-y-3">
            <input name="title" placeholder="Document title" required
              className="w-full rounded-lg border px-3 py-2 text-sm" />
            <textarea name="body" placeholder="Document content" rows={6} required
              className="w-full rounded-lg border px-3 py-2 text-sm font-mono" />
            <button type="submit" className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700">Create</button>
          </form>
        </div>

        <div className="space-y-3">
          {documents.map((doc: any) => (
            <div key={doc.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{doc.title}</h3>
                  <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{doc.body}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${doc.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {doc.status}
                  </span>
                  <form action={deleteDocument.bind(null, doc.id)}>
                    <button type="submit" className="text-xs text-red-600 hover:underline">Delete</button>
                  </form>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Uploaded by {doc.uploadedBy.name} · {new Date(doc.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
          {documents.length === 0 && (
            <p className="text-center text-sm text-gray-500 py-8">No documents yet.</p>
          )}
        </div>
      </main>
    </>
  )
}
