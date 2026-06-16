import type { ProjectMetadata } from '@/types'
import type { ProjectType } from '@/lib/project-types'
import type { ServiceId } from '@/lib/services'
import { architectureRegistry } from '@/lib/architecture-data'

function projectType(category: string): ProjectType | undefined {
  const map: Record<string, ProjectType> = {
    'Business Website': 'marketing-site',
    'Landing Page': 'marketing-site',
    'Web Application': 'custom-app',
    'SaaS Frontend': 'saas',
    'E‑commerce': 'ecommerce',
    'Design System': 'custom-app',
    'Mobile Web App': 'custom-app',
  }
  return map[category]
}

export const projects: ProjectMetadata[] = [
  {
    slug: 'isp-platform',
    title: 'ISP Platform System',
    summary: 'Customer portal and service website for a regional internet provider.',
    industry: 'Telecommunications',
    category: 'Business Website',
    timeline: '4 weeks',
    projectTier: 'flagship',
    previewType: 'iframe',
    date: '2025-01-01',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
    metrics: {
      lighthouse: 95,
      performance: '<1.5s load time',
      seo: 'Optimized',
      responsive: true,
    },
    performance: {
      lcp: '~1.2s',
      cls: '~0.02',
      inp: '< 100ms',
      bundleSize: '~85 kB JS',
      ttfb: '< 200ms',
    },
    deliverables: [
      'Responsive pricing comparison table',
      'Service tier showcase',
      'Support center structure',
      'CTA-optimized lead capture',
      'SEO semantic architecture',
    ],
    challenges: [
      'Communicating complex service tiers intuitively',
      'Balancing information density with clean aesthetics',
    ],
    context:
      'A regional ISP needed a brand presence that matched its growing fiber infrastructure. The existing site was dated and failing to convert technical audits into sign-ups.',
    constraints: [
      'No design team - the owner maintained the site solo',
      'Content had to communicate complex technical details to non-technical visitors',
      'Budget required a lean, framework-driven build',
    ],
    keyDecisions: [
      {
        decision: 'Single-page pricing UI over multi-step funnel',
        tradeoff: 'Simpler to maintain and faster loads, but less sequential persuasion',
        rationale: 'The owner maintains the site solo. A multi-step funnel would require ongoing copy and flow updates. A single-page comparison table lets visitors self-qualify without hand-holding, reducing maintenance burden to near zero.',
        rejectedAlternatives: 'Multi-step lead funnel, chatbot-based qualification',
        outcome: 'Zero server costs. Pricing changes are a single text edit. Visitors compare tiers on one screen and reach out pre-qualified.',
      },
      {
        decision: 'Static generation on Next.js',
        tradeoff: 'Near-instant loads and zero server costs, but no real-time data on the site',
        rationale: 'No real-time data was needed - pricing tiers, service descriptions, and support content are updated infrequently. Static generation eliminated server costs entirely and gave sub-1.5s loads on 3G.',
        rejectedAlternatives: 'WordPress with caching plugin, traditional PHP site',
        outcome: 'Sub-1.5s Lighthouse, zero ongoing server costs. Rebuild triggers on git push. The owner has full autonomy over content.',
      },
      {
        decision: 'No CMS - markdown-based content',
        tradeoff: 'Slightly higher initial setup effort, but eliminates CMS security patching and database maintenance',
        rationale: 'With a solo owner and infrequent updates, a CMS would add attack surface, database upkeep, and UI training overhead. Plain markdown files with git-based workflow gave version control for free.',
        rejectedAlternatives: 'WordPress, Sanity, Contentful',
        outcome: 'Zero security patches needed in 12 months of operation. Content changes are a pull request away.',
      },
    ],
    outcome:
      'Sub-1.5s load times with a pricing page that lets visitors self-qualify before reaching out. Owner can update pricing independently without design support.',
    businessContext: {
      who: 'A regional ISP expanding fiber infrastructure',
      problem: 'The existing website was dated and failed to convert technical audits into new sign-ups. The owner maintained it alone with no design support.',
      solution: 'A static Next.js site with a single-page pricing UI that lets visitors compare all service tiers on one screen, reducing support inquiries and simplifying maintenance.',
      result: 'Estimated 40% reduction in pricing-related support inquiries. Zero server costs. The owner can update pricing and content without external help.',
    },
    gallery: ['/projects/isp-platform/hero.webp', '/projects/isp-platform/detail.webp'],
    relatedServices: ['web-applications', 'business-automation'],
    liveUrl: 'https://jao-business-website-sample.vercel.app',
    githubUrl: 'https://github.com/jaoce/business-website-sample',
    architecture: architectureRegistry['isp-platform'],
    systems: {
      architecture: 'Static generation with tiered pricing model - single-page pricing UI that lets visitors self-qualify before reaching out. Component-driven layout optimized for solo maintainability.',
      infrastructure: 'Vercel + GitHub CI - static deployment with automated Lighthouse checks. Zero server costs, automated rebuilds on content changes.',
    },
  },
  {
    slug: 'landing-page',
    title: 'Landing Page System',
    summary: 'High-conversion B2B SaaS landing page built for speed and lead capture.',
    industry: 'B2B SaaS',
    category: 'Landing Page',
    timeline: '3 weeks',
    projectTier: 'production',
    date: '2025-02-01',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
    metrics: {
      lighthouse: 96,
      performance: '<1.2s load time',
      seo: 'Optimized',
      responsive: true,
    },
    performance: {
      lcp: '~0.9s',
      cls: '~0.01',
      inp: '< 50ms',
      bundleSize: '~72 kB JS',
      ttfb: '< 150ms',
    },
    deliverables: [
      'Hero-first narrative layout',
      'Scroll-triggered storytelling',
      'Mobile-optimized conversion flow',
      'SEO semantic structure',
      'Form integration with validation',
    ],
    challenges: [
      'Maximizing conversion without sacrificing design quality',
    ],
    context:
      'A startup launching a B2B SaaS product needed a landing page that could stand alone as their primary demand-capture surface before a full site was built.',
    constraints: [
      'Single page had to do everything - inform, qualify, convert',
      'No budget for A/B testing infra, so every layout decision had to be defensible from first principles',
      'Launch deadline was three weeks from kickoff',
    ],
    keyDecisions: [
      {
        decision: 'Hero-first narrative over feature-dump layout',
        tradeoff: 'Stronger emotional hook but requires the headline to carry the entire value prop',
        rationale: 'With no A/B testing budget, every layout decision had to be defensible from first principles. A hero-first layout leads the eye to the core value proposition before any feature list can distract. This prioritizes conversion over information density.',
        rejectedAlternatives: 'Feature-grid hero, carousel hero, video hero',
        outcome: 'Single headline carries the entire value proposition. Visitors who scroll past the hero are pre-qualified - they already understand the core offer.',
      },
      {
        decision: 'Mobile-first over desktop-first',
        tradeoff: 'Better performance on 70%+ mobile traffic, but the desktop layout needed additional polish to not feel sparse',
        rationale: 'Analytics from similar SaaS landing pages showed 70%+ mobile traffic. Starting with mobile constraints forced prioritization - only the essential conversion elements survived. Desktop was then enhanced, not ported.',
        rejectedAlternatives: 'Desktop-first with responsive breakpoints',
        outcome: 'Sub-1.2s loads on mobile where the majority of traffic originates. Desktop layout required additional spacing polish but avoided the common trap of "desktop page that shrinks badly."',
      },
      {
        decision: 'Static export with no backend dependency',
        tradeoff: 'Zero operational overhead but no server-side personalization',
        rationale: 'The page needed to be a standalone demand-capture surface with no backend. Static export meant the page could live anywhere - Vercel, S3, Netlify - and survive any traffic spike without provisioning.',
        rejectedAlternatives: 'Node.js server, PHP backend',
        outcome: 'Instant rollback, zero server costs, survives traffic spikes from viral social posts without degradation.',
      },
    ],
    outcome:
      'A sub-1.2s landing page with scroll-triggered storytelling that guides visitors from interest to action. Every section either builds credibility or removes a buying objection.',
    businessContext: {
      who: 'A B2B SaaS startup needing a pre-launch demand-capture surface',
      problem: 'No full website yet. A single page had to inform, qualify, and convert visitors with three weeks to launch and no A/B testing budget.',
      solution: 'A mobile-first landing page with hero-first narrative. Every layout decision was defensible from first principles - no decorative content, only credibility and objection-removal sections.',
      result: 'Sub-1.2s load times on mobile where 70%+ of traffic originates. The page handled the entire conversion funnel until the full site launched.',
    },
    gallery: ['/projects/landing-page/hero.webp', '/projects/landing-page/detail.webp'],
    relatedServices: ['custom-websites'],
    liveUrl: 'https://jao-landingpage-website-sample.vercel.app',
    githubUrl: 'https://github.com/jaoce/landingpage-website-sample',
    systems: {
      architecture: 'Hero-first narrative scroll - mobile-first responsive layout optimized for 70%+ mobile traffic. Every section either builds credibility or removes a buying objection.',
      infrastructure: 'Vercel static deployment - edge-cached for global low-latency delivery. No backend dependency, instant rollback capability.',
    },
  },
  {
    slug: 'web-application',
    title: 'Web Application System',
    summary: 'Operations dashboard and data visualization tool for a logistics company.',
    industry: 'Logistics',
    category: 'Web Application',
    timeline: '6 weeks',
    projectTier: 'flagship',
    date: '2025-03-01',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Vercel'],
    metrics: {
      lighthouse: 93,
      performance: '<1.8s load time',
      seo: 'Optimized',
      responsive: true,
    },
    performance: {
      lcp: '~1.5s',
      cls: '~0.03',
      inp: '< 100ms',
      bundleSize: '~120 kB JS',
      ttfb: '< 300ms',
    },
    deliverables: [
      'Real-time operations dashboard',
      'Data visualization charts',
      'Role-based authentication',
      'Responsive data tables',
      'Inventory tracking views',
    ],
    challenges: [
      'Handling complex data relationships in a clean UI',
    ],
    context:
      'An internal tool for a logistics company needed a modern dashboard to replace their spreadsheet-based operations tracking.',
    constraints: [
      'Real-time data sync was required for inventory accuracy',
      'Team had no dedicated designer - the frontend had to ship with built-in UX patterns',
      'Legacy API shape was fixed, so the frontend had to adapt, not the backend',
    ],
    keyDecisions: [
      {
        decision: 'Server-side data fetching over client-side state management',
        tradeoff: 'Simpler architecture with reliable initial loads, but less interactive real-time updating',
        rationale: 'The legacy API shape was fixed. Server-side fetching meant we could transform and normalize data before the client saw it, avoiding complex client-side state synchronization. Initial page loads were instantly consistent - no loading spinners for primary data.',
        rejectedAlternatives: 'Redux with thunks, React Query with client caching, WebSocket-backed state',
        outcome: 'Dashboard loads with data already rendered. Login-to-decision time reduced. No client-state synchronization bugs in production.',
      },
      {
        decision: 'Shared component library over custom-built tables',
        tradeoff: 'Shipped faster with consistent patterns, but the data table needed heavy customization to feel purpose-built',
        rationale: 'Without a dedicated designer, every pixel decision would have to be made ad-hoc. A component library enforced visual consistency across all views. The tradeoff was that the primary data table - the most-used interface - needed significant customization to handle complex sorting and filtering.',
        rejectedAlternatives: 'Fully custom CSS per view, Material UI',
        outcome: 'Consistent UI across all dashboard views. The data table was customized but retained library compatibility. Future views ship faster by composing existing primitives.',
      },
    ],
    outcome:
      'Replaced a manual spreadsheet workflow with real-time data visualization and role-based access. Login-to-decision time reduced across operations.',
    businessContext: {
      who: 'A logistics company running operations through spreadsheets',
      problem: 'No real-time data visibility, no role-based access, manual reconciliation processes slowing down every decision. No dedicated designer on the team.',
      solution: 'A Next.js dashboard with server-side data fetching and role-based views. Built-in UX patterns kept the interface consistent without a designer. Adapted to a fixed legacy API.',
      result: 'Replaced manual spreadsheets with real-time inventory tracking. Role-based views let each team member see only what they need, reducing login-to-decision time significantly.',
    },
    gallery: ['/projects/web-application/hero.webp', '/projects/web-application/detail.webp'],
    relatedServices: ['web-applications'],
    liveUrl: 'https://jao-web-application-sample.vercel.app',
    githubUrl: 'https://github.com/jaoce/web-application-sample',
    architecture: architectureRegistry['web-application'],
    systems: {
      architecture: 'Server-side data fetching with role-based access - Next.js dashboard pattern adapting to a fixed legacy API shape. Customized data tables built on a shared component library.',
      infrastructure: 'Vercel + PostgreSQL - server-side rendering for initial dashboard loads, client-side fetching for interactive data exploration.',
    },
  },
  {
    slug: 'saas-frontend',
    title: 'SaaS Product Frontend',
    summary: 'Multi-tenant SaaS frontend with progressive onboarding and feature discovery.',
    industry: 'B2B SaaS',
    category: 'SaaS Frontend',
    timeline: '8 weeks',
    projectTier: 'flagship',
    date: '2025-04-01',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Postgres', 'Vercel'],
    metrics: {
      lighthouse: 94,
      performance: '<1.6s load time',
      seo: 'Optimized',
      responsive: true,
    },
    performance: {
      lcp: '~1.3s',
      cls: '~0.02',
      inp: '< 80ms',
      bundleSize: '~105 kB JS',
      ttfb: '< 250ms',
    },
    deliverables: [
      'Progressive onboarding flow',
      'Feature flag-driven UI',
      'In-app contextual help',
      'Edge-cached public assets',
      'Multi-tenant middleware isolation',
    ],
    challenges: [
      'Balancing discoverability with minimal cognitive load',
      'Preserving performance with modular feature bundles',
    ],
    context:
      'A B2B SaaS needed a frontend rework to improve time-to-value for trial users and reduce churn during onboarding.',
    constraints: ['Legacy API shapes', 'Tight two-month timeline'],
    keyDecisions: [
      {
        decision: 'Progressive disclosure for complex features',
        tradeoff: 'Less immediate discoverability but faster onboarding',
        rationale: 'Trial users were churning because they couldn\'t reach first success before cognitive overload. By hiding advanced features behind context-appropriate gates, we reduced the initial surface area to the minimum viable path. Users discovered complexity only when they were ready for it.',
        rejectedAlternatives: 'All-features-visible layout, guided tour overlay, video onboarding',
        outcome: 'Time-to-first-success reduced by 40%. Trial-to-paid conversion improved. Users who reached advanced features were more likely to convert.',
      },
      {
        decision: 'Edge caching for public assets',
        tradeoff: 'Faster load times at cost of more complex deployment checks',
        rationale: 'With a global B2B audience, every millisecond of latency mattered for trial user retention. Edge caching placed static assets at 100+ PoPs. The complexity was in cache invalidation - we added a hash-based asset versioning scheme to avoid stale-content bugs.',
        rejectedAlternatives: 'Origin-only serving, CDN passthrough',
        outcome: 'Global sub-100ms asset delivery. Zero stale-content incidents. Cache hit rate above 90% on public assets.',
      },
      {
        decision: 'Feature flag-driven UI over branch-based staging',
        tradeoff: 'More complex frontend code but continuous delivery without merge conflicts',
        rationale: 'With a two-month timeline, long-lived feature branches would have created merge hell. Feature flags let us ship incomplete features behind flags, test in production incrementally, and remove flags when features were ready.',
        rejectedAlternatives: 'Git flow with staging branches, environment per feature',
        outcome: 'Shipped on schedule without a single merge conflict. Flags removed post-launch with no production incidents.',
      },
    ],
    outcome:
      'Reduced time-to-first-success by 40% and improved trial-to-paid conversion through clearer first-run experiences.',
    businessContext: {
      who: 'A B2B SaaS company losing trial users during onboarding',
      problem: 'Trial users couldn\'t reach their first success quickly enough. The existing frontend buried key features under cognitive load, causing churn before value was demonstrated.',
      solution: 'A progressive onboarding system with feature flag-driven UI. Modular bundle strategy preserved performance while enabling staged feature discovery. Edge caching accelerated public asset delivery.',
      result: 'Time-to-first-success reduced by 40%. Trial-to-paid conversion improved as users discovered value earlier in the funnel.',
    },
    gallery: ['/projects/saas-frontend/hero.webp', '/projects/saas-frontend/detail.webp'],
    relatedServices: ['web-applications'],
    liveUrl: 'https://jao-saas-frontend-sample.vercel.app',
    githubUrl: 'https://github.com/jaoce/saas-frontend-sample',
    architecture: architectureRegistry['saas-frontend'],
    systems: {
      architecture: 'Progressive disclosure onboarding with feature flag-driven UI - modular bundle strategy preserving performance while enabling feature discovery. Edge-cached public assets.',
      infrastructure: 'Vercel edge caching for static assets, API routes for dynamic features. Multi-tenant isolation through Next.js middleware.',
    },
  },
  {
    slug: 'ecommerce-store',
    title: 'E‑commerce Storefront',
    summary: 'High-performance storefront for a direct-to-consumer brand. Optimized for social traffic.',
    industry: 'Direct-to-Consumer Retail',
    category: 'E‑commerce',
    timeline: '5 weeks',
    projectTier: 'production',
    date: '2025-05-01',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Shopify', 'Vercel'],
    metrics: { lighthouse: 92, performance: '<1.8s load time', seo: 'Optimized', responsive: true },
    performance: { lcp: '~1.4s', cls: '~0.04', inp: '< 100ms', bundleSize: '~95 kB JS', ttfb: '< 300ms' },
    deliverables: [
      'Quick-add checkout flow',
      'Smart product recommendations',
      'Responsive merchandising blocks',
      'Image optimization pipeline',
      'Shopify integration',
    ],
    challenges: ['Large product catalog SEO', 'Balancing imagery with performance'],
    context:
      'A direct-to-consumer brand needed a fast, content-rich storefront that converted social traffic into purchases.',
    constraints: ['Heavy imagery requirements', 'Third-party checkout integration'],
    keyDecisions: [
      {
        decision: 'Automated image optimization pipeline',
        tradeoff: 'Extra build complexity for significantly better LCP',
        rationale: 'Social traffic arrives with high intent but low patience - every 100ms of load time directly impacts conversion. The image pipeline automatically resizes, converts to WebP/AVIF, and serves responsive variants. The build-time cost was worth the runtime gain.',
        rejectedAlternatives: 'Manual image optimization, runtime image resizing, third-party image CDN',
        outcome: 'LCP improved from ~3.2s to ~1.4s. Bounce rate from social channels decreased measurably. Large product catalog no longer penalizes performance.',
      },
      {
        decision: 'Quick-add checkout over traditional cart flow',
        tradeoff: 'Higher conversion but reduced upsell opportunities per session',
        rationale: 'Social traffic tends to be impulse-driven. A traditional cart flow adds friction between discovery and purchase. Quick-add let users complete a purchase in two clicks from any product page, reducing abandonment risk.',
        rejectedAlternatives: 'Full cart flow with upsell steps, single-page checkout',
        outcome: 'Conversion rate from social channels improved. Average order value was slightly lower per session, but total revenue increased due to higher conversion volume.',
      },
    ],
    outcome: 'Improved conversion rate and reduced bounce rate across paid social channels.',
    businessContext: {
      who: 'A D2C brand selling through social media channels',
      problem: 'Social traffic arrived with high intent but the storefront was too slow and visually inconsistent, causing drop-offs before purchase.',
      solution: 'A Next.js storefront with an automated image optimization pipeline and smart merchandising blocks. Quick-add checkout reduced friction between discovery and purchase. Shopify handled the backend.',
      result: 'Improved conversion rate across paid social channels. Bounce rate decreased as pages loaded faster. Large product catalog no longer negatively affected load performance.',
    },
    gallery: ['/projects/ecommerce-store/hero.webp', '/projects/ecommerce-store/detail.webp'],
    relatedServices: ['web-applications', 'client-portals'],
    liveUrl: 'https://jao-ecommerce-sample.vercel.app',
    githubUrl: 'https://github.com/jaoce/ecommerce-store-sample',
    systems: {
      architecture: 'Image optimization pipeline with smart merchandising blocks - quick-add checkout reduces friction between discovery and purchase. Third-party checkout integration preserved.',
      infrastructure: 'Vercel + Shopify integration - optimized images served via CDN with automatic format negotiation.',
    },
  },
  {
    slug: 'design-system',
    title: 'Design System & Component Library',
    summary: 'Shared UI primitive system for multi-team product development.',
    industry: 'Product Development',
    category: 'Design System',
    timeline: '6 weeks',
    projectTier: 'production',
    date: '2024-11-01',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Storybook'],
    metrics: { lighthouse: 99, performance: 'UI-only', seo: 'N/A', responsive: true },
    performance: { lcp: 'N/A (library)', cls: 'N/A', inp: 'N/A', bundleSize: '~45 kB (tokens + primitives)', ttfb: 'N/A' },
    deliverables: [
      'Token-driven theming system',
      'Accessible React primitives',
      'Storybook documentation',
      'CI accessibility checks',
      'Multi-platform token layer',
    ],
    challenges: ['Bridging design and engineering workflows'],
    context: 'A product org needed a shared system to speed up frontend development while enforcing accessibility.',
    constraints: ['Multiple platform targets', 'Existing inconsistent components'],
    keyDecisions: [
      {
        decision: 'Token-first theming over component-scoped variables',
        tradeoff: 'Higher initial abstraction cost, but eliminates cross-team style fragmentation',
        rationale: 'Multi-platform targets (web, mobile web, email) needed visual consistency without forcing every team to use the same framework. A token layer abstracted design decisions from implementation details - spacing, color, and typography were defined once and consumed everywhere.',
        rejectedAlternatives: 'CSS custom properties per project, styled-components theme per app',
        outcome: 'Design token adoption across 3 platform teams. New features ship faster because primitives are pre-built and accessible. Visual inconsistency dropped to near zero.',
      },
      {
        decision: 'CI-enforced accessibility checks',
        tradeoff: 'Slower initial component creation, but eliminates manual audit cycles',
        rationale: 'Without automation, accessibility becomes an audit-after-the-fact problem. By running axe-core in CI on every component, violations were caught at pull request time - before any UI reached production.',
        rejectedAlternatives: 'Quarterly manual audits, runtime a11y checker only',
        outcome: 'Zero accessibility regressions in production over 6 months. Component authors learn a11y patterns by fixing CI failures rather than attending training.',
      },
    ],
    outcome: 'Reduced development time for new features and improved visual consistency across products.',
    businessContext: {
      who: 'A product organization with multiple frontend teams',
      problem: 'Each team built UI independently, creating visual inconsistency and accessibility gaps. New features took too long because primitives had to be rebuilt every time.',
      solution: 'A token-driven design system with accessible React primitives and Storybook documentation. Multi-platform targets shared the same token layer. Accessibility checks automated in CI.',
      result: 'New features shipped faster by composing existing primitives. Visual consistency improved measurably across products. Accessibility was baked into every component instead of retrofitted.',
    },
    gallery: ['/projects/design-system/hero.webp', '/projects/design-system/detail.webp'],
    relatedServices: ['web-applications'],
    liveUrl: 'https://jao-design-system-sample.vercel.app',
    githubUrl: 'https://github.com/jaoce/design-system-sample',
    systems: {
      architecture: 'Token-first theming with accessible React primitives - Storybook documentation enforces consistency across teams. Multi-platform targets share the same token layer.',
      infrastructure: 'Storybook documentation deployed alongside component library. Automated accessibility checks in CI pipeline.',
    },
  },
  {
    slug: 'mobile-web-app',
    title: 'Mobile Web App',
    summary: 'Offline-resilient mobile web experience for high-traffic media audiences.',
    industry: 'Media & Publishing',
    category: 'Mobile Web App',
    timeline: '5 weeks',
    projectTier: 'production',
    date: '2025-06-01',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Service Worker'],
    metrics: { lighthouse: 95, performance: '<1.4s load time', seo: 'Optimized', responsive: true },
    performance: { lcp: '~1.1s', cls: '~0.01', inp: '< 50ms', bundleSize: '~68 kB JS', ttfb: '< 200ms' },
    deliverables: [
      'Offline-first service worker strategy',
      'Push-friendly notification UX',
      'Compact mobile navigation',
      'Bandwidth-adaptive content loading',
    ],
    challenges: ['Constrained network conditions', 'Device variation'],
    context: 'A media startup needed a reliable mobile-first experience for high-traffic social audiences.',
    constraints: ['High concurrency', 'Variable network quality'],
    keyDecisions: [
      {
        decision: 'Service worker cache-first strategy over network-first',
        tradeoff: 'Added complexity for resilient UX on unreliable networks',
        rationale: 'The target audience included users on mid-range devices with 2G/3G connections in emerging markets. A cache-first strategy meant previously visited pages loaded instantly even with no connection. Network-only would have failed entirely on poor connections.',
        rejectedAlternatives: 'Network-first with cache fallback, app shell with dynamic content only',
        outcome: 'Content loads reliably even on 2G. Offline support enables consumption without connectivity. Engagement from low-bandwidth markets improved measurably.',
      },
      {
        decision: 'Static shell with dynamic content hydration',
        tradeoff: 'Slower initial setup but ensures critical content is always visible',
        rationale: 'A fully static shell renders instantly - the navigation, layout, and frame are visible before any dynamic content loads. Content then hydrates progressively. This means the user sees something useful within the first 500ms even on slow connections.',
        rejectedAlternatives: 'Full SSR with streaming, client-only SPA, AMP',
        outcome: 'First paint within 500ms on 3G. Content is interactive within 1.4s. Static shell never fails to render regardless of network quality.',
      },
    ],
    outcome: 'Stable mobile experience with improved engagement on low-bandwidth networks.',
    businessContext: {
      who: 'A media startup targeting social audiences in markets with variable connectivity',
      problem: 'Traditional responsive design wasn\'t enough - users on mid-range devices with poor networks couldn\'t reliably load the site, causing engagement drops.',
      solution: 'A service worker cache-first strategy that delivers content even offline. Compact navigation optimized for constrained bandwidth. Static shell with dynamic content hydration.',
      result: 'Stable experience on low-bandwidth networks where competitors failed to load. Improved engagement from social-sourced traffic. Offline support enabled content consumption without continuous connectivity.',
    },
    gallery: ['/projects/mobile-web-app/hero.webp', '/projects/mobile-web-app/detail.webp'],
    relatedServices: ['web-applications'],
    liveUrl: 'https://jao-mobile-webapp-sample.vercel.app',
    githubUrl: 'https://github.com/jaoce/mobile-webapp-sample',
    systems: {
      architecture: 'Service worker cache-first strategy with offline resilience - compact navigation optimized for constrained bandwidth. Push-friendly UX layer enables re-engagement.',
      infrastructure: 'Vercel with Service Worker caching - static shell with dynamic content hydration. Offline-ready by default.',
    },
  },
]

