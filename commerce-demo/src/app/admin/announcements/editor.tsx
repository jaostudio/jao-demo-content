'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function AnnouncementEditor({ initialMessage, initialEnabled }: { initialMessage: string; initialEnabled: boolean }) {
  const router = useRouter()
  const [message, setMessage] = useState(initialMessage)
  const [enabled, setEnabled] = useState(initialEnabled)
  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await Promise.all([
      fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'announcement_message', value: message }),
      }),
      fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'announcement_enabled', value: String(enabled) }),
      }),
    ])
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    router.refresh()
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-xl border border-subtle bg-surface p-6">
        <label className="block text-sm font-medium">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="e.g. Store closed on June 12 for Independence Day!"
          className="mt-2 block w-full rounded-xl border border-subtle bg-white px-4 py-2.5 text-sm dark:bg-surface focus:border-flag-blue focus:ring-flag-blue"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="enabled"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="h-4 w-4 rounded border-subtle text-flag-blue focus:ring-flag-blue"
        />
        <label htmlFor="enabled" className="text-sm font-medium">Show announcement banner to customers</label>
      </div>

      <button
        onClick={() => setPreview(!preview)}
        className="mr-3 rounded-xl border border-subtle px-6 py-2 text-sm font-semibold transition-colors hover:bg-surface"
      >
        {preview ? 'Hide Preview' : 'Preview'}
      </button>
      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-xl bg-flag-blue px-6 py-2 text-sm font-semibold text-white transition-colors hover:brightness-90 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Announcement'}
      </button>
      {saved && <span className="ml-2 text-sm text-leafy-green">Saved!</span>}

      {preview && enabled && message && (
        <div className="rounded-xl border border-flag-yellow/20 bg-flag-yellow/5 p-4">
          <p className="text-sm font-medium text-flag-yellow">{message}</p>
        </div>
      )}
    </div>
  )
}
