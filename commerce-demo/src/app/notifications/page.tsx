'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Bell, CheckCheck } from 'lucide-react'
import Link from 'next/link'
import { useLang } from '@/lib/use-lang'
import { useRouter } from 'next/navigation'

type NotificationItem = {
  id: string
  type: string
  message: string
  link: string | null
  isRead: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const lang = useLang()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status !== 'authenticated') return
    const fetchNotifs = async () => {
      try {
        const res = await fetch('/api/notifications')
        if (res.ok) {
          const data = await res.json()
          setNotifications(data.notifications)
        }
      } catch { /* ignore */ }
      setLoading(false)
    }
    fetchNotifs()
  }, [status])

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <p className="py-12 text-center text-sm text-muted">{lang === 'tl' ? 'Naglo-load...' : 'Loading...'}</p>
      </div>
    )
  }

  if (!session?.user) {
    router.push('/signin')
    return null
  }

  const markAllRead = async () => {
    await fetch('/api/notifications', { method: 'POST' })
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const totalUnread = notifications.filter((n) => !n.isRead).length

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <p className="py-12 text-center text-sm text-muted">{lang === 'tl' ? 'Naglo-load...' : 'Loading...'}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6 text-flag-blue" />
          <h1 className="font-[var(--font-display)] text-3xl font-bold">
            {lang === 'tl' ? 'Mga Notifikasyon' : 'Notifications'}
          </h1>
          {totalUnread > 0 && (
            <span className="rounded-full bg-flag-red px-2.5 py-0.5 text-xs font-bold text-white">
              {totalUnread}
            </span>
          )}
        </div>
        {totalUnread > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-1 text-sm text-flag-blue hover:underline">
            <CheckCheck className="h-4 w-4" /> {lang === 'tl' ? 'Markahan lahat' : 'Mark all read'}
          </button>
        )}
      </div>

      <p className="mt-2 text-sm text-muted">
        {lang === 'tl' ? 'Iyong mga notifikasyon mula sa Sari-Sari.' : 'Your notifications from Sari-Sari.'}
      </p>

      <div className="mt-8 space-y-2">
        {notifications.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted">
            {lang === 'tl' ? 'Wala pang notifikasyon.' : 'No notifications yet.'}
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`rounded-xl border border-subtle p-4 transition-colors ${!n.isRead ? 'border-flag-blue/20 bg-flag-blue/5' : 'bg-surface'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {n.link ? (
                    <Link href={n.link} className="text-sm font-medium hover:underline">
                      {n.message}
                    </Link>
                  ) : (
                    <p className="text-sm">{n.message}</p>
                  )}
                  <p className="mt-1 text-xs text-muted">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {!n.isRead && (
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-flag-blue" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
