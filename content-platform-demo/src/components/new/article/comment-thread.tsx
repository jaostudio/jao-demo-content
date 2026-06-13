'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { MessageSquare } from 'lucide-react'
import { Button } from '../ui/button'
import { Avatar } from '../ui/avatar'

interface Comment {
  id: string
  authorName: string
  body: string
  createdAt: string
}

interface CommentThreadProps {
  articleId: string
  initialComments: Comment[]
}

export function CommentThread({ articleId, initialComments }: CommentThreadProps) {
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
      toast.success('Comment posted! Salamat sa pag-share.')
    } catch {
      toast.error(err('network_error'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="border-t border-border pt-6 dark:border-border-dark">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-display font-bold text-text-primary">
        <MessageSquare className="h-4 w-4 text-primary" />
        {t('title')} ({comments.length})
      </h2>

      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder={t('name_placeholder')} required value={name}
            onChange={(e) => setName(e.target.value)}
            className="input h-9 text-xs"
          />
          <input
            type="email" placeholder={t('email_placeholder')} required value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input h-9 text-xs"
          />
        </div>
        <textarea
          placeholder={t('body_placeholder')} required value={body}
          onChange={(e) => setBody(e.target.value)} rows={3}
          className="input resize-none text-xs"
        />
        <Button type="submit" variant="accent" size="md" disabled={submitting}>
          {submitting ? t('posting') : t('post')}
        </Button>
      </form>

      {comments.length === 0 && (
        <p className="py-8 text-center text-sm text-text-muted">{t('empty')}</p>
      )}

      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3">
            <Avatar name={c.authorName} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-text-primary">{c.authorName}</span>
                <span className="text-[10px] text-text-muted">
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-text-body">{c.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
