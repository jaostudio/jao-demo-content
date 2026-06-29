interface FeedSectionProps {
  title: string
  signal?: boolean
  children: React.ReactNode
  className?: string
}

export function FeedSection({ title, signal, children, className = '' }: FeedSectionProps) {
  return (
    <section className={`mb-8 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        {signal && <span className="inline-block h-1.5 w-1.5 rounded-full bg-reactor-green" />}
        <h2 className="text-[13px] font-semibold text-text-primary uppercase tracking-wider">{title}</h2>
      </div>
      {children}
    </section>
  )
}
