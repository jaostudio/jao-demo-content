# Visual Block Editor — Implementation Spec

> **Phase 1 Centerpiece** | Replaces plain `<textarea>` Markdown with drag-and-drop block editing

---

## 1. Data Model

### 1.1 Block Type Definition

```typescript
// src/lib/block-editor/types.ts

export type BlockType =
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'button'
  | 'columns'
  | 'callout'
  | 'divider'
  | 'markdown'       // fallback for legacy content

export interface Block {
  id: string
  type: BlockType
  props: Record<string, unknown>
}

export interface HeadingBlock extends Block {
  type: 'heading'
  props: { level: 2 | 3; text: string }
}

export interface ParagraphBlock extends Block {
  type: 'paragraph'
  props: { text: string }
}

export interface ImageBlock extends Block {
  type: 'image'
  props: { src: string; alt: string; caption?: string; width?: number; height?: number }
}

export interface ButtonBlock extends Block {
  type: 'button'
  props: { text: string; href: string; variant?: 'primary' | 'secondary' | 'outline' }
}

export interface ColumnsBlock extends Block {
  type: 'columns'
  props: { left: string; right: string }   // each side is markdown text
}

export interface CalloutBlock extends Block {
  type: 'callout'
  props: { variant: 'info' | 'warning' | 'tip'; text: string }
}

export interface DividerBlock extends Block {
  type: 'divider'
  props: Record<string, never>
}

export interface MarkdownBlock extends Block {
  type: 'markdown'
  props: { source: string }
}
```

### 1.2 Database Storage

**No schema change needed.** The existing `Article.content` field (`String`) stores the block array as JSON:

```
[{"id":"1","type":"heading","props":{"level":2,"text":"Hello"}},{"id":"2","type":"paragraph","props":{"text":"World"}}]
```

