import Link from 'next/link'
import { ArchipelagoMap } from '@/components/archipelago-map'
import { SecurityProofStrip } from '@/components/security-proof-strip'
import { InteractiveProductPreview } from '@/components/product-preview-tabs'
import { DatabasePipeline } from '@/components/database-pipeline'
import { DemoIdentityCard } from '@/components/demo-identity-card'
import { Badge } from '@/components/ui/badge'
import { GlassCard } from '@/components/ui/glass-card'
import { DEMO_ACCOUNTS } from '@/lib/demo-accounts'

const labCards = [
  { title: 'Cross-Tenant Access', desc: 'Try reading a document from another tenant.', status: 'BLOCKED + LOGGED' },
  { title: 'Fake organizationId Injection', desc: 'Submit a request with another tenant\'s ID.', status: 'IGNORED + LOGGED' },
  { title: 'Admin Action Denial', desc: 'Attempt to create an organization as a standard user.', status: 'BLOCKED + LOGGED' },
  { title: 'Audit Tampering', desc: 'Try to modify or delete an audit record.', status: 'BLOCKED + LOGGED' },
  { title: 'Unauthorized Document Edit', desc: 'Edit a document without the required role.', status: 'BLOCKED + LOGGED' },
]

export default function IslaVaultHome() {
  return (
    <main className="grid-bg">
      {/* 1. Immersive Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="admin" className="mb-4">Fictional Security Demo</Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-isla-white leading-tight">
              Secure portals for every island of your organization.
            </h1>
            <p className="mt-4 text-lg text-isla-muted max-w-lg leading-relaxed">
              IslaVault is a fictional secure portal demo. Each organization only sees its own
              documents, users, settings, and audit history. Every operation is checked against
              your role and tenant before the database is queried.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/demo"
                className="px-6 py-2.5 rounded-lg text-sm font-medium bg-isla-amethyst text-white hover:bg-isla-amethyst/90 transition-colors"
              >
                Launch Security Demo
              </Link>
              <Link
                href="/architecture"
                className="px-6 py-2.5 rounded-lg text-sm font-medium border border-isla-border text-isla-white hover:bg-isla-glass transition-colors"
              >
                View Architecture
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <ArchipelagoMap />
          </div>
        </div>
      </section>

      {/* 2. Security Proof Strip */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <SecurityProofStrip />
      </section>

      {/* 3. Interactive Product Preview */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-isla-white">How enforcement works</h2>
          <p className="mt-2 text-sm text-isla-muted">Pick a security layer below to see the server-side enforcement.</p>
        </div>
        <div className="max-w-2xl mx-auto">
          <InteractiveProductPreview />
        </div>
      </section>

      {/* 4. Database Security Story */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-bold text-isla-white">Every request runs through a security pipeline.</h2>
            <p className="mt-3 text-sm text-isla-muted leading-relaxed">
              From authentication to audit logging, every database operation is authorized,
              scoped, and recorded. No client-supplied tenant ID is ever trusted.
            </p>
            <div className="mt-4 space-y-2 text-xs text-isla-muted mono">
              <div>1. Session JWT verified</div>
              <div>2. Role checked against action</div>
              <div>3. organizationId from session applied</div>
              <div>4. Prisma query scoped by orgId</div>
              <div>5. Turso/libSQL executes scoped query</div>
              <div>6. Audit event recorded</div>
            </div>
          </div>
          <div className="glass-card-static p-6">
            <DatabasePipeline />
          </div>
        </div>
      </section>

      {/* 5. Security Lab Teaser */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-isla-white">Security Lab</h2>
          <p className="mt-2 text-sm text-isla-muted">Interactive attack simulations with real server enforcement.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {labCards.map((card) => (
            <GlassCard key={card.title} as="article" hover={false}>
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="blocked">{card.status}</Badge>
                </div>
                <h3 className="font-semibold text-sm text-isla-white">{card.title}</h3>
                <p className="mt-1 text-xs text-isla-muted flex-1">{card.desc}</p>
              </div>
            </GlassCard>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link href="/demo" className="text-sm text-isla-pacific hover:text-isla-pacific/80 transition-colors">
            Sign in to try the Security Lab →
          </Link>
        </div>
      </section>

      {/* 6. Architecture Flow */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="glass-card-static p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-isla-white">Architecture</h2>
            <p className="mt-1 text-xs text-isla-muted">Full-stack security pipeline</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs mono">
            {['Next.js 16', 'NextAuth JWT', 'Server Actions', 'Prisma ORM', 'Turso/libSQL', 'Audit Log'].map((item, i) => (
              <span key={item} className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded bg-isla-glass border border-isla-border text-isla-white">{item}</span>
                {i < 5 && <span className="text-isla-muted">→</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Demo Account Cards */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-isla-white">Try IslaVault</h2>
          <p className="mt-2 text-sm text-isla-muted">Choose a demo account to see how tenant isolation works.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DEMO_ACCOUNTS.map((account) => (
            <DemoIdentityCard key={account.email} {...account} />
          ))}
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20 text-center">
        <div className="glass-card-static p-10">
          <h2 className="text-2xl font-bold text-isla-white">Built to demonstrate database security.</h2>
          <p className="mt-3 text-sm text-isla-muted max-w-lg mx-auto">
            Each tenant sees only its own data. Cross-tenant requests return 404. Every denied
            attempt is recorded in the audit trail. You can verify the hash chain yourself.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href="/demo"
              className="px-6 py-2.5 rounded-lg text-sm font-medium bg-isla-amethyst text-white hover:bg-isla-amethyst/90 transition-colors"
            >
              Launch Security Demo
            </Link>
            <Link
              href="/security"
              className="px-6 py-2.5 rounded-lg text-sm font-medium border border-isla-border text-isla-white hover:bg-isla-glass transition-colors"
            >
              Read Security Model
            </Link>
          </div>
          <p className="mt-4 text-xs text-isla-muted">
            Designed to show how tenant isolation, RBAC, audit trails, and secure database access work in practice.
          </p>
        </div>
      </section>

    </main>
  )
}
