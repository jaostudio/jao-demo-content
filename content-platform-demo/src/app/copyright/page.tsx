import { AlertTriangle } from 'lucide-react'

export const metadata = {
  title: 'Copyright',
  description: 'Copyright and intellectual property information for Likha.',
}

export default function CopyrightPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Demo Platform Notice</p>
            <p className="mt-1">Likha is a fictional demo platform. This copyright policy is placeholder product copy and not legal advice.</p>
          </div>
        </div>
      </div>

      <h1 className="text-xl font-semibold text-text-primary">Copyright & Attribution</h1>
      <p className="mt-1 text-sm text-fog-gray">How intellectual property works on Likha.</p>

      <div className="mt-8 space-y-6 text-sm text-text-secondary leading-relaxed">
        <section>
          <h2 className="font-semibold text-text-primary">Artist ownership</h2>
          <p className="mt-1">All works published on Likha remain the intellectual property of their creators. Nothing on this platform transfers ownership of any work. Artists may publish elsewhere and may remove their work at any time.</p>
        </section>

        <section>
          <h2 className="font-semibold text-text-primary">Attribution</h2>
          <p className="mt-1">When sharing, collecting, or referencing another artist's work on Likha, attribution is required. Collections must credit the artists whose work is included. Process documentation should clearly delineate which parts of the work are the artist's original contribution.</p>
        </section>

        <section>
          <h2 className="font-semibold text-text-primary">Reporting infringement</h2>
          <p className="mt-1">If you believe your work has been posted without authorization, contact the moderation team. Likha will review and remove infringing content promptly.</p>
        </section>

        <p className="pt-4 text-xs text-fog-gray">Last updated: June 2026.</p>
      </div>
    </div>
  )
}
