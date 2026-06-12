'use client'

import { useTranslations } from 'next-intl'
import { motion, useReducedMotion } from 'framer-motion'
import { Section } from '@/components/ui/section'
import { LayeredFrame } from '@/components/ui/layout/layered-frame'
import { Badge } from '@/components/typography/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Disclosure } from '@/components/ui/disclosure'
import { fadeUp, fadeUpReduced, scaleFade, slideInLeft, slideInReduced, stagger } from '@/lib/motion-variants'

const individualApproach = [
  {
    label: 'Direct access',
    detail: 'You work directly with the engineer building the system. No account managers, no handoffs, no communication layers.',
  },
  {
    label: 'Async-first workflow',
    detail: 'Written communication with organized threads. Synchronous calls when they add clarity. No Slack firehose.',
  },
  {
    label: 'Concurrent cap',
    detail: 'Limited to 1–2 active engagements. Every project gets focused attention without context-switching overhead.',
  },
  {
    label: 'Structured scope',
    detail: 'Changes follow a clear process: flag, evaluate impact, adjust timeline or budget, proceed. No silent scope creep.',
  },
  {
    label: 'Production mindset',
    detail: 'Every project — regardless of size — ships with CI/CD, analytics, error monitoring, and documentation.',
  },
]

const noGoItems = [
  'WordPress customization or template-based builds — custom architecture only',
  'Rushed overnight delivery — quality requires structured timelines',
  'SEO guarantees — measurable improvements yes, guarantees no',
  'Maintenance for legacy PHP or unmaintained stacks',
  'Unmanaged scope creep — changes handled through structured process',
  'Unpaid discovery or speculative design work',
  'Multi-channel communication sprawl — async-first, organized',
]

export function StudioContent() {
  const t = useTranslations('studio')
  const prefersReducedMotion = useReducedMotion()

  const fade = prefersReducedMotion ? fadeUpReduced : fadeUp
  const slideIn = prefersReducedMotion ? slideInReduced : slideInLeft

  return (
    <>
      <section className="relative pt-20 lg:pt-28">
        <LayeredFrame glow>
          <motion.div
            className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center"
            variants={fade}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            <Badge variant="accent">{t('badge')}</Badge>
            <h1 className="text-[var(--text-hero)] font-[var(--weight-medium)] leading-[var(--leading-display)] tracking-[var(--tracking-tight)] text-text-primary">
              {t('heading')}
            </h1>
            <p className="max-w-2xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
              {t('description')}
            </p>
          </motion.div>
        </LayeredFrame>
      </section>

      <Section variant="alt" id="background" glow className="" density="compact">
        <motion.div
          className="mx-auto flex max-w-3xl flex-col gap-6"
          variants={fade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <p className="text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
            {t('background1')}
          </p>
          <p className="text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
            {t('background2')}
          </p>
        </motion.div>
      </Section>

      <Section id="value" className="" density="normal">
        <motion.div
          className="flex flex-col gap-4"
          variants={fade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <Badge variant="accent">What that means for you</Badge>
          <h2 className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
            Experience you can count on
          </h2>
        </motion.div>

        <motion.div
          className="mt-8 grid gap-4 md:grid-cols-3"
          variants={prefersReducedMotion ? stagger(0.01) : stagger(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {[1, 2, 3].map((i) => (
            <motion.div key={i} variants={prefersReducedMotion ? fadeUpReduced : scaleFade}>
              <Card className="flex h-full flex-col gap-2 p-5">
                <p className="text-[var(--text-body)] leading-relaxed text-text-secondary">
                  {t(`value${i}`)}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      <Section variant="alt" id="liveviewer" glow className="" density="normal">
        <motion.div
          className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center"
          variants={fade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <Badge variant="accent">My own tool</Badge>
          <h2 className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
            {t('liveviewerTitle')}
          </h2>
          <p className="max-w-xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
            {t('liveviewerDesc')}
          </p>
          <Button href="https://jao-liveviewer.vercel.app" size="lg" trackingLabel="studio_liveviewer_cta">
            {t('liveviewerCta')}
          </Button>
        </motion.div>
      </Section>

      <Section id="operate" className="">
        <motion.div
          className="flex flex-col gap-4"
          variants={fade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <Badge variant="accent">How I Operate</Badge>
          <h2 className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
            Direct, structured, intentional
          </h2>
          <p className="max-w-2xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
            The way I work is as important as the technology I use. These five principles define every engagement.
          </p>
        </motion.div>

        <motion.div
          className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3 max-md:hidden"
          variants={prefersReducedMotion ? stagger(0.01) : stagger(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {individualApproach.map((item) => (
            <motion.div key={item.label} variants={prefersReducedMotion ? fadeUpReduced : scaleFade}>
              <Card className="flex h-full flex-col gap-2">
                <p className="text-[var(--text-card-title)] font-[var(--weight-medium)] text-text-primary">
                  {item.label}
                </p>
                <p className="text-[var(--text-body)] leading-relaxed text-text-secondary">{item.detail}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-8 flex flex-col gap-3 md:hidden">
          {individualApproach.map((item) => (
            <Disclosure key={item.label} title={item.label}>
              <p className="text-sm text-text-secondary">{item.detail}</p>
            </Disclosure>
          ))}
        </div>
      </Section>

      <Section variant="alt" id="filter" className="">
        <motion.div
          className="flex flex-col gap-4"
          variants={fade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <Badge variant="accent">What I Don&apos;t Do</Badge>
          <h2 className="text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
            Clear boundaries
          </h2>
          <p className="max-w-2xl text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
            Saying &ldquo;no&rdquo; to the wrong projects is as important as saying &ldquo;yes&rdquo; to the right ones.
            These boundaries protect the quality of every engagement.
          </p>
        </motion.div>

        <motion.ul
          className="mt-8 flex flex-col gap-3"
          variants={prefersReducedMotion ? stagger(0.01) : stagger(0.06)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {noGoItems.map((item) => (
            <motion.li
              key={item}
              variants={slideIn}
              className="flex items-start gap-3 text-[var(--text-body)] leading-relaxed text-text-secondary"
            >
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-warm" />
              {item}
            </motion.li>
          ))}
        </motion.ul>
      </Section>

      <Section id="cta" className="pb-12" density="normal">
        <motion.div
          className="flex flex-col items-center gap-6 text-center"
          variants={fade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <Badge variant="accent">Ready to Build?</Badge>
          <h2 className="max-w-xl text-[var(--text-section)] font-[var(--weight-medium)] tracking-[var(--tracking-tight)] text-text-primary">
            Let&apos;s talk about your project
          </h2>
          <p className="max-w-lg text-[var(--text-body)] leading-[var(--leading-relaxed)] text-text-secondary">
            Every engagement starts with a conversation about the problem, the constraints, and what success looks
            like. No commitment required.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/projects" size="lg">
              {t('cta')}
            </Button>
            <Button href="/#contact" size="lg" variant="secondary" trackingLabel="studio_cta_contact">
              Discuss a Project
            </Button>
          </div>
        </motion.div>
      </Section>
    </>
  )
}
