"use client";

import { Playfair_Display } from "next/font/google";
import Link from "next/link";
import { motion } from "framer-motion";
import type { IndustryProfile } from "@jaostudio/engine/types";
import { resolveTheme } from "@jaostudio/engine/theme";
import { HomeHero } from "./HomeHero";
import { useState } from "react";
import Image from "next/image";
import { Zap, Target, Search } from "lucide-react";
import { transitions, durations, easing, staggers } from "@/lib/motion-tokens";
import { FooterAdapter } from "@/components/sections/footer/FooterAdapter";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
});

type Props = {
  profiles: IndustryProfile[];
};

function bySlug(profiles: IndustryProfile[], slug: string) {
  return profiles.find((p) => p.slug === slug);
}

export function HomePageClient({ profiles }: Props) {
  const construction = bySlug(profiles, "summit-ridge");
  const dental = bySlug(profiles, "brightsmile");
  const legal = bySlug(profiles, "harrison-cole");

  return (
    <main>
      <HomeHero />

      {construction && <ShowcaseConstruction profile={construction} />}
      {dental && <ShowcaseDental profile={dental} />}
      {legal && <ShowcaseLegal profile={legal} />}

      <AboutSection />
      <TrustBar />
      <TestimonialQuote />
      <ContactSection />
      <FooterAdapter
        name="JAO Studio"
        email="hello@jaostudio.com"
        phone="+1 (555) 123-4567"
      />
    </main>
  );
}

function ShowcaseConstruction({ profile }: { profile: IndustryProfile }) {
  const t = resolveTheme(profile.theme);
  const style = { "--theme-primary": t.primary[500], "--theme-accent": t.accent[500] } as React.CSSProperties;
  const heroData = profile.sections.find((s) => s.type === "hero")?.data;
  const caseStudies = profile.sections.find((s) => s.type === "case-studies")?.data;
  const projects = caseStudies && "studies" in caseStudies
    ? (caseStudies as { studies: { title: string }[] }).studies.map((s) => s.title)
    : [];

  return (
      <section id="work" style={style} className="relative min-h-screen overflow-hidden bg-slate-950">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${profile.imagery.hero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

        <div className="relative z-10 flex min-h-screen flex-col justify-center px-6 py-24 md:px-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...transitions.fast, delay: 0.05 }}
            className="mb-4 text-sm font-semibold uppercase tracking-widest text-amber-500"
          >
            {profile.company.category}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl text-4xl font-bold tracking-tight text-slate-50 md:text-6xl"
          >
            {profile.company.tagline}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...transitions.normal, delay: 0.1 }}
            className="mt-4 max-w-xl text-lg text-slate-400"
          >
            {heroData && "subtitle" in heroData
              ? (heroData as { subtitle: string }).subtitle
              : ""}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...transitions.normal, delay: 0.15 }}
            className="mt-6 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold uppercase tracking-wider text-slate-500"
          >
            COMMERCIAL <span className="text-slate-700">•</span> INDUSTRIAL{" "}
            <span className="text-slate-700">•</span> HEALTHCARE{" "}
            <span className="text-slate-700">•</span> EDUCATION
          </motion.div>

          {projects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...transitions.normal, delay: 0.2 }}
              className="mt-8"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Recent Work
              </span>
              <div className="mt-2 space-y-1">
                {projects.map((name) => (
                  <p key={name} className="text-sm font-medium text-slate-300">
                    {name}
                  </p>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...transitions.normal, delay: 0.3 }}
            className="mt-10"
          >
            <Link
              href={`/${profile.slug}`}
              className="inline-block rounded-lg bg-amber-500 px-8 py-3 font-semibold text-slate-950 transition-all hover:brightness-110"
            >
              View Project
            </Link>
          </motion.div>

          <div className="absolute -top-4 right-0 w-28 h-28 rounded-xl shadow-2xl overflow-hidden border-2 border-slate-700/50 hidden md:block">
            <Image
              src="/industry-assets/summit-ridge/thumbnail.jpg"
              alt="Summit Ridge site preview"
              width={112}
              height={112}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </section>
  );
}

