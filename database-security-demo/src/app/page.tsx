import Link from 'next/link'
import { Header } from '@/components/header'

export default function SecurityHome() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-16">
        <section className="mb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Secure B2B Portal</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
            A secure client portal demonstrating auditability, authorization, rate limiting,
            security headers, and org-level data isolation.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/dashboard" className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-700">
              Dashboard
            </Link>
            <Link href="/signin" className="rounded-lg border px-6 py-2.5 text-sm font-medium hover:bg-gray-50">
              Sign In
            </Link>
          </div>
        </section>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Data Isolation', desc: 'All data queries scoped by organization ID from JWT — no cross-org leaks.' },
            { title: 'Audit Trail', desc: 'Every mutation logged with causationId chains for full traceability.' },
            { title: 'Role-Based Access', desc: 'SYSTEM_ADMIN, ORG_ADMIN, and ORG_USER roles enforced server-side.' },
            { title: 'Rate Limiting', desc: 'Core rate limiter on auth and sensitive API endpoints.' },
            { title: 'Security Headers', desc: 'CSP, HSTS, X-Frame-Options, and other headers via middleware.' },
            { title: 'Secure Documents', desc: 'Document CRUD with org-level access control and full audit logging.' },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-neutral-500">{f.desc}</p>
            </div>
          ))}
        </section>
      </main>
    </>
  )
}
