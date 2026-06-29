export function HowLikhaWorks() {
  const steps = [
    { number: 1, title: 'Publish a work', description: 'Share your creative output — live, process notes, or finished pieces.' },
    { number: 2, title: 'Document the process', description: 'Add versions, process notes, and timelapses as your work evolves.' },
    { number: 3, title: 'Build a studio following', description: 'Collectors and peers follow your process, not just your portfolio.' },
  ]

  return (
    <section className="studio-frame relative overflow-hidden rounded-xl p-5 mt-8" style={{ border: '1px solid var(--brand-border)', backgroundColor: 'var(--brand-surface)' }}>
      <p className="text-[11px] uppercase tracking-[0.2em] text-fog-gray mb-4">How Likha Works</p>
      <div className="relative">
        {/* Vertical process line connector */}
        <div className="absolute left-[13px] top-6 bottom-6 w-px" style={{ backgroundColor: 'var(--brand-border)' }} />

        <div className="space-y-6">
          {steps.map((step) => (
            <div key={step.number} className="relative flex gap-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: 'var(--brand-bg)', border: '1.5px solid var(--brand-border)' }}>
                <span className="text-[11px] font-semibold" style={{ color: 'var(--brand-muted)' }}>{step.number}</span>
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-medium text-text-primary">{step.title}</p>
                <p className="text-[12px] text-graphite mt-0.5">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
