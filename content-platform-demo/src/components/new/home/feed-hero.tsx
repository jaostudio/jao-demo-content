export function FeedHero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-hairline bg-surface p-6 mb-6">
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 25% 50%, var(--color-reactor-green) 0%, transparent 50%), radial-gradient(circle at 75% 50%, var(--color-voltage-pink) 0%, transparent 50%)',
      }} />
      <p className="text-[11px] uppercase tracking-[0.2em] text-fog-gray mb-3">
        Process-first social publishing
      </p>
      <h1 className="text-[28px] font-semibold leading-none tracking-[-0.04em] text-text-primary">
        Follow the work before<br />it becomes finished.
      </h1>
      <p className="mt-3 max-w-md text-[14px] text-graphite leading-relaxed">
        Discover live works, process timelines, collections, and creative dispatches from Filipino artists.
      </p>
    </section>
  )
}
