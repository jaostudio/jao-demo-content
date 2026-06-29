import { Badge } from '@/components/ui/badge'
import { GlassCard } from '@/components/ui/glass-card'

export default function ArchitecturePage() {
  return (
    <main className="grid-bg">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <Badge variant="admin" className="mb-4">Architecture</Badge>
        <h1 className="text-3xl font-bold text-isla-white">Technical implementation</h1>
        <p className="mt-3 text-isla-muted max-w-2xl">
          Full-stack security architecture with Turso-backed tenant isolation and server-side enforcement.
        </p>

        {/* Tech Stack */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-isla-white mb-4">Tech Stack</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Framework', value: 'Next.js 16 (App Router) with React 19' },
              { label: 'Database', value: 'Turso/libSQL (SQLite-compatible, serverless)' },
              { label: 'ORM', value: 'Prisma 7 with @prisma/adapter-libsql' },
              { label: 'Auth', value: 'NextAuth v4, JWT strategy, CredentialsProvider' },
              { label: 'Styling', value: 'Tailwind CSS v4 with custom dark theme' },
              { label: 'Animation', value: 'Framer Motion (functional animation)' },
              { label: 'Language', value: 'TypeScript 5.7' },
              { label: 'Deployment', value: 'Vercel' },
            ].map((item) => (
              <GlassCard key={item.label} hover={false}>
                <div className="text-xs text-isla-pacific mono uppercase tracking-wider">{item.label}</div>
                <div className="mt-1 text-sm text-isla-white">{item.value}</div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Database Layer */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-isla-white mb-4">Database Layer</h2>
          <GlassCard hover={false}>
            <p className="text-sm text-isla-muted leading-relaxed">
              IslaVault uses <strong className="text-isla-white">Turso/libSQL</strong> as a serverless SQLite-compatible
              database for the live demo. Tenant isolation is enforced through server-side session scope, RBAC guards,
              and organization-scoped queries. The production upgrade path supports database-per-tenant isolation
              for stricter customer boundaries.
            </p>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-isla-pacific mono mb-2">Local Development</div>
                <div className="text-xs text-isla-muted mono space-y-1">
                  <div>DATABASE_URL=file:./dev.db</div>
                  <div>No cloud dependency</div>
                  <div>Prisma Migrate for schema</div>
                </div>
              </div>
              <div>
                <div className="text-xs text-isla-pacific mono mb-2">Production / Demo</div>
                <div className="text-xs text-isla-muted mono space-y-1">
                  <div>TURSO_DATABASE_URL=libsql://...</div>
                  <div>TURSO_AUTH_TOKEN=...</div>
                  <div>Prisma adapter + Turso CLI</div>
                </div>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Schema */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-isla-white mb-4">Database Schema</h2>
          <GlassCard hover={false}>
            <div className="text-xs mono space-y-2 text-isla-muted">
              <div className="text-isla-white">Organization</div>
              <div className="pl-4">id, name, slug (unique), createdAt</div>
              <div className="text-isla-white mt-3">User</div>
              <div className="pl-4">id, name, email (unique), password, role, organizationId</div>
              <div className="text-isla-white mt-3">Document</div>
              <div className="pl-4">id, title, body, status, organizationId, uploadedById</div>
              <div className="text-isla-white mt-3">AuditEvent</div>
              <div className="pl-4">id, action, entityType, entityId, userId, organizationId, metadata, causationId</div>
              <div className="text-isla-white mt-3">SecuritySetting</div>
              <div className="pl-4">id, key, value, organizationId (unique on key+orgId)</div>
              <div className="text-isla-white mt-3">ApiLog</div>
              <div className="pl-4">id, method, path, userId, ip, status</div>
            </div>
          </GlassCard>
        </section>

        {/* Request Lifecycle */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-isla-white mb-4">Request Lifecycle</h2>
          <GlassCard hover={false}>
            <div className="text-xs mono text-isla-muted space-y-2">
              {[
                ['1. HTTP Request', 'Browser or API client sends request'],
                ['2. NextAuth Session', 'JWT decoded; user ID, role, and orgId extracted'],
                ['3. Server Action / Route Handler', 'Session verified; role guard checked'],
                ['4. Tenant Scope', 'organizationId from session, not request body'],
                ['5. Prisma Query', 'Query filtered by WHERE organizationId = session.orgId'],
                ['6. Turso/libSQL', 'Scoped query executed against database'],
                ['7. Audit Event', 'Mutation or denial logged with causationId'],
                ['8. Response', '200/404/401 returned; never 403 for cross-tenant'],
              ].map(([step, desc]) => (
                <div key={step} className="flex gap-4">
                  <span className="text-isla-violet w-32 shrink-0">{step}</span>
                  <span className="text-isla-white">{desc}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>

        {/* Migration Workflow */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-isla-white mb-4">Migration Workflow</h2>
          <GlassCard hover={false}>
            <p className="text-sm text-isla-muted mb-4">
              Prisma Migrate is not directly supported against Turso. Generate migrations locally against SQLite,
              then apply to Turso using the Turso CLI.
            </p>
            <div className="text-xs mono bg-isla-volcanic rounded-lg p-4 text-isla-muted">
              <div className="text-isla-muted"># 1. Generate migration locally</div>
              <div className="text-isla-white">npx prisma migrate dev --name &lt;name&gt;</div>
              <div className="text-isla-muted mt-2"># 2. Apply generated SQL to Turso</div>
              <div className="text-isla-white">turso db shell islavault-dev &lt; prisma/migrations/&lt;name&gt;/migration.sql</div>
              <div className="text-isla-muted mt-2"># 3. Generate Prisma client</div>
              <div className="text-isla-white">npx prisma generate</div>
              <div className="text-isla-muted mt-2"># 4. Seed Turso</div>
              <div className="text-isla-white">npm run db:seed</div>
            </div>
          </GlassCard>
        </section>

        {/* Production Upgrade Path */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-isla-white mb-4">Production Upgrade Path</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: 'Shared Database', desc: 'Current MVP. Single Turso database with organizationId scoping. Suitable for moderate isolation requirements.' },
              { title: 'Database Per Tenant', desc: 'Each tenant gets its own Turso database. Stronger physical isolation. Turso branching enables this pattern.' },
            ].map((item) => (
              <GlassCard key={item.title} hover={false}>
                <h3 className="font-semibold text-sm text-isla-white">{item.title}</h3>
                <p className="mt-1 text-xs text-isla-muted">{item.desc}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Key Security Patterns */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-isla-white mb-4">Key Security Patterns</h2>
          <div className="space-y-4">
            {[
              { code: 'await prisma.document.findFirst({\n  where: { id, organizationId: session.orgId }\n})', note: 'Never findUnique without org scope' },
              { code: '// Client orgId IGNORED\nconst sessionOrgId = session.user.orgId', note: 'Organization ID from JWT, not request body' },
              { code: 'throw new Error(\'Not found\') // 404', note: 'Cross-tenant returns 404, never 403' },
              { code: 'await logAudit(..., \'document.cross_tenant_denied\', ...)', note: 'Every denial is recorded in the audit trail' },
            ].map((item) => (
              <GlassCard key={item.code} hover={false}>
                <div className="text-xs mono bg-isla-volcanic rounded p-3 text-isla-green">{item.code}</div>
                <div className="mt-2 text-xs text-isla-muted">{item.note}</div>
              </GlassCard>
            ))}
          </div>
        </section>
      </div>

    </main>
  )
}
