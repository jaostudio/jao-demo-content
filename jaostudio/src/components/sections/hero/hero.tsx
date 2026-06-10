import { getTranslations } from 'next-intl/server'
import { HeroVisual } from './hero-visual'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/typography/badge'
import { LayeredFrame } from '@/components/ui/layout/layered-frame'

export async function Hero() {
  const t = await getTranslations('hero')

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 30% 20%, rgba(124,58,237,0.10), transparent 60%)',
        }}
      />

      <LayeredFrame className="pt-20 lg:pt-28" glow>
        <div className="grid gap-6 lg:gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="flex flex-col gap-5 md:gap-9">
            <div>
              <Badge variant="accent">{t('badge')}</Badge>
            </div>

            <div className="flex flex-col gap-3 md:gap-4">
              <h1 className="max-w-4xl text-[var(--text-hero)] font-[var(--weight-medium)] leading-[var(--leading-display)] tracking-[var(--tracking-tight)] text-text-primary">
                {t('headline')}
              </h1>
              <p className="max-w-2xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
                {t('subtitle')}
              </p>
              <div className="flex flex-wrap gap-2 max-sm:hidden">
                <span className="rounded-full border border-accent-warm/20 bg-accent-warm-soft px-3 py-1 text-sm text-accent-warm">
                  {t('availability')}
                </span>
                <span className="rounded-full border border-border bg-surface-hover px-3 py-1 text-sm text-text-tertiary">
                  {t('notForEveryoneBadge')}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button
                href="/demos"
                size="lg"
                trackingLabel="hero_start_project"
                className="w-full sm:w-auto text-base py-3 sm:py-2.5"
              >
                {t('ctaPrimary')}
              </Button>
              <Button
                href="/services"
                variant="secondary"
                size="lg"
                trackingLabel="hero_view_projects"
                className="w-full sm:w-auto text-base py-3 sm:py-2.5"
              >
                {t('ctaSecondary')}
              </Button>
            </div>

            <p className="max-w-lg text-xs leading-relaxed text-text-tertiary/70">
              {t('notForEveryoneDetail')}
            </p>
          </div>

          <HeroVisual />
        </div>
      </LayeredFrame>
    </section>
  )
}
