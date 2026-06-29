import { Badge } from '@/components/ui/badge'
import { GlassCard } from '@/components/ui/glass-card'

const stats = [
  { label: 'Unit / integration tests', value: '110' },
  { label: 'Test files', value: '12' },
  { label: 'E2E test files', value: '6' },
  { label: 'Security headers', value: '9' },
  { label: 'Canonical audit actions', value: '20' },
  { label: 'RBAC roles', value: '3' },
]

export default function CaseStudyPage() {
  return (
    <main className="grid-bg">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <Badge variant="admin" className="mb-4">Portfolio</Badge>
        <h1 className="text-3xl font-bold text-isla-white">IslaVault Case Study</h1>
        <p className="mt-3 text-isla-muted max-w-2xl">
          Built by JAOstudio as a portfolio-grade demonstration of secure full-stack architecture.
        </p>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {stats.map((s) => (
            <GlassCard key={s.label} hover={false}>
              <div className="text-2xl font-bold text-isla-amethyst">{s.value}</div>
              <div className="text-xs text-isla-muted mt-0.5">{s.label}</div>
            </GlassCard>
          ))}
        </div>

        <div className="mt-12 space-y-10">
          <section>
            <h2 className="text-xl font-semibold text-isla-white mb-3">1. Project goal</h2>
            <p className="text-sm text-isla-muted leading-relaxed">
              Build a portfolio-ready security demo that proves production-grade database security
              patterns: tenant isolation, role-based access control, immutable audit trails, rate
              limiting, input validation, and defense-in-depth. The demo must be interactive,
              visually polished, and easy for a technical reviewer to evaluate.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-isla-white mb-3">2. Product concept</h2>
            <p className="text-sm text-isla-muted leading-relaxed">
              IslaVault is a fictional Philippine-inspired secure client portal. Four demo
              organizations exist with distinct data boundaries. The dashboard lets users manage
              documents, view audit trails, configure security settings, and run attack
              simulations in a built-in Security Lab.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-isla-white mb-3">3. Architecture overview</h2>
            <p className="text-sm text-isla-muted leading-relaxed">
              Next.js 16 App Router with React 19. Prisma 7 ORM with the libSQL adapter.
              Turso as the serverless database. NextAuth with JWT strategy for session
              management. Framer Motion for functional animation. Tailwind CSS v4 with a
              custom dark theme.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-isla-white mb-3">4. Tenant isolation model</h2>
            <p className="text-sm text-isla-muted leading-relaxed">
              Every database query scopes to <code className="text-isla-pacific">organizationId</code> from the
              JWT session. Client-supplied organization IDs in request bodies are ignored
              server-side. Cross-tenant reads return 404 (not 403), so an attacker cannot
              distinguish between a real and fake tenant ID.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-isla-white mb-3">5. RBAC enforcement</h2>
            <p className="text-sm text-isla-muted leading-relaxed">
              Three roles: <code className="text-isla-pacific">SYSTEM_ADMIN</code> (cross-tenant),
              <code className="text-isla-pacific"> ORG_ADMIN</code> (tenant management),
              <code className="text-isla-pacific"> ORG_USER</code> (read and create documents).
              Every server action checks the role before executing. Admin actions require
              explicit guard functions that validate preconditions like not deleting yourself
              or the last admin.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-isla-white mb-3">6. Audit trail with hash chaining</h2>
            <p className="text-sm text-isla-muted leading-relaxed">
              Every mutation and denial generates an audit event with a SHA-256 hash of the
              canonical payload. Each event references the previous hash in the chain.
              Verification returns VERIFIED, TAMPERED, or UNVERIFIED. The chain is scoped per
              organization (plus a global scope for system events).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-isla-white mb-3">7. Sandbox mode</h2>
            <p className="text-sm text-isla-muted leading-relaxed">
              An ephemeral SQLite database protects the production Turso data during public
              demo sessions. When sandbox mode is active, all writes go to
              <code className="text-isla-pacific"> /tmp/sandbox.db</code> (on Vercel) or
              <code className="text-isla-pacific"> .sandbox/sandbox.db</code> (local).
              Data resets on cold start or via a manual Reset Demo Data button. Seed data is
              deterministic so demo accounts remain valid across resets.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-isla-white mb-3">8. Turso / libSQL database layer</h2>
            <p className="text-sm text-isla-muted leading-relaxed">
              Prisma 7 with <code className="text-isla-pacific">@prisma/adapter-libsql</code> connects to Turso,
              a serverless SQLite-compatible database. Local development uses a standard SQLite
              file. Migrations are generated locally against SQLite then applied to Turso via
              the Turso CLI. The schema includes six models: Organization, User, Document,
              AuditEvent, SecuritySetting, and ApiLog.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-isla-white mb-3">9. Security testing</h2>
            <p className="text-sm text-isla-muted leading-relaxed">
              110 unit and integration tests plus 6 Playwright E2E files cover RBAC enforcement,
              tenant isolation, access decisions, audit integrity, validation schemas, admin
              safety rails, pagination, sandbox seeding, demo accounts, security lab mappings,
              and request guards. A 5-simulation Attack Suite tests cross-tenant access, orgId
              injection, admin action denial, audit tampering, and unauthorized document edits.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-isla-white mb-3">10. Tradeoffs</h2>
            <div className="space-y-3">
              {[
                { title: 'Shared database vs. database-per-tenant', desc: 'MVP uses a single Turso database with organizationId scoping. This is cost-effective but provides logical, not physical, isolation. The production upgrade path to database-per-tenant is documented.' },
                { title: 'Credentials provider vs. OAuth', desc: 'NextAuth credentials provider with JWT strategy keeps the demo self-contained. No third-party OAuth setup is required to evaluate the demo.' },
                { title: 'Sandbox ephemerality', desc: 'Per-instance SQLite means sandbox state is not globally consistent. Acceptable for a portfolio demo where each reviewer gets a fresh environment.' },
                { title: 'Unsafe-inline in CSP', desc: 'Next.js requires unsafe-inline for inline styles and scripts. CSP still provides defense-in-depth; the tradeoff is documented.' },
              ].map((t) => (
                <GlassCard key={t.title} hover={false}>
                  <h3 className="text-sm font-semibold text-isla-white">{t.title}</h3>
                  <p className="text-xs text-isla-muted mt-1">{t.desc}</p>
                </GlassCard>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-isla-white mb-3">11. Production upgrade path</h2>
            <p className="text-sm text-isla-muted leading-relaxed">
              The current shared-database architecture can be upgraded to database-per-tenant by
              provisioning a Turso database per organization on creation, storing the database
              URL and token in a connection registry, and instantiating a Prisma client per
              request. Turso branching and snapshot restore support this pattern.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