Legacy articles (markdown string, doesn't start with `[`) render via `react-markdown` fallback. Detection:

```typescript
function isBlockContent(content: string): boolean {
  return content.trim().startsWith('[')
}
```

### 1.3 Zod Validation

```typescript
// src/lib/validations/article.ts — extended

const blockSchema = z.discriminatedUnion('type', [
  z.object({ id: z.string(), type: z.literal('heading'), props: z.object({ level: z.union([z.literal(2), z.literal(3)]), text: z.string().min(1).max(200) }) }),
  z.object({ id: z.string(), type: z.literal('paragraph'), props: z.object({ text: z.string().min(1).max(5000) }) }),
  z.object({ id: z.string(), type: z.literal('image'), props: z.object({ src: z.string().url(), alt: z.string(), caption: z.string().optional(), width: z.number().optional(), height: z.number().optional() }) }),
  z.object({ id: z.string(), type: z.literal('button'), props: z.object({ text: z.string().min(1).max(60), href: z.string().url(), variant: z.enum(['primary', 'secondary', 'outline']).optional() }) }),
  z.object({ id: z.string(), type: z.literal('columns'), props: z.object({ left: z.string(), right: z.string() }) }),
  z.object({ id: z.string(), type: z.literal('callout'), props: z.object({ variant: z.enum(['info', 'warning', 'tip']), text: z.string().min(1).max(1000) }) }),
  z.object({ id: z.string(), type: z.literal('divider'), props: z.object({}) }),
  z.object({ id: z.string(), type: z.literal('markdown'), props: z.object({ source: z.string() }) }),
])

export const articleSchema = z.object({
  title: z.string().min(3, 'Title needs at least 3 characters').max(100),
  content: z.union([z.string(), z.array(blockSchema)]),
  excerpt: z.string().max(200).optional().or(z.literal('')),
  categoryId: z.string().min(1, 'Select a category'),
  tagIds: z.array(z.string()).max(5).optional(),
})
```

---

## 2. Component Architecture

```
src/components/block-editor/
├── types.ts                  # Block type definitions + Zod schema
├── block-renderer.tsx        # Renders a block on public front-end
├── block-editor.tsx          # Admin editor wrapper (replaces <textarea>)
├── blocks/
│   ├── heading-block.tsx     # Editor + Renderer
│   ├── paragraph-block.tsx
│   ├── image-block.tsx
│   ├── button-block.tsx
│   ├── columns-block.tsx
│   ├── callout-block.tsx
│   ├── divider-block.tsx
│   └── markdown-block.tsx
├── editor/
│   ├── block-toolbar.tsx     # "+" add block toolbar
│   ├── block-wrapper.tsx     # Drag handle + block controls (move/delete)
│   ├── inline-editor.tsx     # contentEditable wrapper for text blocks
│   └── image-picker.tsx      # URL input + preview for image blocks
└── public/
    └── article-content.tsx   # Public renderer (detects blocks vs markdown)
```

### 2.1 Block Renderer (Public)

```tsx
// src/components/block-editor/block-renderer.tsx

export function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'heading':
      const Tag = block.props.level === 2 ? 'h2' : 'h3'
      return <Tag className="font-display font-bold text-text-primary">{block.props.text}</Tag>
    case 'paragraph':
      return <p className="text-body text-text-secondary leading-relaxed">{block.props.text}</p>
    case 'image':
      return (
        <figure className="my-6">
          <Image src={block.props.src} alt={block.props.alt} width={block.props.width ?? 800} height={block.props.height ?? 450} className="rounded-lg" />
          {block.props.caption && <figcaption className="mt-1 text-center text-xs text-text-muted">{block.props.caption}</figcaption>}
        </figure>
      )
    case 'button':
      return (
        <div className="my-6">
          <Link href={block.props.href} className={`btn btn-${block.props.variant ?? 'primary'}`}>{block.props.text}</Link>
        </div>
      )
    case 'columns':
      return (
        <div className="my-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="prose prose-sm">{block.props.left}</div>
          <div className="prose prose-sm">{block.props.right}</div>
        </div>
      )
    case 'callout':
      return (
        <div className={`my-6 rounded-lg border p-4 text-sm ${
          block.props.variant === 'warning' ? 'border-amber-200 bg-amber-50 text-amber-800' :
          block.props.variant === 'tip' ? 'border-teal-200 bg-teal-50 text-teal-800' :
          'border-sky-200 bg-sky-50 text-sky-800'
        }`}>
          {block.props.text}
        </div>
      )
    case 'divider':
      return <hr className="my-8 border-border" />
    case 'markdown':
      return <MarkdownRenderer content={block.props.source} />
    default:
      return null
  }
}
```

### 2.2 Article Content (Public Entry Point)

```tsx
// src/components/block-editor/public/article-content.tsx

export function ArticleContent({ content }: { content: string }) {
  if (!isBlockContent(content)) {
    return <MarkdownRenderer content={content} />
  }

  const blocks: Block[] = JSON.parse(content)
  return (
    <div className="space-y-6">
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  )
}
```

### 2.3 Block Editor (Admin)

```tsx
// src/components/block-editor/block-editor.tsx

'use client'

import { useState } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { v4 as uuid } from 'uuid'   // or simple crypto.randomUUID()
import { BlockToolbar } from './editor/block-toolbar'
import { SortableBlock } from './editor/sortable-block'

interface BlockEditorProps {
  initialContent: string   // JSON string or markdown
  onChange: (json: string) => void
}

export function BlockEditor({ initialContent, onChange }: BlockEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(() => {
    if (isBlockContent(initialContent)) return JSON.parse(initialContent)
    return [{ id: uuid(), type: 'markdown', props: { source: initialContent } }]
  })

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function addBlock(type: BlockType, afterId?: string) {
    const newBlock = createEmptyBlock(type)
    setBlocks((prev) => {
      const idx = afterId ? prev.findIndex((b) => b.id === afterId) : -1
      const next = idx >= 0 ? [...prev.slice(0, idx + 1), newBlock, ...prev.slice(idx + 1)] : [...prev, newBlock]
      onChange(JSON.stringify(next))
      return next
    })
  }

  function updateBlock(id: string, props: Record<string, unknown>) {
    setBlocks((prev) => {
      const next = prev.map((b) => (b.id === id ? { ...b, props } : b))
      onChange(JSON.stringify(next))
      return next
    })
  }

  function removeBlock(id: string) {
    setBlocks((prev) => {
      const next = prev.filter((b) => b.id !== id)
      onChange(JSON.stringify(next))
      return next
    })
  }

  function handleDragEnd(event: { active: any; over: any }) {
    if (!event.over || event.active.id === event.over.id) return
    setBlocks((prev) => {
      const oldIndex = prev.findIndex((b) => b.id === event.active.id)
      const newIndex = prev.findIndex((b) => b.id === event.over.id)
      const next = arrayMove(prev, oldIndex, newIndex)
      onChange(JSON.stringify(next))
      return next
    })
  }

  return (
    <div className="space-y-3">
      <BlockToolbar onAdd={(type) => addBlock(type)} />

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
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-12 text-text-muted">
          <p className="text-sm">Click "+" above to add your first block</p>
        </div>
      )}
    </div>
  )
}
```

### 2.4 Sortable Block Wrapper

```tsx
// src/components/block-editor/editor/sortable-block.tsx

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, X, Plus } from 'lucide-react'
import { BlockEditorBlock } from './block-editor-block'

export function SortableBlock({ block, onUpdate, onRemove, onAddBlock }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id })

  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div ref={setNodeRef} style={style} className={`group relative rounded-lg border border-border bg-card p-3 ${isDragging ? 'opacity-50 shadow-lg' : ''}`}>
      <div className="absolute left-1 top-1 flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        <button {...attributes} {...listeners} className="cursor-grab rounded p-0.5 text-text-muted hover:bg-surface-alt" aria-label="Drag block">
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        <button onClick={onRemove} className="rounded p-0.5 text-text-muted hover:bg-danger-light hover:text-danger" aria-label="Remove block">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="pl-5">
        <BlockEditorBlock block={block} onUpdate={onUpdate} />
      </div>
    </div>
  )
}
```

### 2.5 Inline Editing for Text Blocks

```tsx
// src/components/block-editor/editor/inline-editor.tsx

'use client'

import { useRef, useEffect } from 'react'

export function InlineEditor({ value, onChange, className }: { value: string; onChange: (v: string) => void; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && ref.current.innerText !== value) {
      ref.current.innerText = value
    }
  }, [value])

  function handleInput() {
    onChange(ref.current?.innerText ?? '')
  }

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onBlur={handleInput}
      className={`outline-none focus:ring-1 focus:ring-primary rounded px-1 -mx-1 ${className ?? ''}`}
    />
  )
}
```

### 2.6 Block Toolbar (+ Add)

```tsx
// src/components/block-editor/editor/block-toolbar.tsx

import { useState } from 'react'
import { Plus, Heading, Type, Image, Link, Columns, Info, Minus } from 'lucide-react'

const BLOCK_TYPES = [
  { type: 'heading' as const, label: 'Heading', icon: Heading },
  { type: 'paragraph' as const, label: 'Text', icon: Type },
  { type: 'image' as const, label: 'Image', icon: Image },
  { type: 'button' as const, label: 'Button', icon: Link },
  { type: 'columns' as const, label: 'Columns', icon: Columns },
  { type: 'callout' as const, label: 'Callout', icon: Info },
  { type: 'divider' as const, label: 'Divider', icon: Minus },
]

export function BlockToolbar({ onAdd }: { onAdd: (type: BlockType) => void }) {
  return (
    <div className="flex flex-wrap gap-1">
      {BLOCK_TYPES.map(({ type, label, icon: Icon }) => (
        <button
          key={type}
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
```

---

## 3. Integration Points

### 3.1 Article Form (Admin)

Replace the existing `<textarea name="content">` in `article-form.tsx` with the block editor:

```tsx
// Before
<textarea id="content" name="content" rows={16} required ... />

// After
<div id="content-area">
  <input type="hidden" name="content" value={contentJson} />
  <BlockEditor initialContent={article?.content ?? ''} onChange={(json) => setContentJson(json)} />
</div>
```

The hidden input stores the JSON string; the server action receives it as a string and validates via the updated Zod schema. No server-side changes needed beyond schema validation.

### 3.2 Public Article Render

In `src/components/new/pages/article-detail.tsx`, replace:

```tsx
<MarkdownRenderer content={content} />
```

with:

```tsx
<ArticleContent content={content} />
```

And in the legacy path (`src/app/articles/[slug]/page.tsx`), replace:

```tsx
<MarkdownRenderer content={article.content} />
```

with:

```tsx
<ArticleContent content={article.content} />
```

### 3.3 Version History

The existing `ArticleVersion.content` field already stores the full content string. Since blocks are JSON, version diffs can eventually show structural changes (blocks added/removed/reordered). For MVP, store the JSON string as-is.

---

## 4. Migration Path

### 4.1 Existing Articles

All existing articles have markdown in `content`. The `isBlockContent()` check handles this:

```
"Getting started with Next.js..."   → detected as legacy → renders via MarkdownRenderer
[{"id":"1","type":"paragraph"...}]  → detected as blocks → renders via BlockRenderer
```

When an author opens a legacy article in the editor:
1. `BlockEditor` detects non-JSON content
2. Wraps it in a single `markdown` block: `[{ id: '1', type: 'markdown', props: { source: existingMarkdown } }]`
3. Author can edit inline or convert to blocks
4. On save, the entire content is stored as the new JSON format

### 4.2 Backward Compatible Rendering

The `ArticleContent` component and `BlockRenderer` both handle the `markdown` block type, so converting a legacy article is a visual no-op until the author chooses to restructure.

---

## 5. Dependencies to Add

```json
{
  "@dnd-kit/core": "^6.3.0",
  "@dnd-kit/sortable": "^10.0.0",
  "@dnd-kit/utilities": "^3.2.0"
}
```

No heavy editor framework (no TipTap, Slate, or ProseMirror). The approach is:
- `@dnd-kit` for drag-and-drop sorting (14KB gzipped)
- `contentEditable` for inline text editing (zero bytes)
- Plain React state + JSON serialization

---

## 6. Implementation Order (Within Phase 1)

| Step | File | What |
|------|------|------|
| 1 | `src/lib/block-editor/types.ts` | Block types, Zod schema, isBlockContent helper |
| 2 | `src/components/block-editor/blocks/*.tsx` | Block renderers (headless, just JSX + Tailwind) |
| 3 | `src/components/block-editor/block-renderer.tsx` | Switch renderer |
| 4 | `src/components/block-editor/public/article-content.tsx` | Public entry point – detect blocks vs markdown |
| 5 | `src/components/block-editor/editor/inline-editor.tsx` | contentEditable wrapper |
| 6 | `src/components/block-editor/editor/block-wrapper.tsx` | Drag handle + controls |
| 7 | `src/components/block-editor/editor/block-toolbar.tsx` | "+" add block toolbar |
| 8 | `src/components/block-editor/editor/sortable-block.tsx` | @dnd-kit sortable wrapper |
| 9 | `src/components/block-editor/block-editor.tsx` | Full editor assembly |
| 10 | Integration | Wire into article-form.tsx + public pages |
| 11 | `src/lib/validations/article.ts` | Extend Zod schema |
| 12 | `src/lib/actions/articles.ts` | Update content serialization (minimal) |

---

## 7. Future Enhancements (Post-MVP)

- **Image upload** (instead of URL-only)
- **Nested columns** (3-col, unequal ratios)
- **Block-level comments** (field-level collaboration)
- **Markdown→Blocks converter** (automatically split legacy markdown into heading/paragraph blocks)
- **Undo/redo** (block-level history stack)
- **Full-width blocks** (hero, featured image)
- **Custom CSS class** per block
