import { AlertTriangle } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for Likha.',
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Demo Platform Notice</p>
            <p className="mt-1">Likha is a fictional demo platform. These terms of service are placeholder product copy and not legal advice.</p>
          </div>
        </div>
      </div>

      <h1 className="text-xl font-semibold text-text-primary">Terms of Service</h1>
      <p className="mt-1 text-sm text-fog-gray">The rules of the road.</p>

      <div className="mt-8 space-y-6 text-sm text-text-secondary leading-relaxed">
        <section>
          <h2 className="font-semibold text-text-primary">Your account</h2>
          <p className="mt-1">You are responsible for the content you publish and the accuracy of your profile information. You may not impersonate other artists or misrepresent your work.</p>
        </section>

        <section>
          <h2 className="font-semibold text-text-primary">Your content</h2>
          <p className="mt-1">You retain full ownership of your work. By publishing on Likha, you grant the platform a license to display your work on the site. You may remove your work at any time.</p>
        </section>

        <section>
          <h2 className="font-semibold text-text-primary">Platform use</h2>
          <p className="mt-1">Likha is a portfolio demo platform. It is provided as-is without warranty. We reserve the right to remove content that violates guidelines and to suspend accounts that abuse the platform.</p>
        </section>

        <p className="pt-4 text-xs text-fog-gray">Last updated: June 2026.</p>
      </div>
    </div>
  )
}
