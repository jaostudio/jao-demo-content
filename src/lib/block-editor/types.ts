export type BlockType =
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'button'
  | 'columns'
  | 'callout'
  | 'divider'
  | 'markdown'

export interface Block {
  id: string
  type: BlockType
  props: Record<string, unknown>
}

export function isBlockContent(content: string): boolean {
  return content.trim().startsWith('[')
}

export function createEmptyBlock(type: BlockType): Block {
  const id = crypto.randomUUID()
  switch (type) {
    case 'heading':
      return { id, type, props: { level: 2, text: '' } }
    case 'paragraph':
      return { id, type, props: { text: '' } }
    case 'image':
      return { id, type, props: { src: '', alt: '' } }
    case 'button':
      return { id, type, props: { text: 'Click me', href: '#', variant: 'primary' } }
    case 'columns':
      return { id, type, props: { left: '', right: '' } }
    case 'callout':
      return { id, type, props: { variant: 'info', text: '' } }
    case 'divider':
      return { id, type, props: {} }
    case 'markdown':
      return { id, type, props: { source: '' } }
  }
}
