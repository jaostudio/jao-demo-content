import { Badge } from '@/components/ui/badge'

export default function PrivacyPage() {
  return (
    <main className="grid-bg">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <Badge variant="admin" className="mb-4">Trust</Badge>
        <h1 className="text-3xl font-bold text-isla-white">Privacy</h1>
        <p className="mt-3 text-sm text-isla-muted">Last updated: June 2026</p>

        <div className="mt-10 space-y-8 text-sm text-isla-muted leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-isla-white mb-2">What this covers</h2>
            <p>
              IslaVault is a fictional portfolio demo. This page explains what data the demo
              collects and how it is handled. Nothing here constitutes a legal agreement.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-isla-white mb-2">Data collected</h2>
            <p>The demo stores the following data in its database:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Name and email address (for demo accounts)</li>
              <li>Role and organization membership</li>
              <li>Documents created during the demo session</li>
              <li>Audit events recording actions taken in the demo</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-isla-white mb-2">How data is used</h2>
            <p>
              All data exists solely to demonstrate database security features. No data is
              sold, shared with third parties, or used for analytics or advertising.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-isla-white mb-2">Sandbox mode</h2>
            <p>
              When sandbox mode is active, all writes go to an ephemeral database that resets
              on cold start or manual reset. Production Turso data is never touched during
              demo sessions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-isla-white mb-2">Cookies</h2>
            <p>
              The demo uses a session cookie for authentication. No tracking, analytics, or
              advertising cookies are used. The session cookie is HTTP-only and same-site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-isla-white mb-2">Data deletion</h2>
            <p>
              Sandbox data is automatically deleted when the server restarts. For the live
              Turso database, contact the project maintainer to request deletion of any data
              you may have entered.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
