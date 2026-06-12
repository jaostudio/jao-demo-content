import { isBlockContent } from '@/lib/block-editor/types'
import { BlockRenderer } from '../block-renderer'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import type { Block } from '@/lib/block-editor/types'

interface ArticleContentProps {
  content: string
}

export function ArticleContent({ content }: ArticleContentProps) {
  if (!isBlockContent(content)) {
    return <MarkdownRenderer content={content} />
  }

  let blocks: Block[]
  try {
    blocks = JSON.parse(content)
  } catch {
    return <MarkdownRenderer content={content} />
  }

  return (
    <div className="space-y-6">
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  )
}
