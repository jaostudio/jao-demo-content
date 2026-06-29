import { Badge } from '@/components/ui/badge'

export default function DisclaimerPage() {
  return (
    <main className="grid-bg">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <Badge variant="admin" className="mb-4">Trust</Badge>
        <h1 className="text-3xl font-bold text-isla-white">Disclaimer</h1>
        <p className="mt-3 text-sm text-isla-muted">Last updated: June 2026</p>

        <div className="mt-10 space-y-8 text-sm text-isla-muted leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-isla-white mb-2">Fictional project</h2>
            <p>
              IslaVault is a fictional portfolio project. It is not a real company,
              government system, healthcare provider, bank, or compliance-certified product.
              It was built to demonstrate secure database architecture patterns.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-isla-white mb-2">No guarantees</h2>
            <p>
              The security measures demonstrated in this project reflect the current
              implementation. No security system is foolproof, and this demo makes no claim
              to be invulnerable. The code is provided for educational and evaluation
              purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-isla-white mb-2">No liability</h2>
            <p>
              The project maintainer is not liable for any damages, data loss, or security
              incidents arising from the use or misuse of this demo. Users interact with
              this demo at their own discretion.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-isla-white mb-2">Third-party services</h2>
            <p>
              This demo uses Turso (libSQL), Vercel (hosting), and Upstash Redis (rate
              limiting). Each service operates under its own terms and privacy policy.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
