import type { Metadata } from 'next'
import Link from 'next/link'
import { ActiveSystemView, type SystemContent } from '@/components/sections/active-system-view'
import { SystemProvider } from '@/components/layout/system-provider'
import { SYSTEMS } from '@/lib/systems'
import { projects } from '@/lib/projects'

export const metadata: Metadata = {
  title: 'Production Systems — JAOstudio',
  description: 'Six live systems that solve real business problems: lead generation, revenue operations, multi-vendor marketplaces, editorial workflow, internal operations, and compliance.',
}

const SYSTEM_DETAILS: Record<string, Omit<SystemContent, 'proof'>> = {
  landing: {
    uiLabel: 'Get More Customers',
    name: 'Lead Generation Platform',
    category: 'growth',
    description: 'Turn visitors into booked appointments. A multi-industry lead generation system with vertical-specific engines.',
    useCase: 'Service businesses — dental, construction, real estate — that need to convert website visitors into qualified leads and booked appointments.',
    features: ['Industry vertical engine', 'Lead capture forms', 'SEO-optimized content', '7-section conversion funnel', 'Appointment scheduling integration'],
    url: 'https://jao-demo-landing.vercel.app',
    screenshot: '/images/demos/landing-hero.png',
  },
  commerce: {
    uiLabel: 'Increase Revenue',
    name: 'Revenue Operations Platform',
    category: 'revenue',
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
    description: 'Who did what, when — and who allowed it. A compliance system with audit trails, role hierarchy, and data isolation.',
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
    if (!proofs[systemId]) proofs[systemId] = []
    proofs[systemId].push({
      title: p.title,
      context: p.businessContext?.problem ?? p.context,
      outcome: p.businessContext?.result ?? p.outcome,
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

export default function DemosPage() {
  return (
    <SystemProvider>
      <section className="relative py-[var(--section-py-compact)]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(circle at 50% 0%, rgba(124,58,237,0.08), transparent 60%)' }}
        />
        <div className="mx-auto w-full max-w-7xl px-6 md:px-8 lg:px-12">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <span className="inline-flex min-w-[5rem] items-center justify-center gap-1.5 rounded-full bg-accent-subtle px-3 py-1 text-xs font-medium text-accent">
              Live Demos
            </span>
            <h1 className="text-[var(--text-display)] font-[var(--weight-medium)] leading-[var(--leading-display)] tracking-[var(--tracking-tight)] text-text-primary">
              Production Systems
            </h1>
            <p className="max-w-2xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
              Six live systems that solve real business problems. Each one is independently deployed,
              fully functional, and built on shared architecture.
            </p>
          </div>
        </div>
      </section>

      <section id="systems" className="relative py-[var(--section-py-compact)]">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-8 lg:px-12">
          <ActiveSystemView
            systems={SYSTEMS.map((s) => ({ id: s.id }))}
            systemDetails={SYSTEMS_WITH_PROOFS}
          />
        </div>
      </section>

      <section id="architecture" className="relative bg-bg-secondary py-[var(--section-py-compact)]">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
                Shared Architecture
              </h2>
              <p className="mt-2 max-w-xl text-[var(--text-body)] leading-relaxed text-text-secondary">
                All six systems share the same monorepo, deployment pipeline, and package design.
                Each system deploys independently with isolated data stores.
              </p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 text-left">
                <p className="text-[10px] font-medium uppercase tracking-wider text-accent">Monorepo</p>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                  Shared packages for state machines, auth, UI components, and analytics. One version of every dependency.
                </p>
              </div>
              <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 text-left">
                <p className="text-[10px] font-medium uppercase tracking-wider text-accent">Independent Deployments</p>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                  Each system deploys independently on Vercel with its own environment variables and preview URLs.
                </p>
              </div>
              <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 text-left">
                <p className="text-[10px] font-medium uppercase tracking-wider text-accent">Data Isolation</p>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                  Separate data stores per system. No cross-system data coupling. Tenant boundaries enforced at the database level.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-center gap-6 text-sm">
              <a
                href="https://github.com/jamesonolitoquit/jaostudio-platform"
                className="text-text-secondary underline underline-offset-4 transition-colors hover:text-text-primary"
              >
                GitHub
              </a>
              <Link
                href="/docs/demo-credentials"
                className="text-text-secondary underline underline-offset-4 transition-colors hover:text-text-primary"
              >
                Demo Credentials
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SystemProvider>
  )
}
