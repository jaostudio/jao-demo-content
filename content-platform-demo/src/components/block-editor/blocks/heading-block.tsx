import { InlineEditor } from '../editor/inline-editor'

interface HeadingBlockProps {
  props: { level: 2 | 3; text: string }
  onUpdate?: (props: Record<string, unknown>) => void
}

export function HeadingBlock({ props, onUpdate }: HeadingBlockProps) {
  const Tag = props.level === 2 ? 'h2' : 'h3'

  if (!onUpdate) {
    return <Tag className="font-display font-bold text-text-primary">{props.text || '\u00A0'}</Tag>
  }

  return (
    <Tag className="font-display font-bold text-text-primary">
      <InlineEditor
        value={props.text}
        onChange={(text) => onUpdate({ ...props, text })}
        className="w-full text-lg"
      />
    </Tag>
  )
}
