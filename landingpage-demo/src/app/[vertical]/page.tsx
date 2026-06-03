import { notFound } from 'next/navigation'
import { verticals } from '../../content'
import { VerticalPageClient } from './vertical-page-client'

export function generateStaticParams() {
  return Object.keys(verticals).map((slug) => ({ vertical: slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ vertical: string }> }) {
  const resolved = await params
  const v = verticals[resolved.vertical]
  if (!v) return {}
  return { title: `${v.name} | ${v.tagline}`, description: v.description }
}

export default async function VerticalPage({ params }: { params: Promise<{ vertical: string }> }) {
  const resolved = await params
  const content = verticals[resolved.vertical]
  if (!content) notFound()

  return <VerticalPageClient content={content} />
}
