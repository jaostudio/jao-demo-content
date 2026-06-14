import { InlineEditor } from '../editor/inline-editor'

interface CalloutBlockProps {
  props: { variant: 'info' | 'warning' | 'tip'; text: string }
  onUpdate?: (props: Record<string, unknown>) => void
}

const variantStyles = {
  info: 'border-sky-200 bg-sky-50 text-sky-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  tip: 'border-emerald-200 bg-emerald-50 text-emerald-800',
}

export function CalloutBlock({ props, onUpdate }: CalloutBlockProps) {
  const style = variantStyles[props.variant] || variantStyles.info

  if (!onUpdate) {
    return (
      <div className={`my-6 rounded-lg border p-4 text-sm ${style}`}>
        {props.text || '\u00A0'}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <select
        value={props.variant}
        onChange={(e) => onUpdate({ ...props, variant: e.target.value })}
        className="rounded border border-border bg-card px-2 py-1 text-xs text-text-muted focus:border-primary focus:outline-none"
      >
        <option value="info">Info</option>
        <option value="warning">Warning</option>
        <option value="tip">Tip</option>
      </select>
      <div className={`rounded-lg border p-4 text-sm ${style}`}>
        <InlineEditor
          value={props.text}
          onChange={(text) => onUpdate({ ...props, text })}
          className="w-full"
        />
      </div>
    </div>
  )
}
