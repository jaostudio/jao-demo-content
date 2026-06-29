import { AlertTriangle } from 'lucide-react'

export const metadata = {
  title: 'Disclaimer',
  description: 'Disclaimer for Likha — a fictional demo platform built by JAOstudio.',
}

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Demo Platform Notice</p>
            <p className="mt-1">Likha is a fictional demo platform. This disclaimer is placeholder product copy and not legal advice.</p>
          </div>
        </div>
      </div>

      <h1 className="text-xl font-semibold text-text-primary">Disclaimer</h1>
      <p className="mt-1 text-sm text-fog-gray">General information about Likha.</p>

      <div className="mt-8 space-y-6 text-sm text-text-secondary leading-relaxed">
        <section>
          <h2 className="font-semibold text-text-primary">Demo platform</h2>
          <p className="mt-1">Likha is a fictional product demo created by JAOstudio as a portfolio showcase. All content, branding, and platform copy are for demonstration purposes only. Likha is not a real, operating social platform.</p>
        </section>

        <section>
          <h2 className="font-semibold text-text-primary">No warranty</h2>
          <p className="mt-1">The platform is provided &ldquo;as is&rdquo; without warranty of any kind, express or implied. The demo may contain incomplete features, placeholder content, or intentional limitations meant to illustrate design and engineering decisions.</p>
        </section>

        <section>
          <h2 className="font-semibold text-text-primary">Content</h2>
          <p className="mt-1">Seeded works, artist profiles, and platform content are fictional. Any resemblance to real persons, living or dead, or actual products is coincidental. SVG artwork and visual assets are original creations for this demo.</p>
        </section>

        <section>
          <h2 className="font-semibold text-text-primary">Contact</h2>
          <p className="mt-1">This demo is maintained by JAOstudio. For inquiries about the portfolio or licensing, please reach out through the JAOstudio portfolio channels.</p>
        </section>

        <p className="pt-4 text-xs text-fog-gray">Last updated: June 2026.</p>
      </div>
    </div>
  )
}
