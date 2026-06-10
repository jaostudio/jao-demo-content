'use client'

import { useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { useLang } from '@/lib/use-lang'

type ChatMessage = {
  from: 'user' | 'bot'
  text: string
}

const AUTO_REPLY_TL = "Salamat sa iyong tanong! Puntahan mo sa Sari-Sari store, o kaya i-chat si Kuya Rider. 🚚"
const AUTO_REPLY_EN = "Thank you for your question! Visit the Sari-Sari store, or chat with Kuya Rider. 🚚"

export function ChatBubble() {
  const lang = useLang()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: 'bot', text: lang === 'tl' ? 'Mustasa! Ano pong kailangan ninyo? 🛒' : 'Mustasa! What do you need? 🛒' },
  ])
  const [input, setInput] = useState('')
  const AUTO_REPLY = lang === 'tl' ? AUTO_REPLY_TL : AUTO_REPLY_EN

  const handleSend = () => {
    const q = input.trim()
    if (!q) return
    setMessages((prev) => [...prev, { from: 'user', text: q }])
    setInput('')
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: 'bot', text: AUTO_REPLY }])
    }, 800)
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 z-[60] flex h-12 w-12 items-center justify-center rounded-full bg-flag-blue text-white shadow-lg transition-transform hover:scale-105"
        aria-label={lang === 'tl' ? 'Buksan ang chat' : 'Open chat'}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>

      {open && (
        <div className="fixed bottom-20 right-4 z-[60] w-80 rounded-xl border border-subtle bg-white shadow-xl dark:border-subtle dark:bg-surface">
          <div className="flex items-center gap-2 border-b border-subtle px-4 py-3 dark:border-subtle">
            <div className="h-8 w-8 rounded-full bg-flag-blue/20 p-1">
              <span className="flex h-full w-full items-center justify-center text-xs font-bold text-flag-blue">AN</span>
            </div>
            <div>
              <p className="text-sm font-semibold">Aling Nena</p>
              <p className="text-xs text-muted">{lang === 'tl' ? 'Online' : 'Online'}</p>
            </div>
          </div>

          <div className="h-64 overflow-y-auto space-y-3 p-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                  msg.from === 'user'
                    ? 'bg-flag-blue text-white'
                    : 'bg-surface dark:bg-surface'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-subtle p-3 dark:border-subtle">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={lang === 'tl' ? 'Tanong mo kay Aling Nena...' : 'Ask Aling Nena...'}
              className="flex-1 rounded-lg border border-subtle bg-white px-3 py-2 text-sm dark:bg-surface"
            />
            <button onClick={handleSend} className="rounded-lg bg-flag-blue p-2 text-white">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
