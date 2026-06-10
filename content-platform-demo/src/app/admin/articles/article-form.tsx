'use client'

import { useActionState } from 'react'

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

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="border-2 border-coral-500 bg-coral-100 px-4 py-3 text-sm font-bold text-coral-700 dark:bg-coral-900/30 dark:text-coral-300">
          {state.error}
        </div>
      )}
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-bold">Title</label>
        <input id="title" name="title" type="text" required defaultValue={article?.title ?? ''}
          className="w-full border-2 border-black bg-white px-3 py-2 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 dark:border-white dark:bg-[#1A1A1A]" />
      </div>
      <div>
        <label htmlFor="excerpt" className="mb-1 block text-sm font-bold">Excerpt</label>
        <textarea id="excerpt" name="excerpt" rows={2} defaultValue={article?.excerpt ?? ''}
          className="w-full border-2 border-black bg-white px-3 py-2 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 dark:border-white dark:bg-[#1A1A1A]" />
      </div>
      <div>
        <label htmlFor="content" className="mb-1 block text-sm font-bold">Content (Markdown)</label>
        <textarea id="content" name="content" rows={16} required defaultValue={article?.content ?? ''}
          className="w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 dark:border-white dark:bg-[#1A1A1A]" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="categoryId" className="mb-1 block text-sm font-bold">Category</label>
          <select id="categoryId" name="categoryId" required defaultValue={article?.categoryId ?? ''}
            className="w-full border-2 border-black bg-white px-3 py-2 font-bold dark:border-white dark:bg-[#1A1A1A]">
            <option value="">Select...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-bold">Tags</label>
          <div className="grid grid-cols-2 gap-1">
            {tags.map((t) => (
              <label key={t.id} className="flex items-center gap-1.5 text-sm font-bold">
                <input
                  type="checkbox"
                  name="tagIds"
                  value={t.id}
                  defaultChecked={article?.tags?.some((at) => at.tagId === t.id)}
                  className="accent-saffron-500"
                />
                {t.name}
              </label>
            ))}
          </div>
        </div>
      </div>
      <button type="submit" className="rounded-none border-2 border-black bg-black px-6 py-2.5 text-sm font-bold text-saffron-500 hover:nb-shadow dark:border-white dark:bg-white dark:text-black">
        {article ? 'Update Article' : 'Create Article'}
      </button>
    </form>
  )
}
