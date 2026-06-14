'use client'

import { useState, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { BlockToolbar } from './editor/block-toolbar'
import { SortableBlock } from './editor/sortable-block'
import { LivePreview } from './editor/live-preview'
import { createEmptyBlock, isBlockContent } from '@/lib/block-editor/types'
import type { Block, BlockType } from '@/lib/block-editor/types'

interface BlockEditorProps {
  initialContent: string
  onChange: (json: string) => void
}

export function BlockEditor({ initialContent, onChange }: BlockEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(() => {
    if (isBlockContent(initialContent)) {
      try {
        return JSON.parse(initialContent).filter((b: { id: string; type: string }) => b && b.id && b.type)
      } catch {
        return [createEmptyBlock('markdown')]
      }
    }
    if (initialContent.trim()) {
      return [{ ...createEmptyBlock('markdown'), props: { source: initialContent } }]
    }
    return []
  })

  const [showPreview, setShowPreview] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const notifyChange = useCallback((next: Block[]) => {
    setBlocks(next)
    onChange(JSON.stringify(next))
  }, [onChange])

  function addBlock(type: BlockType, afterId?: string) {
    const newBlock = createEmptyBlock(type)
    notifyChange(
      afterId
        ? blocks.flatMap((b) => (b.id === afterId ? [b, newBlock] : [b]))
        : [...blocks, newBlock]
    )
  }

  const updateBlock = useCallback((id: string, props: Record<string, unknown>) => {
    notifyChange(blocks.map((b) => (b.id === id ? { ...b, props } : b)))
  }, [blocks, notifyChange])

  const removeBlock = useCallback((id: string) => {
    notifyChange(blocks.filter((b) => b.id !== id))
  }, [blocks, notifyChange])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = blocks.findIndex((b) => b.id === active.id)
    const newIndex = blocks.findIndex((b) => b.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    notifyChange(arrayMove(blocks, oldIndex, newIndex))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <BlockToolbar onAdd={addBlock} />
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            showPreview
              ? 'border-primary bg-primary text-white'
              : 'border-border text-text-secondary hover:border-primary hover:text-primary'
          }`}
        >
          {showPreview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {showPreview ? (
        <div className="rounded-lg border border-border bg-card p-6">
          <LivePreview blocks={blocks} />
        </div>
      ) : (
        <>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {blocks.map((block) => (
                  <SortableBlock
                    key={block.id}
                    block={block}
                    onUpdate={(props) => updateBlock(block.id, props)}
                    onRemove={() => removeBlock(block.id)}
                    onAddBlock={(type) => addBlock(type, block.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {blocks.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-16 text-text-muted">
              <p className="text-sm">Click a block type above to start building</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
