import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { resolveSEO } from '@/lib/seo/resolveSEO'
import { Container } from '@/components/ui/container'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SYSTEMS } from '@/lib/systems'

export async function generateMetadata() {
  return resolveSEO({
    titleKey: 'seo.demoCredentials.title',
    descriptionKey: 'seo.demoCredentials.description',
    intent: 'internal',
  })
}

interface Credential {
  email: string
  role: string
}

const SYSTEM_CREDENTIALS: Record<string, { auth: 'none' | 'table'; credentials?: Credential[] }> = {
  landing: { auth: 'none' },
  commerce: { auth: 'none' },
  marketplace: {
    auth: 'table',
    credentials: [
      { email: 'admin@marketplace.dev', role: 'Admin' },
      { email: 'alice@crafts.com', role: 'Vendor' },
      { email: 'bob@vintage.com', role: 'Vendor' },
      { email: 'buyer@test.com', role: 'Buyer' },
    ],
  },
  content: {
    auth: 'table',
    credentials: [
      { email: 'admin@content.dev', role: 'Admin' },
      { email: 'sarah@content.dev', role: 'Author' },
      { email: 'marcus@content.dev', role: 'Author' },
    ],
  },
  webapp: {
    auth: 'table',
    credentials: [
      { email: 'alice@demo.dev', role: 'OWNER (Acme Corp)' },
      { email: 'bob@demo.dev', role: 'ADMIN (Acme Corp)' },
      { email: 'carol@demo.dev', role: 'MEMBER (Acme Corp)' },
    ],
  },
  security: {
    auth: 'table',
    credentials: [
      { email: 'admin@security.dev', role: 'SYSTEM_ADMIN' },
      { email: 'orgadmin@security.dev', role: 'ORG_ADMIN' },
      { email: 'orguser@security.dev', role: 'ORG_USER' },
    ],
  },
}

export default async function DemoCredentialsPage() {
  const t = await getTranslations('demoCredentials')

  return (
    <main>
      <Container className="pb-32 md:pb-40">
        <div className="mb-8 flex items-center gap-2 text-sm text-text-secondary">
        <Link href="/demos" className="underline underline-offset-4 transition-colors hover:text-text-primary">
          {t('backToDemos')}
        </Link>
        <span className="opacity-30">·</span>
        <Link href="/services" className="underline underline-offset-4 transition-colors hover:text-text-primary">
          {t('backToServices')}
        </Link>
      </div>

      <h1 className="text-[var(--text-hero)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
        {t('title')}
      </h1>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-accent">{t('whatThisIs')}</p>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">{t('whatThisIsDesc')}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-text-tertiary">{t('whatThisIsNot')}</p>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">{t('whatThisIsNotDesc')}</p>
        </Card>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-text-secondary">
        {t('purpose')}
      </p>

      <p className="mt-4 rounded-lg border border-border-subtle bg-accent-subtle/50 px-4 py-3 text-sm text-accent">
        {t('allPassword')}: <code className="rounded bg-bg-surface px-2 py-0.5 font-mono text-sm">password123</code>
      </p>

      <div className="mt-8 space-y-8">
        {SYSTEMS.map((system) => {
          const info = SYSTEM_CREDENTIALS[system.id]
          if (!info) return null

          return (
            <section key={system.id}>
              <h2 className="text-[var(--text-card-title)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
                {system.name}
              </h2>
              <p className="mt-0.5 text-sm text-text-tertiary">{system.outcome}</p>

              {info.auth === 'none' && (
                <p className="mt-3 text-sm text-text-secondary">{t('noAuthRequired')}</p>
              )}

              {info.auth === 'table' && info.credentials && (
                <div className="mt-3 overflow-hidden rounded-lg border border-border-subtle">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border-subtle bg-bg-surface">
                        <th className="px-4 py-2 text-left font-medium text-text-primary">{t('password')}</th>
                        <th className="px-4 py-2 text-left font-medium text-text-primary">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {info.credentials.map((cred) => (
                        <tr key={cred.email} className="border-b border-border-subtle last:border-0">
                          <td className="px-4 py-2 font-mono text-xs text-text-secondary">{cred.email}</td>
                          <td className="px-4 py-2 text-xs text-text-secondary">{cred.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )
        })}
      </div>

      <div className="mt-12 flex items-center gap-4 border-t border-border-subtle pt-8">
        <Button href="/demos" variant="primary" size="md">
          {t('backToDemos')}
        </Button>
        <Button href="/services" variant="secondary" size="md">
          {t('backToServices')}
        </Button>
      </div>
      </Container>
    </main>
  )
}
