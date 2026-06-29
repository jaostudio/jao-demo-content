import { AlertTriangle } from 'lucide-react'

export const metadata = {
  title: 'Security Policy',
  description: 'Security information for Likha — a fictional demo platform by JAOstudio.',
}

export default function SecurityPolicyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Demo Platform Notice</p>
            <p className="mt-1">Likha is a fictional demo platform. This security policy is placeholder product copy and not legal advice.</p>
          </div>
        </div>
      </div>

      <h1 className="text-xl font-semibold text-text-primary">Security Policy</h1>
      <p className="mt-1 text-sm text-fog-gray">How Likha approaches security.</p>

      <div className="mt-8 space-y-6 text-sm text-text-secondary leading-relaxed">
        <section>
          <h2 className="font-semibold text-text-primary">Authentication</h2>
          <p className="mt-1">Session management uses next-auth with JWT tokens stored in HTTP-only cookies for the Next.js layer and localStorage JWTs for Hono API authentication. Passwords are hashed using bcrypt.</p>
        </section>

        <section>
          <h2 className="font-semibold text-text-primary">Data protection</h2>
          <p className="mt-1">The production database (Turso) uses TLS for all connections. Auth tokens for Turso are stored as environment variables and are never exposed client-side. SQL injection is prevented by Prisma&rsquo;s parameterized queries.</p>
        </section>

        <section>
          <h2 className="font-semibold text-text-primary">API security</h2>
          <p className="mt-1">The Hono API validates all incoming requests with Zod schemas. Bearer token middleware protects mutating endpoints. Role-based access control is enforced at the route level for admin and studio operations.</p>
        </section>

        <section>
          <h2 className="font-semibold text-text-primary">Best practices</h2>
          <p className="mt-1">Dependencies are regularly updated. The <code>.env</code> file is excluded from version control. No secrets or API keys are committed to the repository.</p>
        </section>

        <section>
          <h2 className="font-semibold text-text-primary">Reporting</h2>
          <p className="mt-1">As a demo platform, Likha does not operate a bug bounty program. Security concerns related to this portfolio project can be directed to JAOstudio.</p>
        </section>

        <p className="pt-4 text-xs text-fog-gray">Last updated: June 2026.</p>
      </div>
    </div>
  )
}
