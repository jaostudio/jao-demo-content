'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, X, Plus } from 'lucide-react'
import { useState } from 'react'
import { BlockRenderer } from '../block-renderer'
import { BlockToolbar } from './block-toolbar'
import type { Block, BlockType } from '@/lib/block-editor/types'

interface SortableBlockProps {
  block: Block
  onUpdate: (props: Record<string, unknown>) => void
  onRemove: () => void
  onAddBlock: (type: BlockType) => void
}

export function SortableBlock({ block, onUpdate, onRemove, onAddBlock }: SortableBlockProps) {
  const [showAddMenu, setShowAddMenu] = useState(false)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-lg border border-border bg-card p-3 ${isDragging ? 'opacity-50 shadow-lg' : ''}`}
    >
      <div className="absolute left-1 top-1 z-10 flex gap-0.5">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab rounded p-0.5 text-text-muted opacity-0 transition-opacity hover:bg-surface-alt group-hover:opacity-100 active:cursor-grabbing"
          aria-label="Drag block"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="rounded p-0.5 text-text-muted opacity-0 transition-opacity hover:bg-surface-alt group-hover:opacity-100"
            aria-label="Add block after"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          {showAddMenu && (
            <div className="absolute left-0 top-6 z-20 w-40 rounded-lg border border-border bg-card p-1 shadow-md">
              <BlockToolbar onAdd={(type) => { onAddBlock(type); setShowAddMenu(false) }} />
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="rounded p-0.5 text-text-muted opacity-0 transition-opacity hover:bg-danger-light hover:text-danger group-hover:opacity-100"
          aria-label="Remove block"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="pl-5">
        <BlockRenderer block={block} onUpdate={onUpdate} />
      </div>
    </div>
  )
}
