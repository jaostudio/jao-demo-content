import { getTranslations } from 'next-intl/server'
import { HeroVisual } from './hero-visual'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/typography/badge'
import { LayeredFrame } from '@/components/ui/layout/layered-frame'

export async function Hero() {
  const t = await getTranslations('hero')

  return (
    <section className="relative pt-20 lg:pt-28 lg:min-h-[100svh] lg:flex lg:items-center">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 30% 20%, rgba(124,58,237,0.10), transparent 60%)',
        }}
      />

      <LayeredFrame glow>
        <div className="grid gap-6 lg:gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="order-1 lg:order-2">
            <HeroVisual />
          </div>

          <div className="order-2 lg:hidden flex flex-wrap gap-2 justify-center">
            <span className="rounded-full border border-accent-warm/30 bg-bg-elevated px-3 py-1 text-sm text-accent-warm">
              {t('availability')}
            </span>
          </div>

          <div className="flex flex-col gap-4 md:gap-9 order-3 lg:order-1 text-center items-center lg:text-left lg:items-start">
            <div className="hidden md:block">
              <Badge variant="accent">{t('badge')}</Badge>
            </div>

            <div className="flex flex-col gap-2 md:gap-4">
              <h1 className="max-w-4xl text-[var(--text-hero)] font-[var(--weight-medium)] leading-[var(--leading-display)] tracking-[var(--tracking-tight)] text-text-primary">
                {t('headline')}
              </h1>
              <p className="max-w-2xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
                {t('subtitle')}
              </p>
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

            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              <span className="rounded-full border border-border bg-bg-elevated px-3 py-1 text-sm text-text-tertiary">
                {t('notForEveryoneBadge')}
              </span>
            </div>

            <p className="max-w-lg text-sm leading-relaxed text-text-tertiary">
              {t('notForEveryoneDetail')}
            </p>
          </div>
        </div>
      </LayeredFrame>
    </section>
  )
}
