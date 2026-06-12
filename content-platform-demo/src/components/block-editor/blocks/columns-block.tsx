interface ColumnsBlockProps {
  props: { left: string; right: string }
  onUpdate?: (props: Record<string, unknown>) => void
}

export function ColumnsBlock({ props, onUpdate }: ColumnsBlockProps) {
  if (!onUpdate) {
    return (
      <div className="my-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="prose prose-sm">{props.left}</div>
        <div className="prose prose-sm">{props.right}</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1">
        <label className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Left</label>
        <textarea
          value={props.left}
          onChange={(e) => onUpdate({ ...props, left: e.target.value })}
          rows={4}
          className="w-full rounded border border-border bg-card p-2 text-xs text-text-secondary focus:border-primary focus:outline-none"
        />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Right</label>
        <textarea
          value={props.right}
          onChange={(e) => onUpdate({ ...props, right: e.target.value })}
          rows={4}
          className="w-full rounded border border-border bg-card p-2 text-xs text-text-secondary focus:border-primary focus:outline-none"
        />
      </div>
    </div>
  )
}
