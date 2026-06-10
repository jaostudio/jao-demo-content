'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

interface Comment {
  id: string
  authorName: string
  body: string
  createdAt: string
}

const commentAvatars = ['🐱', '🐶', '🦊', '🐻', '🐼', '🐨', '🦁', '🐸', '🐵', '🐧']

function getCommentAvatar(name: string) {
  const index = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return commentAvatars[index % commentAvatars.length]
}

export function CommentSection({ articleId, initialComments }: { articleId: string; initialComments: Comment[] }) {
  const [comments, setComments] = useState(initialComments)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const t = useTranslations('comments')
  const err = useTranslations('errors')

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch(`/api/articles/${articleId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorName: name, authorEmail: email, body }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || err('something_wrong'))
        return
      }
      setComments((prev) => [{ ...data, createdAt: new Date().toISOString() }, ...prev])
      setName('')
      setEmail('')
      setBody('')
      toast.success('Salamat! Comment posted.')
    } catch {
      toast.error(err('network_error'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-12 border-t-2 border-dashed border-black pt-8 dark:border-white">
      <h2 className="mb-6 font-display text-xl font-bold">{t('title')} ({comments.length})</h2>

      <form onSubmit={handleSubmit} className="mb-8 space-y-3 border-2 border-black bg-cream p-4 nb-shadow dark:border-white dark:bg-black">
        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder={t('name_placeholder')} required value={name} onChange={(e) => setName(e.target.value)}
            className="w-full border-2 border-black bg-white px-3 py-2 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 dark:border-white dark:bg-[#1A1A1A]"
          />
          <input
            type="email" placeholder={t('email_placeholder')} required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-black bg-white px-3 py-2 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 dark:border-white dark:bg-[#1A1A1A]"
          />
        </div>
        <textarea
          placeholder={t('body_placeholder')} required value={body} onChange={(e) => setBody(e.target.value)} rows={3}
          className="w-full border-2 border-black bg-white px-3 py-2 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 dark:border-white dark:bg-[#1A1A1A]"
        />
        <button type="submit" disabled={submitting}
          className="rounded-none border-2 border-black bg-black px-4 py-2 text-sm font-bold text-saffron-500 hover:nb-shadow disabled:opacity-50 dark:border-white dark:bg-white dark:text-black">
          {submitting ? t('posting') : t('post')}
        </button>
      </form>

      {comments.length === 0 && (
        <p className="text-sm text-neutral-500">{t('empty')}</p>
      )}

      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="border-t-2 border-dashed border-black/20 pt-4 dark:border-white/20">
            <div className="mb-1 flex items-center gap-2">
              <span className="text-lg">{getCommentAvatar(c.authorName)}</span>
              <span className="text-sm font-bold">{c.authorName}</span>
              <span className="text-xs text-neutral-500">{new Date(c.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">{c.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
