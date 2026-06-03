import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Demo Catalog — JAOstudio',
  description: 'Six production-system archetypes built on a shared platform monorepo: landing pages, commerce, marketplace, CMS, SaaS, and security portal.',
}

const demos = [
  {
    name: 'Landing Page Engine',
    slug: 'landingpage-demo',
    description: 'Conversion-optimized landing pages with swappable industry content. 5 verticals driven entirely by data.',
    stack: ['Next.js 16', 'Tailwind v4', 'Framer Motion', 'Engine (SectionRenderer)'],
    features: ['Vertical engine', '7-section funnel', 'Qualification wizard', 'Static generation'],
  },
  {
    name: 'Commerce Platform',
    slug: 'commerce-demo',
    description: 'Full e-commerce lifecycle: product catalog, cart, checkout, and admin order management.',
    stack: ['Next.js 16', 'Prisma + SQLite', 'Zustand', 'State machines'],
    features: ['Product catalog', 'Persisted cart', 'Order workflow', 'Admin dashboard'],
  },
  {
    name: 'Marketplace',
    slug: 'marketplace-demo',
    description: 'Two-sided marketplace with vendor listings, admin moderation, multi-vendor cart, and actor-guarded transitions.',
    stack: ['Next.js 16', 'Prisma + SQLite', 'NextAuth v4', '5 state machines'],
    features: ['Vendor dashboard', 'Listing moderation', 'Multi-vendor cart', 'Event causation chains'],
  },
  {
    name: 'Content Platform',
    slug: 'content-platform-demo',
    description: 'Headless CMS with editorial workflow, ISR-based public pages, and SEO pipeline.',
    stack: ['Next.js 16', 'Prisma + SQLite', 'ISR', 'contentMachine'],
    features: ['Editorial workflow', 'ISR (revalidate: 60s)', 'JSON-LD + OG tags', 'Moderation audit'],
  },
  {
    name: 'Project Management SaaS',
    slug: 'web-application-demo',
    description: 'Multi-tenant project management with Kanban boards, org-level RBAC, and local state machines.',
    stack: ['Next.js 16', 'Prisma + SQLite', 'NextAuth v4', 'Local TaskMachine'],
    features: ['Org isolation', 'Role hierarchy', 'Kanban columns', 'Local state machine'],
  },
  {
    name: 'Secure Client Portal',
    slug: 'database-security-demo',
    description: 'B2B security portal with audit trails, data isolation, security headers, and role-based access.',
    stack: ['Next.js 16', 'Prisma + SQLite', 'NextAuth v4', 'Security middleware'],
    features: ['Audit trail', 'Data isolation', 'Security headers', 'Rate limiting'],
  },
]

export default function DemosPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-20">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Demo Catalog</h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-neutral-600">
          Six production-system archetypes built on a shared platform monorepo with
          state machines, events, and cross-demo architectural patterns.
        </p>
      </div>

      <div className="space-y-6">
        {demos.map((demo) => (
          <section key={demo.slug} className="rounded-xl border p-6 transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold">{demo.name}</h2>
                <p className="mt-1 text-sm text-neutral-600">{demo.description}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                {demo.stack.slice(0, 4).map((tech) => (
                  <span key={tech} className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="flex flex-wrap gap-1.5">
                {demo.features.map((f) => (
                  <span key={f} className="rounded bg-neutral-50 px-2 py-0.5 text-xs text-neutral-500">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-xl border bg-neutral-50 p-8 text-center">
        <h2 className="text-lg font-semibold">Monorepo Architecture</h2>
        <pre className="mt-4 overflow-x-auto text-left text-sm">
{`jaostudio
├── landingpage-demo       Marketing landing pages
├── commerce-demo          E-commerce
├── marketplace-demo       Two-sided marketplace
├── content-platform-demo  CMS / publishing
├── web-application-demo   Project management SaaS
└── database-security-demo Secure B2B portal

shared packages
├── @jaostudio/core        State machines, events, auth, validation
├── @jaostudio/engine      Page rendering, section registry
├── @jaostudio/ui          Section components
└── @jaostudio/analytics   Analytics abstraction`}
        </pre>
        <div className="mt-6 flex justify-center gap-4 text-sm">
          <a href="https://github.com/jaostudio/jaostudio" className="underline hover:text-neutral-600">GitHub</a>
          <Link href="/docs/demo-credentials" className="underline hover:text-neutral-600">Demo Credentials</Link>
        </div>
      </div>
    </main>
  )
}
