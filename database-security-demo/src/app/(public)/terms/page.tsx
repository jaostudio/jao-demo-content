import { Badge } from '@/components/ui/badge'

export default function TermsPage() {
  return (
    <main className="grid-bg">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <Badge variant="admin" className="mb-4">Trust</Badge>
        <h1 className="text-3xl font-bold text-isla-white">Terms of Use</h1>
        <p className="mt-3 text-sm text-isla-muted">Last updated: June 2026</p>

        <div className="mt-10 space-y-8 text-sm text-isla-muted leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-isla-white mb-2">Purpose</h2>
            <p>
              IslaVault is a fictional security demo built for portfolio and educational
              purposes. It is not a real product or service. By using this demo, you agree
              to the following terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-isla-white mb-2">Acceptable use</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Browse the public site freely</li>
              <li>Sign in with demo accounts and explore the dashboard</li>
              <li>Run the built-in Security Lab simulations</li>
              <li>Inspect client-side code and headers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-isla-white mb-2">Restrictions</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Do not attempt denial-of-service attacks</li>
              <li>Do not credential-stuff or brute-force the login</li>
              <li>Do not attempt to access infrastructure credentials or secrets</li>
              <li>Do not perform destructive testing outside the built-in demo flows</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-isla-white mb-2">No warranty</h2>
            <p>
              This demo is provided as-is for evaluation purposes. There is no uptime
              guarantee, no SLA, and no support commitment. The project may be taken down
              or modified at any time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-isla-white mb-2">Not a real product</h2>
            <p>
              IslaVault is a fictional project. It does not represent a real company,
              government system, healthcare platform, bank, or compliance-certified product.
              Any resemblance to actual products is coincidental.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
