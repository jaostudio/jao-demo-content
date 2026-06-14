import { BlockRenderer } from '../block-renderer'
import type { Block } from '@/lib/block-editor/types'

interface LivePreviewProps {
  blocks: Block[]
}

export function LivePreview({ blocks }: LivePreviewProps) {
  if (blocks.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-xs text-text-muted">
        Add blocks to see a preview
      </div>
    )
  }

  return (
    <div className="prose prose-sm max-w-none space-y-6">
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  )
}
