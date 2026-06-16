import { fetchAPI } from '@/lib/api/server'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jaostudio.dev'

export async function GET() {
  const articles = await fetchAPI<any[]>('/api/articles')

  const items = articles
    .map(
      (a) => {
        const pubDate = a.publishAt ? new Date(a.publishAt).toUTCString() : new Date(a.createdAt).toUTCString()
        const url = `${SITE_URL}/articles/${a.slug}`
        return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid>${escapeXml(url)}</guid>
      <description>${escapeXml(a.excerpt ?? '')}</description>
      <pubDate>${pubDate}</pubDate>
      <dc:creator>${escapeXml(a.authorName)}</dc:creator>
      <category>${escapeXml(a.categoryName)}</category>
    </item>`
      },
    )
    .join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Likha</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>Latest published articles from Likha</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}

function escapeXml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}
