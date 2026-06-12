import { InlineEditor } from '../editor/inline-editor'

interface ParagraphBlockProps {
  props: { text: string }
  onUpdate?: (props: Record<string, unknown>) => void
}

export function ParagraphBlock({ props, onUpdate }: ParagraphBlockProps) {
  if (!onUpdate) {
    return <p className="text-body text-text-secondary leading-relaxed">{props.text || '\u00A0'}</p>
  }

  return (
    <p className="text-body text-text-secondary leading-relaxed">
      <InlineEditor
        value={props.text}
        onChange={(text) => onUpdate({ ...props, text })}
        className="w-full"
      />
    </p>
  )
}
