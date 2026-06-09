import { ImageResponse } from 'next/og'
import { OGTemplate } from '@/components/seo/og-image-template'
import { ogContent } from '@/lib/seo/og-content'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <OGTemplate {...ogContent.home} />,
    { ...size },
  )
}
