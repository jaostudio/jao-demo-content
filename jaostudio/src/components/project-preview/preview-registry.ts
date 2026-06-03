export interface PreviewConfig {
  type: 'screenshot' | 'iframe'
  url?: string
  aspectRatio?: string
}

const previewDefaults: Record<string, PreviewConfig> = {
  'isp-platform': { type: 'iframe', url: 'https://jao-business-website-sample.vercel.app' },
  'landing-page': { type: 'iframe', url: 'https://jao-landingpage-website-sample.vercel.app' },
  'web-application': { type: 'iframe', url: 'https://jao-web-application-sample.vercel.app' },
  'saas-frontend': { type: 'iframe', url: 'https://jao-saas-frontend-sample.vercel.app' },
  'ecommerce-store': { type: 'iframe', url: 'https://jao-ecommerce-sample.vercel.app' },
  'design-system': { type: 'iframe', url: 'https://jao-design-system-sample.vercel.app' },
  'mobile-web-app': { type: 'iframe', url: 'https://jao-mobile-webapp-sample.vercel.app' },
}

export function getPreviewConfig(slug: string): PreviewConfig {
  return previewDefaults[slug] ?? { type: 'screenshot' }
}
