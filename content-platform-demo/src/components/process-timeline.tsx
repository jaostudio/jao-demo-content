interface TimelineEntry {
  version: number
  title: string
  changeNote: string | null
  createdAt: string
}

interface ProcessTimelineProps {
  entries: TimelineEntry[]
}

export function ProcessTimeline({ entries }: ProcessTimelineProps) {
  if (entries.length === 0) return null

  return (
    <div className="space-y-3">
      <h3 className="text-[13px] font-semibold text-text-primary">Process Timeline</h3>
      <div className="space-y-0">
        {entries.map((entry, i) => (
          <div key={entry.version} className="relative flex gap-3 pb-3">
            {i < entries.length - 1 && (
              <div className="absolute left-[7px] top-[18px] h-full w-px bg-hairline" />
            )}
            <div className={`mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 ${i === 0 ? 'border-reactor-green bg-reactor-green/20' : 'border-hairline bg-surface'}`} />
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-medium text-text-primary">{entry.title}</p>
              {entry.changeNote && (
                <p className="text-[11px] text-fog-gray mt-0.5">{entry.changeNote}</p>
              )}
              <p className="text-[10px] text-ash mt-0.5">
                {new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
