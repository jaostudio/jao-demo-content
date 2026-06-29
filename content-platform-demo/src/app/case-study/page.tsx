import { AlertTriangle } from 'lucide-react'

export const metadata = {
  title: 'Case Study',
  description: 'How Likha was built — a process-first creative publishing platform by JAOstudio.',
}

export default function CaseStudyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Portfolio Demo</p>
            <p className="mt-1">Likha is a fictional product demo built by JAOstudio. This case study documents the design and engineering decisions behind the platform.</p>
          </div>
        </div>
      </div>

      <h1 className="text-xl font-semibold text-text-primary">Case Study: Likha</h1>
      <p className="mt-1 text-sm text-fog-gray">A process-first creative publishing platform.</p>

      <div className="mt-8 space-y-6 text-sm text-text-secondary leading-relaxed">
        <section>
          <h2 className="font-semibold text-text-primary">The premise</h2>
          <p className="mt-1">Likha is a social platform where artists publish their creative process — from early sketches to finished works. The tagline &ldquo;Follow the work before it becomes finished&rdquo; captures the core value proposition: audiences follow creative journeys, not just polished results.</p>
        </section>

        <section>
          <h2 className="font-semibold text-text-primary">Design system</h2>
          <p className="mt-1">The visual identity is built around the &ldquo;Process Mark&rdquo; — a brand motif of a right-angled path with a terminal dot, representing a creative journey in progress. The palette uses warm paper tones (light mode) against soft graphite (dark mode), with green reserved for action and pink for signal/review elements. Motion is achieved through CSS transitions and IntersectionObserver — no Framer Motion.</p>
        </section>

        <section>
          <h2 className="font-semibold text-text-primary">Engineering stack</h2>
          <p className="mt-1">Next.js 16 (App Router, Turbopack), Hono 4.7 API backend, Prisma 7.8 with Turso (libSQL), deployed on Vercel. The monorepo uses npm workspaces. Authentication is handled via next-auth with JWTs stored in localStorage for the Hono API layer.</p>
        </section>

        <section>
          <h2 className="font-semibold text-text-primary">Key decisions</h2>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>Shell components are layout-only — auth enforcement happens at the page level.</li>
            <li>Hydration-sensitive persisted state uses a <code>useMounted()</code> guard to prevent React mismatches.</li>
            <li>Prisma 7 requires the libSQL adapter explicitly — <code>new PrismaClient()</code> alone fails.</li>
            <li>Turbo bypasses npm lifecycle hooks — build commands must be chained inline.</li>
            <li>Demo accounts with seeded content let reviewers explore all features without registration.</li>
          </ul>
        </section>

        <p className="pt-4 text-xs text-fog-gray">Last updated: June 2026. Built by JAOstudio.</p>
      </div>
    </div>
  )
}