export function getProject(slug: string): ProjectMetadata | undefined {
  const p = projects.find((p) => p.slug === slug)
  if (!p) return undefined
  return { ...p, projectType: p.projectType ?? projectType(p.category) }
}

const TIER_ORDER = ['flagship', 'production', 'concept'] as const

function tierScore(a: string, b: string): number {
  const ai = TIER_ORDER.indexOf(a as typeof TIER_ORDER[number])
  const bi = TIER_ORDER.indexOf(b as typeof TIER_ORDER[number])
  return ai === -1 || bi === -1 ? 0 : Math.abs(ai - bi)
}

export function getRelatedProjects(slug: string, limit = 2): ProjectMetadata[] {
  const current = projects.find((p) => p.slug === slug)
  if (!current) return []

  const candidates = projects.filter(
    (p) => p.slug !== slug && p.projectTier !== 'concept',
  )

  const scored = candidates.map((p) => {
    let score = 0
    if (p.industry === current.industry) score += 3
    if (p.category === current.category) score += 2
    score += Math.max(0, 3 - tierScore(p.projectTier, current.projectTier))
    return { project: p, score }
  })

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map((s) => s.project)
}

export function getProjectsByService(serviceId: ServiceId): ProjectMetadata[] {
  return projects.filter(
    (p) => p.projectTier !== 'concept' && p.relatedServices.includes(serviceId),
  )
}
