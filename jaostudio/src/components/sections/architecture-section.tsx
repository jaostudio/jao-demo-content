'use client'

import Link from 'next/link'
import type { SystemContent } from '@/components/sections/active-system-view'

export function ArchitectureSection({
  activeSystem,
}: {
  activeSystem: SystemContent | null
}) {
  return (
    <section id="architecture" className="relative scroll-mt-20 bg-bg-secondary py-[var(--section-py-compact)]">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
              Shared Architecture
            </h2>
            {activeSystem && (
              <p className="mt-1 text-sm text-text-tertiary">
                Current system: <span className="text-accent">{activeSystem.uiLabel}</span> · {activeSystem.name}
              </p>
            )}
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
      </div>
    </section>
  )
}
