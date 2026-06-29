import { AlertTriangle } from 'lucide-react'

export const metadata = {
  title: 'Architecture',
  description: 'The technical architecture behind Likha — monorepo, Next.js, Hono, Turso, Prisma, and Vercel.',
}

export default function ArchitecturePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Portfolio Demo</p>
            <p className="mt-1">Likha is a fictional product demo. This architecture overview reflects a production-grade approach to a monorepo full-stack deployment.</p>
          </div>
        </div>
      </div>

      <h1 className="text-xl font-semibold text-text-primary">Architecture</h1>
      <p className="mt-1 text-sm text-fog-gray">How Likha is built and deployed.</p>

      <div className="mt-8 space-y-6 text-sm text-text-secondary leading-relaxed">
        <section>
          <h2 className="font-semibold text-text-primary">Monorepo structure</h2>
          <p className="mt-1">The project is organized as an npm workspaces monorepo with four main areas: the Next.js frontend (<code>src/</code>), a Hono API backend (<code>backend/</code>), a shared types package (<code>shared/</code>), and utility scripts (<code>scripts/</code>). The backend compiles separately with TypeScript and is served via Next.js API routes (<code>src/app/api/[[...route]]</code>).</p>
        </section>

        <section>
          <h2 className="font-semibold text-text-primary">Frontend</h2>
          <p className="mt-1">Next.js 16 with the App Router, Turbopack for development, and Tailwind CSS v4 for styling. Routes use a hybrid approach: route-group layouts for <code>/studio</code> and <code>/admin</code>, and per-page <code>AppShell</code> wrappers for public pages. Server components fetch data via <code>fetchAPI()</code> from the Hono backend. Client state is minimal — zustand for demo role persistence, React context for auth.</p>
        </section>

        <section>
          <h2 className="font-semibold text-text-primary">Backend</h2>
          <p className="mt-1">A Hono 4.7 API with file-based route modules. Authentication uses JWT tokens verified by middleware. The database layer uses Prisma 7.8 with the <code>@prisma/adapter-libsql</code> driver, connected to Turso (libSQL) in production and SQLite locally. Tests run against a local SQLite file with 59 passing tests.</p>
        </section>

        <section>
          <h2 className="font-semibold text-text-primary">Deployment</h2>
          <p className="mt-1">Deployed on Vercel with the monorepo root set to <code>content-platform-demo</code> and Node.js 22.x. The Vercel build runs <code>next build</code> (turbo), which compiles the backend TypeScript and generates the Prisma client in one pass. Environment variables <code>DATABASE_URL</code> and <code>TURSO_AUTH_TOKEN</code> connect to Turso in production.</p>
        </section>

        <p className="pt-4 text-xs text-fog-gray">Last updated: June 2026. Built by JAOstudio.</p>
      </div>
    </div>
  )
}
