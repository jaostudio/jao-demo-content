'use client'
import { useState, useEffect, useCallback } from 'react'
import { MessageSquare } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useLang } from '@/lib/use-lang'

type QA = {
  id: string
  askerName: string
  question: string
  answer: string | null
  createdAt: string
}

export function QASection({ productId }: { productId: string }) {
  const lang = useLang()
  const { data: session } = useSession()
  const [qas, setQas] = useState<QA[]>([])
  const [question, setQuestion] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchQA = useCallback(async () => {
    try {
      const res = await fetch(`/api/qa?productId=${encodeURIComponent(productId)}`)
      if (res.ok) {
        const data = await res.json()
        setQas(data.qas ?? [])
      }
    } catch { /* ignore */ }
    setLoading(false)
  }, [productId])

  useEffect(() => { fetchQA() }, [fetchQA])

  const askQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, question: question.trim() }),
      })
      if (res.ok) {
        setQuestion('')
        await fetchQA()
      }
    } catch { /* ignore */ }
    setSubmitting(false)
  }

  return (
    <div className="mt-8 border-t border-subtle pt-8 dark:border-subtle">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-muted" />
        <h2 className="font-[var(--font-display)] text-xl font-bold">{lang === 'tl' ? 'Tanong & Sagot' : 'Questions & Answers'}</h2>
      </div>

      {session?.user && (
        <form onSubmit={askQuestion} className="mt-4 rounded-lg border border-subtle p-4 dark:border-subtle">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={lang === 'tl' ? 'Magtanong tungkol sa produktong ito...' : 'Ask about this product...'}
            rows={2}
            className="w-full rounded-lg border border-subtle bg-white px-3 py-2 text-sm dark:bg-surface"
          />
          <button
            type="submit"
            disabled={submitting || !question.trim()}
            className="mt-2 rounded-lg bg-flag-blue px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            {submitting ? (lang === 'tl' ? 'Ipinapadala...' : 'Sending...') : (lang === 'tl' ? 'Itanong' : 'Ask')}
          </button>
        </form>
      )}

      <div className="mt-4 space-y-3">
        {loading ? (
          <p className="py-4 text-center text-sm text-muted">{lang === 'tl' ? 'Naglo-load...' : 'Loading...'}</p>
        ) : qas.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted">{lang === 'tl' ? 'Wala pang tanong. Ikaw na mag-umpisa!' : 'No questions yet. Be the first!'}</p>
        ) : (
          qas.map((qa) => (
            <div key={qa.id} className="rounded-lg border border-subtle p-4 dark:border-subtle">
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium">{qa.question}</p>
                <span className="ml-2 shrink-0 text-[10px] text-muted">{new Date(qa.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="mt-1 text-xs text-muted">{lang === 'tl' ? 'ni' : 'by'} {qa.askerName}</p>
              {qa.answer ? (
                <div className="mt-2 rounded-lg bg-leafy-green/5 px-3 py-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-leafy-green">{lang === 'tl' ? 'Sagot:' : 'Answer:'}</span>
                  <p className="mt-0.5 text-sm text-stone-600 dark:text-muted">{qa.answer}</p>
                </div>
              ) : (
                <p className="mt-2 text-xs italic text-muted">{lang === 'tl' ? 'Hindi pa nasasagot ng tindera...' : 'Not yet answered by the vendor...'}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
