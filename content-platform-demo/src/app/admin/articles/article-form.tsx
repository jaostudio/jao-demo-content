'use client'

interface Category { id: string; name: string }
interface Tag { id: string; name: string }

export function ArticleForm({
  categories,
  tags,
  article,
  action,
}: {
  categories: Category[]
  tags: Tag[]
  article?: { id: string; title: string; excerpt: string | null; content: string; categoryId: string; tags: { tagId: string }[] }
  action: (formData: FormData) => void
}) {
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">Title</label>
        <input id="title" name="title" type="text" required defaultValue={article?.title ?? ''}
          className="w-full rounded-lg border px-3 py-2" />
      </div>
      <div>
        <label htmlFor="excerpt" className="mb-1 block text-sm font-medium">Excerpt</label>
        <textarea id="excerpt" name="excerpt" rows={2} defaultValue={article?.excerpt ?? ''}
          className="w-full rounded-lg border px-3 py-2" />
      </div>
      <div>
        <label htmlFor="content" className="mb-1 block text-sm font-medium">Content (Markdown)</label>
        <textarea id="content" name="content" rows={16} required defaultValue={article?.content ?? ''}
          className="w-full rounded-lg border px-3 py-2 font-mono text-sm" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="categoryId" className="mb-1 block text-sm font-medium">Category</label>
          <select id="categoryId" name="categoryId" required defaultValue={article?.categoryId ?? ''}
            className="w-full rounded-lg border px-3 py-2">
            <option value="">Select...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Tags</label>
          <div className="grid grid-cols-2 gap-1">
            {tags.map((t) => (
              <label key={t.id} className="flex items-center gap-1.5 text-sm">
                <input
                  type="checkbox"
                  name="tagIds"
                  value={t.id}
                  defaultChecked={article?.tags?.some((at) => at.tagId === t.id)}
                />
                {t.name}
              </label>
            ))}
          </div>
        </div>
      </div>
      <button type="submit" className="rounded-lg bg-gray-900 px-6 py-2 text-white hover:bg-gray-700">
        {article ? 'Update Article' : 'Create Article'}
      </button>
    </form>
  )
}
