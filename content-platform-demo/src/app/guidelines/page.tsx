import { AlertTriangle } from 'lucide-react'

export const metadata = {
  title: 'Guidelines',
  description: 'Community guidelines for Likha — a process-first platform for Filipino artists.',
}

export default function GuidelinesPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Demo Platform Notice</p>
            <p className="mt-1">Likha is a fictional demo platform. These guidelines are placeholder product copy and not legal advice.</p>
          </div>
        </div>
      </div>

      <h1 className="text-xl font-semibold text-text-primary">Community Guidelines</h1>
      <p className="mt-1 text-sm text-fog-gray">How we shape the space together.</p>

      <div className="mt-8 space-y-8">
        <section>
          <h2 className="text-sm font-semibold text-text-primary">Human-Made Declarations</h2>
          <p className="mt-2 text-sm text-text-secondary leading-relaxed">
            Likha is built for human creative work. Every work published on this platform includes an AI-Free declaration.
            Artists mark whether their work was created without generative AI assistance. This declaration appears on every
            work page and in the feed. Misrepresentation may result in content removal or account suspension.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-text-primary">AI-Assisted Work</h2>
          <p className="mt-2 text-sm text-text-secondary leading-relaxed">
            We recognize that AI tools are part of many creative workflows. If AI was used in any part of the process
            (research, drafting, reference generation, etc.), the artist is expected to disclose this in the work's
            process notes. The process timeline is designed to capture these details honestly.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-text-primary">Process Documentation</h2>
          <p className="mt-2 text-sm text-text-secondary leading-relaxed">
            Process is central to Likha. Works with process documentation are surfaced more prominently in the feed
            and explore sections. Artists are encouraged to document iterations, share sketches, and write about their
            creative decisions. This documentation builds trust with collectors and peers.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-text-primary">Moderation</h2>
          <p className="mt-2 text-sm text-text-secondary leading-relaxed">
            All works submitted for publication pass through a review queue. Moderators check for guideline compliance,
            accurate declarations, and quality of process documentation. Works that violate guidelines are returned to
            the artist with notes. Repeated violations may restrict publishing privileges.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-text-primary">Respecting Artists</h2>
          <p className="mt-2 text-sm text-text-secondary leading-relaxed">
            Likha is a space for mutual respect. Harassment, plagiarism, impersonation, and unauthorized reproduction
            of work are not tolerated. Comments and collections should credit original artists. Report violations through
            the moderation system.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-text-primary">Collections & Curation</h2>
          <p className="mt-2 text-sm text-text-secondary leading-relaxed">
            Collections are curated sets of works. When creating a collection, credit the artists whose work is included.
            Collections may be reported if they misrepresent or misuse an artist's work. Public collections are visible
            on artist profiles and in explore.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-text-primary">Comments</h2>
          <p className="mt-2 text-sm text-text-secondary leading-relaxed">
            Comments should be constructive and relevant to the work. Spam, self-promotion, and abusive language are
            removed. Artists can flag comments on their own work for moderator review.
          </p>
        </section>
      </div>
    </div>
  )
}
