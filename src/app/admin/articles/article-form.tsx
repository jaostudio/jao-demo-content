'use client'

import { useActionState, useState } from 'react'
import { toast } from 'sonner'
import { BlockEditor } from '@/components/block-editor/block-editor'
import { CanvasEditor } from '@/components/canvas/canvas-editor'
import { Image, PenLine, Video, Music } from 'lucide-react'

interface Category { id: string; name: string }
interface Tag { id: string; name: string }

type Format = 'DRAWING' | 'WRITING' | 'VIDEO' | 'AUDIO'
type FormState = { error?: string } | null

const FORMATS: { value: Format; label: string; icon: typeof Image }[] = [
  { value: 'DRAWING', label: 'Drawing', icon: Image },
  { value: 'WRITING', label: 'Writing', icon: PenLine },
  { value: 'VIDEO', label: 'Video', icon: Video },
  { value: 'AUDIO', label: 'Audio', icon: Music },
]

export function ArticleForm({
  categories,
  tags,
  article,
  action,
}: {
  categories: Category[]
  tags: Tag[]
  article?: { id: string; title: string; excerpt: string | null; content: string; categoryId: string; tags: { tagId: string }[]; format?: string; imageUrl?: string | null }
  action: (prevState: FormState, formData: FormData) => FormState | Promise<FormState>
}) {
  const [state, formAction] = useActionState(action, null)
  const [format, setFormat] = useState<Format>((article?.format as Format) || 'WRITING')
  const [contentJson, setContentJson] = useState(article?.content ?? '')
  const [imageUrl, setImageUrl] = useState(article?.imageUrl ?? '')
  const [aiFree, setAiFree] = useState(false)

  function handleFormatSelect(f: Format) {
    if (f === 'VIDEO' || f === 'AUDIO') {
      toast.info('Coming soon — video and audio upload will be available in the full version.')
      return
    }
    setFormat(f)
  }

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="rounded-lg border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger">
          {state.error}
        </div>
      )}

      {/* Format Selector */}
      <div>
        <label className="mb-2 block text-xs font-medium text-text-secondary">Format</label>
        <div className="flex gap-1.5">
          {FORMATS.map((f) => {
            const Icon = f.icon
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => handleFormatSelect(f.value)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  format === f.value
                    ? 'bg-void-black text-white'
                    : 'bg-surface-alt text-text-secondary hover:bg-secondary-light'
                }`}
              >
                <Icon className="h-3 w-3" />
                {f.label}
              </button>
            )
          })}
        </div>
        <input type="hidden" name="format" value={format} />
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="mb-1 block text-xs font-medium text-text-secondary">Title</label>
        <input id="title" name="title" type="text" required defaultValue={article?.title ?? ''} className="input" />
      </div>

      {/* Excerpt */}
      <div>
        <label htmlFor="excerpt" className="mb-1 block text-xs font-medium text-text-secondary">Excerpt</label>
        <textarea id="excerpt" name="excerpt" rows={2} defaultValue={article?.excerpt ?? ''} className="input" />
      </div>

      {/* Content / Canvas */}
      <div>
        <label className="mb-1 block text-xs font-medium text-text-secondary">
          {format === 'DRAWING' ? 'Drawing' : 'Content'}
        </label>

        {format === 'DRAWING' ? (
          <div>
            <input type="hidden" name="content" value="" />
            <input type="hidden" name="imageUrl" value={imageUrl} />
            <CanvasEditor onSave={setImageUrl} />
            {imageUrl && (
              <div className="mt-2 flex items-center gap-2 text-xs text-text-muted">
                <span className="inline-block h-2 w-2 rounded-full bg-reactor-green" />
                Drawing saved ({Math.round(imageUrl.length / 1024)} KB)
              </div>
            )}
          </div>
        ) : (
          <div>
            <input type="hidden" name="content" value={contentJson} />
            <input type="hidden" name="imageUrl" value="" />
            <div className="rounded-lg border border-border bg-card p-4">
              <BlockEditor initialContent={article?.content ?? ''} onChange={setContentJson} />
            </div>
          </div>
        )}
      </div>

      {/* Category + Tags */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="categoryId" className="mb-1 block text-xs font-medium text-text-secondary">Category</label>
          <select id="categoryId" name="categoryId" required defaultValue={article?.categoryId ?? ''}
            className="input">
            <option value="">Select...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-text-secondary">Tags</label>
          <div className="grid grid-cols-2 gap-1">
            {tags.map((t) => (
              <label key={t.id} className="flex items-center gap-1.5 text-xs text-text-secondary">
                <input
                  type="checkbox"
                  name="tagIds"
                  value={t.id}
                  defaultChecked={article?.tags?.some((at) => at.tagId === t.id)}
                  className="h-3 w-3 rounded border-hairline text-void-black focus:ring-0"
                />
                {t.name}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* AI-Free Declaration */}
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="aiFree"
          name="aiFreeDeclaration"
          checked={aiFree}
          onChange={(e) => setAiFree(e.target.checked)}
          className="mt-0.5 h-3.5 w-3.5 rounded border-hairline text-reactor-green focus:ring-0"
        />
        <label htmlFor="aiFree" className="text-xs text-text-secondary leading-relaxed">
          I confirm this work is AI-free — created entirely by human effort.
          <span className="block text-[10px] text-text-muted mt-0.5">
            Misuse of this badge may result in content removal.
          </span>
        </label>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button type="submit" className="btn btn-accent btn-md">
          {article ? 'Update' : 'Publish'}
        </button>
      </div>
    </form>
  )
}
