import type { Metadata } from 'next'
import Link from 'next/link'
import { DemosGrid } from '@/components/sections/demos-grid'

export const metadata: Metadata = {
  title: 'Production Systems — JAOstudio',
  description: 'Six live systems that solve real business problems: lead generation, revenue operations, multi-vendor marketplaces, editorial workflow, internal operations, and compliance.',
}

export default function DemosPage() {
  return (
    <>
      <section className="relative py-[var(--section-py-compact)]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(circle at 50% 0%, rgba(124,58,237,0.08), transparent 60%)' }}
        />
        <div className="mx-auto w-full max-w-7xl px-6 md:px-8 lg:px-12">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <span className="inline-flex min-w-[5rem] items-center justify-center gap-1.5 rounded-full bg-accent-subtle px-3 py-1 text-xs font-medium text-accent">
              Live Systems
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

      <section className="relative py-[var(--section-py-compact)]">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-8 lg:px-12">
          <DemosGrid />
        </div>
      </section>

      <section className="relative bg-bg-secondary py-[var(--section-py-compact)]">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl rounded-xl border border-border-subtle p-8 text-center">
            <h2 className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
              Shared Architecture
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-[var(--text-body)] leading-relaxed text-text-secondary">
              All six systems are built on the same monorepo with shared packages for state machines,
              events, authentication, and UI components.
            </p>
            <pre className="mt-6 overflow-x-auto text-left text-sm text-text-secondary">
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
    </>
  )
}
