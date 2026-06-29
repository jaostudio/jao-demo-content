'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { MessageSquare } from 'lucide-react'

interface Comment {
  id: string
  authorName: string
  body: string
  createdAt: string
}

const avatarColors = ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-rose-500', 'bg-violet-500']

function getAvatarColor(name: string) {
  const index = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return avatarColors[index % avatarColors.length]
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
      toast.success('Comment posted')
    } catch {
      toast.error(err('network_error'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="border-t border-border pt-6 dark:border-border-dark">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-text-primary dark:text-slate-100">
        <MessageSquare className="h-4 w-4" />
        {t('title')} ({comments.length})
      </h2>

      <form onSubmit={handleSubmit} className="mb-6 space-y-2.5">
        <div className="grid grid-cols-2 gap-2.5">
          <input
            placeholder={t('name_placeholder')} required value={name} onChange={(e) => setName(e.target.value)}
            aria-label="Your name"
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-card-dark"
          />
          <input
            type="email" placeholder={t('email_placeholder')} required value={email} onChange={(e) => setEmail(e.target.value)}
            aria-label="Your email"
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-card-dark"
          />
        </div>
        <textarea
          placeholder={t('body_placeholder')} required value={body} onChange={(e) => setBody(e.target.value)} rows={3}
          aria-label="Your comment"
          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-card-dark"
        />
        <button type="submit" disabled={submitting}
          className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50">
          {submitting ? t('posting') : t('post')}
        </button>
      </form>

      {comments.length === 0 && (
        <p className="py-4 text-center text-sm text-text-muted">{t('empty')}</p>
      )}

      <div className="space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-2.5">
            <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${getAvatarColor(c.authorName)}`}>
              {c.authorName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-text-primary dark:text-slate-100">{c.authorName}</span>
                <span className="text-[10px] text-text-muted">{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="mt-0.5 text-sm text-text-body">{c.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
