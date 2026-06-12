import type { Block } from '@/lib/block-editor/types'
import { HeadingBlock } from './blocks/heading-block'
import { ParagraphBlock } from './blocks/paragraph-block'
import { ImageBlock } from './blocks/image-block'
import { ButtonBlock } from './blocks/button-block'
import { ColumnsBlock } from './blocks/columns-block'
import { CalloutBlock } from './blocks/callout-block'
import { DividerBlock } from './blocks/divider-block'
import { MarkdownBlock } from './blocks/markdown-block'

interface BlockRendererProps {
  block: Block
  onUpdate?: (props: Record<string, unknown>) => void
}

export function BlockRenderer({ block, onUpdate }: BlockRendererProps) {
  switch (block.type) {
    case 'heading':
      return <HeadingBlock props={block.props as never} onUpdate={onUpdate as never} />
    case 'paragraph':
      return <ParagraphBlock props={block.props as never} onUpdate={onUpdate as never} />
    case 'image':
      return <ImageBlock props={block.props as never} onUpdate={onUpdate as never} />
    case 'button':
      return <ButtonBlock props={block.props as never} onUpdate={onUpdate as never} />
    case 'columns':
      return <ColumnsBlock props={block.props as never} onUpdate={onUpdate as never} />
    case 'callout':
      return <CalloutBlock props={block.props as never} onUpdate={onUpdate as never} />
    case 'divider':
      return <DividerBlock />
    case 'markdown':
      return <MarkdownBlock props={block.props as never} onUpdate={onUpdate as never} />
    default:
      return null
  }
}
