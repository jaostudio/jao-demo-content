export function ExploreHero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-hairline bg-surface p-6 mb-6">
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 75% 25%, var(--color-voltage-pink) 0%, transparent 50%)',
      }} />
      <p className="text-[11px] uppercase tracking-[0.2em] text-fog-gray mb-2">Discover</p>
      <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-text-primary">
        Explore works, artists, and creative process.
      </h1>
    </section>
  )
}
