'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

interface CategoryTile {
  id: string
  name: string
  slug: string
  coverUrl: string | null
  listingCount?: number
}

interface CategoryGridProps {
  categories: CategoryTile[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const reduce = useReducedMotion()

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  }
  const tileVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:py-24">
      <motion.div
        initial={reduce ? false : 'hidden'}
        whileInView={reduce ? undefined : 'visible'}
        viewport={{ once: true, margin: '-100px' }}
        variants={reduce ? undefined : containerVariants}
      >
        <motion.div
          variants={reduce ? undefined : tileVariants}
          className="mb-10 flex items-end justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Shop by Craft
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-neutral-800 dark:text-neutral-100 sm:text-4xl">
              Find your favorite tradition
            </h2>
          </div>
          <Link
            href="/listings"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400"
          >
            All categories
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              variants={reduce ? undefined : tileVariants}
            >
              <CategoryCard category={cat} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

function CategoryCard({ category }: { category: CategoryTile }) {
  const reduce = useReducedMotion()

  return (
    <Link
      href={`/listings?category=${category.slug}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-200 shadow-warm-sm dark:bg-neutral-800"
    >
      {/* Image */}
      {category.coverUrl ? (
        <motion.div
          className="absolute inset-0"
          whileHover={reduce ? undefined : { scale: 1.08 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Image
            src={category.coverUrl}
            alt={category.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
          />
        </motion.div>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-5xl font-bold text-neutral-400">
          {category.name.charAt(0)}
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/85 via-neutral-900/20 to-transparent transition-opacity duration-300 group-hover:from-neutral-900/95" />

      {/* Glassmorphism label */}
      <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4">
        <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-md transition-all duration-300 group-hover:border-white/30 group-hover:bg-white/15 group-hover:translate-y-[-2px] sm:p-4">
          <h3 className="font-semibold text-white text-sm sm:text-base">
            {category.name}
          </h3>
          {category.listingCount !== undefined && (
            <p className="mt-0.5 text-[11px] text-white/70">
              {category.listingCount} {category.listingCount === 1 ? 'item' : 'items'}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
