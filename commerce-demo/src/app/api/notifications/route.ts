import { NextResponse } from 'next/server'
import { getUserNotifications, markAllNotificationsRead, getUnreadCount } from '@/lib/actions/notifications'

export async function GET() {
  const [notifications, unread] = await Promise.all([
    getUserNotifications(),
    getUnreadCount(),
  ])
  return NextResponse.json({ notifications, unread })
}

export async function POST() {
  await markAllNotificationsRead()
  return NextResponse.json({ ok: true })
}
