"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { HeroData } from "@jaostudio/engine/types";
import { fadeUp, fadeUpBlur, transitions, durations, easing } from "@/lib/motion-tokens";

type Props = {
  data: HeroData;
  image: string;
  stats?: { value: string; label: string }[];
  playfairClassName?: string;
};

export function HeroLegal({ data, image, stats, playfairClassName }: Props) {
  return (
    <>
      <link rel="preload" as="image" href={image} fetchPriority="high" />
      <section data-testid="hero" className="relative overflow-hidden bg-indigo-950 py-24 md:py-36">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2 md:gap-16">
        <div className="relative z-10">
          <motion.h1
            data-testid="hero-heading"
            variants={fadeUpBlur}
            initial="hidden"
            animate="visible"
            transition={transitions.hero}
            className={`text-4xl font-semibold tracking-tight text-neutral-50 md:text-5xl ${playfairClassName ?? ""}`}
          >
            {data.title}
          </motion.h1>

          <motion.p
            data-testid="hero-subtitle"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ ...transitions.normal, delay: 0.1 }}
            className="mt-6 text-lg leading-relaxed text-neutral-400"
          >
            {data.subtitle}
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ ...transitions.normal, delay: 0.2 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              data-testid="hero-cta"
              href={data.cta.href}
              className="rounded-xl bg-[var(--theme-accent)] px-6 py-3 font-medium text-neutral-900 transition-all hover:brightness-110"
            >
              {data.cta.label}
            </Link>

            {data.secondaryCta && (
              <Link
                href={data.secondaryCta.href}
                className="rounded-xl border border-neutral-600 px-6 py-3 font-medium text-neutral-300 transition-colors hover:border-neutral-500 hover:text-neutral-100"
              >
                {data.secondaryCta.label}
              </Link>
            )}
          </motion.div>

          {stats && stats.length > 0 && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: durations.slow, ease: easing.out, delay: 0.35 }}
              className="mt-12 flex flex-wrap gap-x-8 gap-y-4"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <span className="text-lg font-bold text-[var(--theme-accent)]">{stat.value}</span>
                  <span className="text-sm text-neutral-500">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: durations.xl, ease: easing.out, delay: 0.15 }}
          className="relative aspect-[4/3] overflow-hidden rounded-xl md:aspect-[3/4]"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/60 to-transparent" />
        </motion.div>
      </div>
    </section>
    </>
  );
}
