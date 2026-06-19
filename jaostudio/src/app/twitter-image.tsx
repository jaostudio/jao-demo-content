import { ImageResponse } from 'next/og'
import { OGTemplate } from '@/components/seo/og-image-template'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function TwitterImage() {
  return new ImageResponse(
    <OGTemplate
      badge="JAOstudio"
      title="Custom Websites | Web Applications | Automation Systems"
      subtitle="Built for businesses that need more than templates."
      footer="jaostudio.dev"
    />,
    { ...size },
  )
}
