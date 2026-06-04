import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Demo Catalog — JAOstudio',
  description: 'Six production systems that solve real business problems: lead generation, revenue operations, multi-vendor marketplaces, editorial workflow, internal operations, and compliance.',
}

interface DemoProps {
  name: string
  positioning: string
  audience: string
  outcome: string
  url: string
  screenshot: string
  features: string[]
  slug: string
}

const demos: DemoProps[] = [
  {
    name: 'Lead Generation Platform',
    positioning: 'Turn visitors into booked appointments',
    audience: 'Service businesses — dental, construction, real estate',
    outcome: 'Vertical-specific landing pages that capture and convert qualified leads automatically.',
    url: 'https://jao-demo-landing.vercel.app',
    screenshot: '/images/demos/landing-hero.png',
    features: ['Industry vertical engine', 'Lead capture forms', 'SEO-optimized content', '7-section funnel'],
    slug: 'landingpage-demo',
  },
  {
    name: 'Revenue Operations Platform',
    positioning: 'From catalog to delivery, one platform',
    audience: 'Growing ecommerce businesses',
    outcome: 'Centralized revenue operations — products, cart, checkout, fulfillment, and admin in one system.',
    url: 'https://jao-demo-commerce.vercel.app',
    screenshot: '/images/demos/commerce-hero.png',
    features: ['Product catalog', 'Persistent cart', 'Checkout flow', 'Order management'],
    slug: 'commerce-demo',
  },
  {
    name: 'Multi-Vendor Commerce Platform',
    positioning: 'Run a marketplace, not a spreadsheet of vendors',
    audience: 'Platform businesses connecting buyers with vendors',
    outcome: 'Automated vendor management, commission tracking, and role-based dashboards for every user type.',
    url: 'https://jao-demo-marketplace.vercel.app',
    screenshot: '/images/demos/marketplace-hero.png',
    features: ['Vendor onboarding', 'Multi-vendor cart', 'Listing moderation', 'Role-based dashboards'],
    slug: 'marketplace-demo',
  },
  {
    name: 'Editorial Workflow Platform',
    positioning: 'From pitch to publish, tracked at every state',
    audience: 'Content teams and editorial departments',
    outcome: 'Structured editorial pipeline with state machine governance — no more "where\'s that article?" Slack messages.',
    url: 'https://jao-demo-content.vercel.app',
    screenshot: '/images/demos/content-hero.png',
    features: ['Editorial state machine', 'Author/Admin roles', 'Category management', 'ISR-powered public pages'],
    slug: 'content-platform-demo',
  },
  {
    name: 'Internal Operations Platform',
    positioning: 'One platform for every org in your company',
    audience: 'Operations teams managing multiple business units',
    outcome: 'Unified project management with org-level isolation, Kanban workflows, and full activity audit trails.',
    url: 'https://jao-demo-webapp.vercel.app',
    screenshot: '/images/demos/webapp-hero.png',
    features: ['Multi-tenant orgs', 'Kanban boards', 'Task management', 'Org-level RBAC'],
    slug: 'web-application-demo',
  },
  {
    name: 'Compliance & Audit Platform',
    positioning: 'Who did what, when — and who allowed it',
    audience: 'Compliance officers and IT administrators',
    outcome: 'Complete audit trail with role-based access enforced at the database level, ready for SOC 2 and HIPAA.',
    url: 'https://jao-demo-security.vercel.app',
    screenshot: '/images/demos/security-hero.png',
    features: ['Audit trail', 'Role hierarchy', 'Data isolation', 'Security headers'],
    slug: 'database-security-demo',
  },
]

export default function DemosPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-20">
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Production Systems</h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-neutral-600">
          Six live systems that solve real business problems. Each one is independently deployed,
          fully functional, and built on shared architecture.
        </p>
      </div>

      <div className="space-y-20">
        {demos.map((demo) => (
          <section key={demo.slug} className="grid gap-8 md:grid-cols-5">
            <div className="md:col-span-3">
              <a href={demo.url} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden rounded-xl border">
                <Image
                  src={demo.screenshot}
                  alt={`${demo.name} screenshot`}
                  width={1440}
                  height={900}
                  className="w-full transition-opacity group-hover:opacity-90"
                />
              </a>
            </div>
            <div className="flex flex-col justify-center md:col-span-2">
              <p className="text-xs font-medium uppercase tracking-widest text-neutral-400">{demo.audience}</p>
              <h2 className="mt-2 text-2xl font-bold">{demo.name}</h2>
              <p className="mt-1 text-lg text-neutral-600">{demo.positioning}</p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-500">{demo.outcome}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {demo.features.map((f) => (
                  <span key={f} className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                    {f}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex gap-3">
                <a
                  href={demo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
                >
                  Visit Live Site →
                </a>
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-20 rounded-xl border bg-neutral-50 p-8 text-center">
        <h2 className="text-lg font-semibold">Shared Architecture</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-neutral-500">
          All six systems are built on the same monorepo with shared packages for state machines,
          events, authentication, and UI components.
        </p>
        <pre className="mt-6 overflow-x-auto text-left text-sm">
{`jaostudio/
├── landingpage-demo       Lead Generation
├── commerce-demo          Revenue Operations
├── marketplace-demo       Multi-Vendor Commerce
├── content-platform-demo  Editorial Workflow
├── web-application-demo   Internal Operations
└── database-security-demo Compliance & Audit

packages/
├── @jaostudio/core        State machines, events, auth
├── @jaostudio/engine      Rendering, transitions
├── @jaostudio/ui          Components
└── @jaostudio/analytics   Events`}
        </pre>
        <div className="mt-6 flex justify-center gap-4 text-sm">
          <a href="https://github.com/jamesonolitoquit/jaostudio-platform" className="underline hover:text-neutral-600">GitHub</a>
          <Link href="/docs/demo-credentials" className="underline hover:text-neutral-600">Demo Credentials</Link>
        </div>
      </div>
    </main>
  )
}
