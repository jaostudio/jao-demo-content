import { Heading, Type, Image, Link, Columns, Info, Minus, type LucideIcon } from 'lucide-react'
import type { BlockType } from '@/lib/block-editor/types'

const BLOCK_TYPES: { type: BlockType; label: string; icon: LucideIcon }[] = [
  { type: 'heading', label: 'Heading', icon: Heading },
  { type: 'paragraph', label: 'Text', icon: Type },
  { type: 'image', label: 'Image', icon: Image },
  { type: 'button', label: 'Button', icon: Link },
  { type: 'columns', label: 'Columns', icon: Columns },
  { type: 'callout', label: 'Callout', icon: Info },
  { type: 'divider', label: 'Divider', icon: Minus },
]

interface BlockToolbarProps {
  onAdd: (type: BlockType) => void
}

export function BlockToolbar({ onAdd }: BlockToolbarProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {BLOCK_TYPES.map(({ type, label, icon: Icon }) => (
        <button
          key={type}
          type="button"
          onClick={() => onAdd(type)}
          className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium text-text-secondary transition-colors hover:border-primary hover:text-primary"
        >
          <Icon className="h-3 w-3" />
          {label}
        </button>
      ))}
    </div>
  )
}
