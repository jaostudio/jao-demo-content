import { permanentRedirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ArticleRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  permanentRedirect(`/work/${slug}`)
}
