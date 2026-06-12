import { MarkdownRenderer } from '@/components/markdown-renderer'

interface MarkdownBlockProps {
  props: { source: string }
  onUpdate?: (props: Record<string, unknown>) => void
}

export function MarkdownBlock({ props, onUpdate }: MarkdownBlockProps) {
  if (!onUpdate) {
    return <MarkdownRenderer content={props.source} />
  }

  return (
    <textarea
      value={props.source}
      onChange={(e) => onUpdate({ ...props, source: e.target.value })}
      rows={8}
      className="w-full rounded border border-border bg-card p-2 font-mono text-xs text-text-secondary focus:border-primary focus:outline-none"
    />
  )
}
