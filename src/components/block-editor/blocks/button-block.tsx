import Link from 'next/link'

interface ButtonBlockProps {
  props: { text: string; href: string; variant?: 'primary' | 'secondary' | 'outline' }
  onUpdate?: (props: Record<string, unknown>) => void
}

export function ButtonBlock({ props, onUpdate }: ButtonBlockProps) {
  if (!onUpdate) {
    return (
      <div className="my-6">
        <Link href={props.href || '#'} className={`btn btn-${props.variant ?? 'primary'}`}>
          {props.text || 'Button'}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="rounded bg-primary px-4 py-2 text-sm font-medium text-white">{props.text || 'Button'}</span>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={props.text}
          onChange={(e) => onUpdate({ ...props, text: e.target.value })}
          placeholder="Button text..."
          className="flex-1 rounded border border-border bg-card px-2 py-1 text-xs text-text-secondary focus:border-primary focus:outline-none"
        />
        <input
          type="url"
          value={props.href}
          onChange={(e) => onUpdate({ ...props, href: e.target.value })}
          placeholder="https://..."
          className="flex-1 rounded border border-border bg-card px-2 py-1 text-xs text-text-muted focus:border-primary focus:outline-none"
        />
        <select
          value={props.variant ?? 'primary'}
          onChange={(e) => onUpdate({ ...props, variant: e.target.value })}
          className="rounded border border-border bg-card px-2 py-1 text-xs text-text-muted focus:border-primary focus:outline-none"
        >
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="outline">Outline</option>
        </select>
      </div>
    </div>
  )
}
