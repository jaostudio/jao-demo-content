import { Badge } from '@/components/ui/badge'
import { GlassCard } from '@/components/ui/glass-card'

export default function SecurityPolicyPage() {
  return (
    <main className="grid-bg">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <Badge variant="admin" className="mb-4">Trust</Badge>
        <h1 className="text-3xl font-bold text-isla-white">Security Policy</h1>
        <p className="mt-3 text-sm text-isla-muted">Last updated: June 2026</p>

        <div className="mt-10 space-y-8 text-sm text-isla-muted leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-isla-white mb-2">Scope</h2>
            <p>
              This security policy applies to the IslaVault demo application and its
              supporting infrastructure. IslaVault is a fictional portfolio project, not a
              production service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-isla-white mb-2">Allowed testing</h2>
            <GlassCard hover={false}>
              <ul className="space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-isla-success mt-1">&#10003;</span>
                  <span>Browse the public site</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-isla-success mt-1">&#10003;</span>
                  <span>Use demo accounts and explore the dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-isla-success mt-1">&#10003;</span>
                  <span>Run the built-in Security Lab simulations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-isla-success mt-1">&#10003;</span>
                  <span>Inspect client-side headers and bundles</span>
                </li>
              </ul>
            </GlassCard>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-isla-white mb-2">Not allowed</h2>
            <GlassCard hover={false}>
              <ul className="space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-isla-danger mt-1">&#10007;</span>
                  <span>Denial-of-service testing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-isla-danger mt-1">&#10007;</span>
                  <span>Credential stuffing or brute-force attacks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-isla-danger mt-1">&#10007;</span>
                  <span>Attempts to access infrastructure credentials or secrets</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-isla-danger mt-1">&#10007;</span>
                  <span>Destructive testing outside the built-in demo flows</span>
                </li>
              </ul>
            </GlassCard>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-isla-white mb-2">Reporting issues</h2>
            <p>
              If you discover a security issue, please open a GitHub issue on the project
              repository or contact the maintainer directly. This is a demo project and
              there is no bug bounty program.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
