'use client'

import { useActionState, useState } from 'react'
import { BlockEditor } from '@/components/block-editor/block-editor'

interface Category { id: string; name: string }
interface Tag { id: string; name: string }

type FormState = { error?: string } | null

export function ArticleForm({
  categories,
  tags,
  article,
  action,
}: {
  categories: Category[]
  tags: Tag[]
  article?: { id: string; title: string; excerpt: string | null; content: string; categoryId: string; tags: { tagId: string }[] }
  action: (prevState: FormState, formData: FormData) => FormState | Promise<FormState>
}) {
  const [state, formAction] = useActionState(action, null)
  const [contentJson, setContentJson] = useState(article?.content ?? '')

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="rounded-lg border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger">
          {state.error}
        </div>
      )}
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-text-secondary">Title</label>
        <input id="title" name="title" type="text" required defaultValue={article?.title ?? ''}
          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-card-dark" />
      </div>
      <div>
        <label htmlFor="excerpt" className="mb-1 block text-sm font-medium text-text-secondary">Excerpt</label>
        <textarea id="excerpt" name="excerpt" rows={2} defaultValue={article?.excerpt ?? ''}
          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-card-dark" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-text-secondary">Content</label>
        <input type="hidden" name="content" value={contentJson} />
        <div className="rounded-lg border border-border bg-card p-4 dark:border-border-dark dark:bg-card-dark">
          <BlockEditor initialContent={article?.content ?? ''} onChange={setContentJson} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="categoryId" className="mb-1 block text-sm font-medium text-text-secondary">Category</label>
          <select id="categoryId" name="categoryId" required defaultValue={article?.categoryId ?? ''}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-card-dark">
            <option value="">Select...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">Tags</label>
          <div className="grid grid-cols-2 gap-1">
            {tags.map((t) => (
              <label key={t.id} className="flex items-center gap-1.5 text-sm text-text-secondary">
                <input
                  type="checkbox"
                  name="tagIds"
                  value={t.id}
                  defaultChecked={article?.tags?.some((at) => at.tagId === t.id)}
                  className="rounded accent-primary"
                />
                {t.name}
              </label>
            ))}
          </div>
        </div>
      </div>
      <button type="submit" className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover">
        {article ? 'Update Article' : 'Create Article'}
      </button>
    </form>
  )
}
