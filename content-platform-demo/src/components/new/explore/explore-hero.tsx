export function ExploreHero() {
  return (
    <section className="studio-frame relative overflow-hidden rounded-2xl border border-hairline bg-surface p-6 mb-6">
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 75% 25%, var(--color-voltage-pink) 0%, transparent 50%)',
      }} />
      <div className="pointer-events-none absolute right-4 top-4 opacity-[0.06]">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-text-primary">
          <path d="M5 5v14h14" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="17.5" y1="6.5" x2="8.5" y2="15.5" strokeLinecap="round"/>
          <circle cx="19.5" cy="19.5" r="1.5" fill="currentColor"/>
        </svg>
      </div>
      <p className="text-[11px] uppercase tracking-[0.2em] text-fog-gray mb-2">Discover</p>
      <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-text-primary">
        Curated gallery of works, artists, and creative process.
      </h1>
    </section>
  )
}
