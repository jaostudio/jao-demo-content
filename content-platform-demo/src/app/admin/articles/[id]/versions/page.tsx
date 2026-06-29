import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminVersionsRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  redirect(`/studio/work/${id}/versions`)
}
