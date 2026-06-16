import { Suspense } from 'react'
import type { SystemContent } from '@/components/sections/active-system-view'
import { SystemProvider } from '@/components/layout/system-provider'
import { Badge } from '@/components/typography/badge'
import { LayeredFrame } from '@/components/ui/layout/layered-frame'
import { getTranslations } from 'next-intl/server'
import { DemosClient } from './demos-client'
import { SYSTEMS } from '@/lib/systems'
import { projects } from '@/lib/projects'
import { ORG_ID, WEBSITE_ID } from '@/lib/json-ld-ids'

export async function generateMetadata() {
  return {
    title: 'Business Systems for Real Operations | JAOstudio',
    description: 'Six production-ready platforms for lead generation, revenue operations, multi-vendor marketplaces, editorial workflow, internal operations, and compliance.',
  }
}

const SYSTEM_DETAILS: Record<string, Omit<SystemContent, 'proof'>> = {
  landing: {
    uiLabel: 'Get More Customers',
    name: 'Lead Generation Platform',
    category: 'growth',
    outcome: 'Convert website traffic into qualified leads and booked appointments across multiple service verticals - without manual follow-up.',
    description: 'Turn visitors into booked appointments. A multi-industry lead generation system with vertical-specific engines.',
    useCase: 'Service businesses - dental, construction, real estate - that need to convert website visitors into qualified leads and booked appointments.',
    features: ['Industry vertical engine', 'Lead capture forms', 'SEO-optimized content', '7-section conversion funnel', 'Appointment scheduling integration'],
    url: 'https://jao-demo-landing.vercel.app',
    screenshot: '/images/demos/landing-hero.png',
  },
  commerce: {
    uiLabel: 'Increase Revenue',
    name: 'Revenue Operations Platform',
    category: 'revenue',
    outcome: 'Turn more visitors into customers with a unified commerce system that manages products, checkout, and fulfillment in one workflow.',
    description: 'From catalog to delivery, one platform. A full e-commerce system with persistent cart, checkout, and order management.',
    useCase: 'Growing ecommerce businesses that need a unified platform from product catalog through delivery tracking.',
    features: ['Product catalog with variants', 'Persistent shopping cart', 'Checkout flow', 'Order management dashboard', 'Inventory tracking'],
    url: 'https://jao-demo-commerce.vercel.app',
    screenshot: '/images/demos/commerce-hero.png',
  },
  marketplace: {
    uiLabel: 'Sell Online',
    name: 'Multi-Vendor Commerce Platform',
    category: 'platform',
    outcome: 'Run a marketplace business from a single dashboard - onboard vendors, manage listings, and process multi-vendor transactions.',
    description: 'Run a marketplace, not a spreadsheet of vendors. A multi-tenant platform connecting buyers with independent vendors.',
    useCase: 'Platform businesses that need to onboard vendors, manage listings, and process multi-vendor transactions.',
    features: ['Vendor onboarding workflow', 'Multi-vendor cart', 'Listing moderation', 'Role-based dashboards', 'Commission tracking'],
    url: 'https://jao-demo-marketplace.vercel.app',
    screenshot: '/images/demos/marketplace-hero.png',
  },
  content: {
    uiLabel: 'Manage Content',
    name: 'Editorial Workflow Platform',
    category: 'publishing',
    outcome: 'Move content from pitch to publication through a structured editorial workflow with role-based approvals and scheduling.',
    description: 'From pitch to publish, tracked at every state. An editorial state machine for content teams and publishers.',
    useCase: 'Content teams and editorial departments that need structured workflows from pitch through publication.',
    features: ['Editorial state machine', 'Author/Admin roles', 'Category management', 'ISR-powered public pages', 'Content scheduling'],
    url: 'https://jao-demo-content.vercel.app',
    screenshot: '/images/demos/content-hero.png',
  },
  webapp: {
    uiLabel: 'Run Your Operations',
    name: 'Internal Operations Platform',
    category: 'operations',
    outcome: 'Keep multiple business units running smoothly with task management, kanban boards, and role-based permissions across your organization.',
    description: 'One platform for every org in your company. A multi-tenant operations system with task management and RBAC.',
    useCase: 'Operations teams managing multiple business units who need a unified internal platform.',
    features: ['Multi-tenant orgs', 'Kanban boards', 'Task management', 'Org-level RBAC', 'Activity audit log'],
    url: 'https://jao-demo-webapp.vercel.app',
    screenshot: '/images/demos/webapp-hero.png',
  },
  security: {
    uiLabel: 'Secure Your Business',
    name: 'Compliance & Audit Platform',
    category: 'governance',
    outcome: 'Track every action, permission change, and access event across your organization with immutable audit trails and role-based controls.',
    description: 'Who did what, when - and who allowed it. A compliance system with audit trails, role hierarchy, and data isolation.',
    useCase: 'Compliance officers and IT administrators who need granular access control and immutable audit trails.',
    features: ['Immutable audit trail', 'Role hierarchy', 'Data isolation per tenant', 'Security headers', 'Access request workflow'],
    url: 'https://jao-demo-security.vercel.app',
    screenshot: '/images/demos/security-hero.png',
  },
}

const projectToSystem: Record<string, string> = {
  'isp-platform': 'commerce',
  'landing-page': 'landing',
  'web-application': 'webapp',
  'saas-frontend': 'marketplace',
  'ecommerce-store': 'commerce',
  'design-system': 'webapp',
  'mobile-web-app': 'content',
}

function buildProofs(): Record<string, SystemContent['proof']> {
  const proofs: Record<string, SystemContent['proof']> = {}
  for (const p of projects) {
    const systemId = projectToSystem[p.slug]
    if (!systemId) continue
    if (!p.businessContext) continue
    if (!proofs[systemId]) proofs[systemId] = []
    proofs[systemId].push({
      title: p.title,
      context: p.businessContext.problem,
      outcome: p.businessContext.result,
    })
  }
  return proofs
}

const PROOFS = buildProofs()

const SYSTEMS_WITH_PROOFS: Record<string, SystemContent> = Object.fromEntries(
  Object.entries(SYSTEM_DETAILS).map(([id, detail]) => [
    id,
    { ...detail, proof: PROOFS[id] ?? [] },
  ]),
)

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${ORG_ID}/#demos`,
      url: 'https://jaostudio.dev/demos',
      name: 'Business Systems for Real Operations | JAOstudio',
      isPartOf: { '@id': WEBSITE_ID },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaostudio.dev' },
        { '@type': 'ListItem', position: 2, name: 'Demos', item: 'https://jaostudio.dev/demos' },
      ],
    },
  ],
}

export default async function DemosPage() {
  const t = await getTranslations('demos')
  return (
    <SystemProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative pt-20 lg:pt-28">
        <LayeredFrame glow>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <Badge variant="accent">{t('badge')}</Badge>
            <h1 className="text-[var(--text-hero)] font-[var(--weight-medium)] leading-[var(--leading-display)] tracking-[var(--tracking-tight)] text-text-primary">
              {t('heading')}
            </h1>
            <p className="max-w-2xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
              {t('description')}
            </p>
          </div>
        </LayeredFrame>
      </section>

      <Suspense fallback={null}>
        <DemosClient
          systems={SYSTEMS.map((s) => ({ id: s.id }))}
          systemDetails={SYSTEMS_WITH_PROOFS}
        />
      </Suspense>
    </SystemProvider>
  )
}
