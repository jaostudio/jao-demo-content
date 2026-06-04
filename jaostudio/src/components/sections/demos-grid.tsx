'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { fadeUpBlur, fadeUpReduced, staggerSlow, staggerFast } from '@/lib/motion-variants'
import { SYSTEMS } from '@/lib/systems'

interface DemoDisplay {
  positioning: string
  audience: string
  url: string
  screenshot: string
  features: string[]
  slug: string
}

const display: Record<string, DemoDisplay> = {
  landing: {
    positioning: 'Turn visitors into booked appointments',
    audience: 'Service businesses — dental, construction, real estate',
    url: 'https://jao-demo-landing.vercel.app',
    screenshot: '/images/demos/landing-hero.png',
    features: ['Industry vertical engine', 'Lead capture forms', 'SEO-optimized content', '7-section funnel'],
    slug: 'landingpage-demo',
  },
  commerce: {
    positioning: 'From catalog to delivery, one platform',
    audience: 'Growing ecommerce businesses',
    url: 'https://jao-demo-commerce.vercel.app',
    screenshot: '/images/demos/commerce-hero.png',
    features: ['Product catalog', 'Persistent cart', 'Checkout flow', 'Order management'],
    slug: 'commerce-demo',
  },
  marketplace: {
    positioning: 'Run a marketplace, not a spreadsheet of vendors',
    audience: 'Platform businesses connecting buyers with vendors',
    url: 'https://jao-demo-marketplace.vercel.app',
    screenshot: '/images/demos/marketplace-hero.png',
    features: ['Vendor onboarding', 'Multi-vendor cart', 'Listing moderation', 'Role-based dashboards'],
    slug: 'marketplace-demo',
  },
  content: {
    positioning: 'From pitch to publish, tracked at every state',
    audience: 'Content teams and editorial departments',
    url: 'https://jao-demo-content.vercel.app',
    screenshot: '/images/demos/content-hero.png',
    features: ['Editorial state machine', 'Author/Admin roles', 'Category management', 'ISR-powered public pages'],
    slug: 'content-platform-demo',
  },
  webapp: {
    positioning: 'One platform for every org in your company',
    audience: 'Operations teams managing multiple business units',
    url: 'https://jao-demo-webapp.vercel.app',
    screenshot: '/images/demos/webapp-hero.png',
    features: ['Multi-tenant orgs', 'Kanban boards', 'Task management', 'Org-level RBAC'],
    slug: 'web-application-demo',
  },
  security: {
    positioning: 'Who did what, when — and who allowed it',
    audience: 'Compliance officers and IT administrators',
    url: 'https://jao-demo-security.vercel.app',
    screenshot: '/images/demos/security-hero.png',
    features: ['Audit trail', 'Role hierarchy', 'Data isolation', 'Security headers'],
    slug: 'database-security-demo',
  },
}

export function DemosGrid() {
  const prefersReducedMotion = useReducedMotion()
  const contentVariant = prefersReducedMotion ? fadeUpReduced : fadeUpBlur
  const staggerVariant = prefersReducedMotion ? staggerFast(0.03) : staggerSlow(0.05)

  return (
    <motion.div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      variants={staggerVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {SYSTEMS.map((system) => {
        const info = display[system.id]
        return (
          <motion.div
            key={system.id}
            variants={contentVariant}
            className="group rounded-xl border border-border-subtle bg-bg-surface p-5 transition-shadow hover:shadow-md"
          >
            <a
              href={info.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-lg"
            >
              <Image
                src={info.screenshot}
                alt={`${system.name} screenshot`}
                width={1440}
                height={900}
                className="w-full transition-opacity group-hover:opacity-90"
              />
            </a>
            <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-text-tertiary">{info.audience}</p>
            <h3 className="mt-2 text-base font-[var(--weight-medium)] text-text-primary">{system.name}</h3>
            <p className="mt-1 text-sm leading-relaxed text-text-secondary">{info.positioning}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {info.features.map((f) => (
                <span
                  key={f}
                  className="rounded-md border border-border-subtle bg-surface-hover px-2 py-0.5 text-[11px] text-text-tertiary"
                >
                  {f}
                </span>
              ))}
            </div>
            <a
              href={info.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-text-primary px-4 py-2 text-sm font-medium text-bg-primary hover:opacity-90"
            >
              Visit Live Site →
            </a>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
