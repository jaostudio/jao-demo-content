import type { CaseStudy } from './types'

export const ecommercePlatform: CaseStudy = {
  slug: 'ecommerce-platform',
  title: 'Speed-to-Purchase: Optimizing a D2C Storefront for Social Traffic',
  industry: 'Direct-to-Consumer Retail',
  status: 'published',
  featured: true,
  relatedProject: 'ecommerce-store',
  challenge:
    'A direct-to-consumer brand was driving significant traffic from paid social channels, but the storefront could not convert it. Pages loaded in over 3 seconds, the product catalog was visually inconsistent, and the checkout flow required too many steps for impulse-driven social visitors. High ad spend was yielding diminishing returns because the site itself was the bottleneck.',
  constraints: [
    'Heavy imagery was non-negotiable — the product catalog relied on high-resolution photography to drive purchase confidence',
    'The existing Shopify backend could not be replaced, so any solution had to integrate with the third-party checkout flow',
    'Social traffic is inherently low-patience — every 100ms of additional load time directly impacted conversion rates',
    'The product catalog was large and growing, meaning any per-product optimization had to be automated, not manual',
  ],
  solution:
    'Built an automated image optimization pipeline that resized, converted to modern formats (WebP/AVIF), and served responsive variants without manual intervention. A quick-add checkout flow reduced the purchase path to two clicks from any product page. Smart merchandising blocks surfaced contextually relevant products.',
  outcome:
    'LCP dropped from 3.2s to 1.4s, and bounce rate from social channels decreased measurably. The quick-add flow improved conversion rate despite slightly lower average order value — total revenue increased because more visitors completed purchases. The image pipeline scaled automatically as new products were added.',
  lessons: [
    'Image optimization was the highest-leverage performance investment. The automated pipeline meant every future product would benefit without manual effort. This is the kind of upfront investment that compounds.',
    'The quick-add tradeoff (lower AOV, higher conversion volume) was the right call for social traffic patterns. Measuring total revenue instead of per-session metrics revealed the true impact.',
    'Shopify integration constrained the frontend significantly, but it also eliminated the need to build and maintain a backend. The tradeoff was worth it — the team could focus entirely on the frontend experience.',
  ],
  relatedServices: ['web-applications', 'client-portals'],
  relatedDemos: ['commerce'],
  architectureSummary:
    'Next.js storefront with automated image optimization pipeline. Shopify handled backend commerce logic while the frontend focused on speed and conversion. Quick-add checkout minimized the purchase path for impulse-driven social traffic.',
  metrics: [
    { label: 'LCP improvement', value: '3.2s → 1.4s' },
    { label: 'Checkout steps', value: '2 clicks' },
    { label: 'Image formats', value: 'WebP / AVIF' },
  ],
}