function ShowcaseDental({ profile }: { profile: IndustryProfile }) {
  const t = resolveTheme(profile.theme);
  const style = { "--theme-primary": t.primary[500], "--theme-accent": t.accent[500] } as React.CSSProperties;

  return (
    <section style={style} className="bg-white py-16 dark:bg-neutral-950 md:py-24">
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2 md:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: durations.slow, ease: easing.out }}
          className="aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800"
        >
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${profile.imagery.hero})` }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: durations.slow, ease: easing.out, delay: 0.1 }}
        >
          <span className="text-sm font-medium uppercase tracking-widest text-[var(--theme-primary)]">
            {profile.company.category}
          </span>

          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-3xl">
            {profile.company.tagline}
          </h2>

          <p className="mt-3 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            {profile.company.description}
          </p>

          <div className="mt-6 space-y-2">
            {["Comfort-focused care.", "Same-day appointments available.", "Digital workflows."].map(
              (item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-[var(--theme-primary)]" />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">{item}</span>
                </div>
              )
            )}
          </div>

          <Link
            href={`/${profile.slug}`}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--theme-primary)] px-6 py-3 text-sm font-medium text-white transition-all hover:brightness-110"
          >
            View Project
          </Link>

          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-xl shadow-lg overflow-hidden border-2 border-white dark:border-neutral-800 hidden md:block">
            <Image
              src="/industry-assets/brightsmile/gallery-1.jpg"
              alt="BrightSmile gallery preview"
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ShowcaseLegal({ profile }: { profile: IndustryProfile }) {
  const t = resolveTheme(profile.theme);
  const style = { "--theme-primary": t.primary[500], "--theme-accent": t.accent[500] } as React.CSSProperties;

  return (
    <section style={style} className="bg-neutral-950 py-16 md:py-24">
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...transitions.normal, delay: 0.05 }}
          className={`text-sm font-medium uppercase tracking-widest text-indigo-400 ${playfair.className}`}
        >
          {profile.company.category}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: durations.xl, ease: easing.out }}
          className={`mt-4 text-3xl font-semibold tracking-tight text-neutral-50 md:text-4xl ${playfair.className}`}
        >
          {profile.company.tagline}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...transitions.normal, delay: 0.1 }}
          className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-neutral-400"
        >
          {profile.company.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...transitions.normal, delay: 0.15 }}
          className="mt-6"
        >
          <div className="inline-block rounded-full border border-neutral-700 px-5 py-1.5 text-sm text-neutral-400">
            25 Years of Combined Experience
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...transitions.normal, delay: 0.25 }}
        >
          <Link
            href={`/${profile.slug}`}
            className="mt-8 inline-flex items-center gap-2 rounded-lg border border-neutral-600 px-8 py-3 text-sm font-medium text-neutral-300 transition-colors hover:border-neutral-500 hover:text-neutral-100"
          >
            View Project
          </Link>
        </motion.div>

        <div className="absolute -bottom-4 left-4 w-24 h-24 rounded-xl shadow-2xl overflow-hidden border-2 border-neutral-700 hidden md:block">
          <Image
            src="/industry-assets/harrison-cole/gallery-1.jpg"
            alt="Harrison & Cole gallery preview"
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="border-t border-neutral-200 bg-neutral-50 py-20 dark:border-neutral-800 dark:bg-neutral-900 md:py-28">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={transitions.normal}
          className="text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            How We Build
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
            Every site starts with the same question: what does this business need
            to convert? From there, we design the UX flow, choose the motion language,
            and build the interaction patterns unique to that industry.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: staggers.slow },
            },
          }}
          className="mt-16 grid gap-8 md:grid-cols-3"
        >
          {[
            {
              icon: Zap,
              title: "Fast by default",
              desc: "Every page targets 90+ Lighthouse scores. Static generation, optimized images, minimal JavaScript — performance is not an afterthought.",
            },
            {
              icon: Target,
              title: "Built for conversion",
              desc: "Section order, CTA placement, and trust signals follow industry-specific buying psychology — not a generic template.",
            },
            {
              icon: Search,
              title: "SEO without plugins",
              desc: "Unique meta tags, structured data, semantic HTML, and canonical URLs. No WordPress plugins needed.",
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
              }}
              className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950"
            >
              <item.icon className="h-8 w-8 text-neutral-700 dark:text-neutral-300" />
              <h3 className="mt-4 font-semibold text-neutral-900 dark:text-neutral-50">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TrustBar() {
  return (
    <section className="border-t border-neutral-200 bg-white py-12 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          Trusted by leading businesses
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {["BuiltRight Corp", "MedCore Holdings", "Pinnacle Legal Group"].map((name) => (
            <span
              key={name}
              className="text-sm font-semibold text-neutral-300 dark:text-neutral-600"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialQuote() {
  return (
    <section className="border-t border-neutral-200 bg-white py-16 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-xl italic leading-relaxed text-neutral-600 dark:text-neutral-400">
          &ldquo;The budget estimator on our new site has increased qualified leads by 40%. It&apos;s become our most valuable sales tool.&rdquo;
        </p>
        <p className="mt-6 font-semibold text-neutral-900 dark:text-neutral-50">
          &mdash; Marcus Tan, Summit Ridge Construction
        </p>
      </div>
    </section>
  );
}

function ContactSection() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:hello@jaostudio.com?subject=Portfolio Inquiry&body=${encodeURIComponent(message)}%0A%0AFrom: ${encodeURIComponent(email)}`;
  };

  return (
    <section className="border-t border-neutral-200 bg-neutral-900 py-20 dark:border-neutral-800 dark:bg-neutral-950 md:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={transitions.normal}
          className="text-3xl font-semibold tracking-tight text-neutral-50"
        >
          Let&apos;s build something together.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...transitions.normal, delay: 0.05 }}
          className="mt-4 text-lg text-neutral-400"
        >
          Have a project in mind? Reach out and let us discuss what your
          business needs.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...transitions.normal, delay: 0.1 }}
          className="mt-8"
        >
          <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-500"
            />
            <textarea
              placeholder="Tell us about your project"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-500"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-neutral-700 px-8 py-3 text-sm font-medium text-white transition-all hover:bg-neutral-600"
            >
              Send message
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
