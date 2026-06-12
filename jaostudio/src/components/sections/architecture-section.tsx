'use client'

import Link from 'next/link'
import type { SystemContent } from '@/components/sections/active-system-view'
import { Section } from '@/components/ui/section'
import { Card } from '@/components/ui/card'

export function ArchitectureSection({
  activeSystem,
}: {
  activeSystem: SystemContent | null
}) {
  return (
    <Section id="architecture" variant="alt" className="scroll-mt-20">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
            Shared Architecture
          </h2>
          {activeSystem && (
            <p className="mt-1 text-sm text-text-tertiary">
              Current system: <span className="text-text-primary">{activeSystem.uiLabel}</span> · {activeSystem.name}
            </p>
          )}
          <p className="mt-2 max-w-xl text-[var(--text-body)] leading-relaxed text-text-secondary">
            All six systems share the same monorepo, deployment pipeline, and package design.
            Each system deploys independently with isolated data stores.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card className="p-5 text-left">
            <p className="text-xs font-medium uppercase tracking-wider text-text-primary">Monorepo</p>
            <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
              Shared packages for state machines, auth, UI components, and analytics. One version of every dependency.
            </p>
          </Card>
          <Card className="p-5 text-left">
            <p className="text-xs font-medium uppercase tracking-wider text-text-primary">Independent Deployments</p>
            <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
              Each system deploys independently on Vercel with its own environment variables and preview URLs.
            </p>
          </Card>
          <Card className="p-5 text-left">
            <p className="text-xs font-medium uppercase tracking-wider text-text-primary">Data Isolation</p>
            <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
              Separate data stores per system. No cross-system data coupling. Tenant boundaries enforced at the database level.
            </p>
          </Card>
        </div>
        <div className="mt-6 flex justify-center gap-6 text-sm">
          <a
            href="https://github.com/jamesonolitoquit/jaostudio-platform"
            target="_blank"
            rel="noopener noreferrer"
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
    </Section>
  )
}
