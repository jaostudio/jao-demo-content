'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { HeartHandshake, Leaf, ShieldCheck } from 'lucide-react'

const reasons = [
  {
    icon: HeartHandshake,
    title: 'Support local artisans',
    description:
      'Every purchase goes directly to a Filipino maker. No middlemen, no algorithms — just real people making real things.',
  },
  {
    icon: Leaf,
    title: 'Authentic Filipino craft',
    description:
      'Hand-selected pieces from artisan families across the islands. Each one tells a story of tradition, technique, and place.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure and simple',
    description:
      'Protected payments, easy returns, and island-wide delivery. We handle the logistics so you can focus on the joy of the find.',
  },
]

export function WhyLikha() {
  const reduce = useReducedMotion()

  return (
    <section className="bg-neutral-50 py-20 dark:bg-neutral-950 sm:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
            Why Likha
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-neutral-800 dark:text-neutral-100 sm:text-4xl">
            More than a marketplace
          </h2>
          <p className="mt-3 text-base text-neutral-600 dark:text-neutral-400">
            Likha means &ldquo;to create&rdquo; in Filipino. We exist to make it easy
            to discover, support, and celebrate the work of Filipino makers.
          </p>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, delay: reduce ? 0 : 0.2 }}
          className="mt-14 grid gap-6 md:grid-cols-3"
        >
          {reasons.map((r) => (
            <ReasonCard key={r.title} {...r} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function ReasonCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof HeartHandshake
  title: string
  description: string
}) {
  return (
    <div className="group rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-warm-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-primary-700">
      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 transition-colors group-hover:bg-primary-500 group-hover:text-white dark:bg-primary-900/40 dark:text-primary-300 dark:group-hover:bg-primary-500 dark:group-hover:text-white">
        <Icon className="h-6 w-6" strokeWidth={2} />
      </div>
      <h3 className="font-semibold text-neutral-800 dark:text-neutral-100">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        {description}
      </p>
    </div>
  )
}
