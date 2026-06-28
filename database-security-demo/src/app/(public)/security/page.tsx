import { Badge } from '@/components/ui/badge'
import { GlassCard } from '@/components/ui/glass-card'

const models = [
  {
    title: 'Tenant Isolation',
    desc: 'Every organization\'s data is scoped by organizationId derived from the JWT session. Client-supplied organizationId values in request bodies are ignored server-side.',
    checks: ['JWT contains session organizationId', 'All queries filter by organizationId', 'Client orgId rejected', 'Cross-tenant returns 404'],
  },
  {
    title: 'Role-Based Access Control',
    desc: 'Three tiers of access enforced on every server action and API route. SYSTEM_ADMIN can manage all tenants. ORG_ADMIN manages their org. ORG_USER can only read and create documents.',
    checks: ['Server-side role verification', 'No client role trust', 'Hierarchical permission model', 'Admin actions require SYSTEM_ADMIN'],
  },
  {
    title: 'Immutable Audit Trail',
    desc: 'Every mutation and denied access attempt generates an audit event with causationId chaining. Events are append-only with no direct update or delete path for standard users.',
    checks: ['Append-only event log', 'CausationId chain tracking', 'IP address logging', 'Tamper attempts denied and logged'],
  },
  {
    title: 'Security Headers',
    desc: 'All routes are protected by HTTP security headers applied through middleware. Content Security Policy prevents XSS, HSTS enforces HTTPS, and Permissions-Policy restricts sensitive APIs.',
    checks: ['CSP with strict defaults', 'HSTS preload ready', 'X-Frame-Options: DENY', 'Permissions-Policy lockdown'],
  },
  {
    title: 'Database Protections',
    desc: 'Query-level tenant scoping ensures that even if a route handler is misconfigured, the database query itself filters by organizationId. No raw SQL execution is permitted.',
    checks: ['Prisma ORM with typed queries', 'No raw SQL in codebase', 'organizationId in every WHERE', 'Turso/libSQL with auth token'],
  },
]

export default function SecurityPage() {
  return (
    <main className="grid-bg">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <Badge variant="admin" className="mb-4">Security Model</Badge>
        <h1 className="text-3xl font-bold text-isla-white">How IslaVault protects data</h1>
        <p className="mt-3 text-isla-muted max-w-2xl">
          IslaVault uses defense-in-depth across five layers. Every request is authenticated,
          authorized, scoped, logged, and hardened against common attack vectors.
        </p>

        <div className="mt-12 space-y-8">
          {models.map((model) => (
            <GlassCard key={model.title} hover={false}>
              <h2 className="text-lg font-semibold text-isla-white">{model.title}</h2>
              <p className="mt-2 text-sm text-isla-muted leading-relaxed">{model.desc}</p>
              <div className="mt-4 grid sm:grid-cols-2 gap-2">
                {model.checks.map((check) => (
                  <div key={check} className="flex items-center gap-2 text-xs text-isla-muted">
                    <span className="text-isla-success">✓</span>
                    {check}
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="mt-12 glass-card-static p-6">
          <h2 className="text-lg font-semibold text-isla-white">RBAC Permission Matrix</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-xs mono">
              <thead>
                <tr className="border-b border-isla-border">
                  <th className="text-left py-2 pr-4 text-isla-muted">Action</th>
                  <th className="text-left py-2 pr-4 text-isla-muted">SYSTEM_ADMIN</th>
                  <th className="text-left py-2 pr-4 text-isla-muted">ORG_ADMIN</th>
                  <th className="text-left py-2 text-isla-muted">ORG_USER</th>
                </tr>
              </thead>
              <tbody className="text-isla-white">
                {[
                  ['Create Organization', '✓', '—', '—'],
                  ['Delete Organization', '✓', '—', '—'],
                  ['View All Orgs', '✓', '—', '—'],
                  ['Create Users', '✓', '—', '—'],
                  ['Delete Users', '✓', '—', '—'],
                  ['Create Documents', '✓', '✓', '✓'],
                  ['Delete Documents', '✓', '✓', '—'],
                  ['View Audit (org)', '✓', '✓', '✓'],
                  ['View Audit (all)', '✓', '—', '—'],
                  ['Manage Settings', '✓', '✓', '—'],
                  ['Cross-Tenant Read', '✓', '—', '—'],
                ].map((row) => (
                  <tr key={row[0]} className="border-b border-isla-border/50">
                    <td className="py-1.5 pr-4">{row[0]}</td>
                    <td className="py-1.5 pr-4 text-isla-success">{row[1]}</td>
                    <td className="py-1.5 pr-4">{row[2] === '✓' ? <span className="text-isla-success">✓</span> : <span className="text-isla-muted">—</span>}</td>
                    <td className="py-1.5">{row[3] === '✓' ? <span className="text-isla-success">✓</span> : <span className="text-isla-muted">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <footer className="border-t border-isla-border py-6 text-center text-xs text-isla-muted">
        IslaVault — A fictional Philippine-inspired secure client portal. Not a real product.
      </footer>
    </main>
  )
}
