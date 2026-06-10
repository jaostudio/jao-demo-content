'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

export function SettingsForm({ lang }: { lang: string }) {
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [pwMessage, setPwMessage] = useState('')

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setPwMessage(lang === 'tl' ? 'Hindi tugma ang bagong password.' : 'New passwords do not match.')
      return
    }
    setSaving(true)
    setPwMessage('')
    try {
      const res = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      if (res.ok) {
        setPwMessage(lang === 'tl' ? 'Nabago na ang password!' : 'Password changed!')
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
      } else {
        const data = await res.json()
        setPwMessage(data.error || (lang === 'tl' ? 'Error sa pagbago ng password.' : 'Error changing password.'))
      }
    } catch { setPwMessage(lang === 'tl' ? 'Error sa pagbago ng password.' : 'Error changing password.') }
    setSaving(false)
  }

  const handleDeleteAccount = async () => {
    if (!confirm(lang === 'tl' ? 'Sigurado ka bang gusto mong burahin ang account mo? Hindi na ito maaaring ibalik.' : 'Are you sure you want to delete your account? This cannot be undone.')) return
    await fetch('/api/profile', { method: 'DELETE' })
    await signOut({ callbackUrl: '/' })
  }

  const inputClass = 'mt-1 block w-full rounded-xl border border-subtle bg-white px-4 py-2.5 text-sm dark:bg-surface focus:border-flag-blue focus:ring-flag-blue'

  return (
    <div className="mt-8 space-y-8">
      <section className="rounded-xl border border-subtle bg-surface p-6">
        <h2 className="font-[var(--font-display)] text-xl font-bold">{lang === 'tl' ? 'Baguhin ang Password' : 'Change Password'}</h2>
        <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium">{lang === 'tl' ? 'Kasalukuyang Password' : 'Current Password'}</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputClass} required />
          </div>
          <div>
            <label className="block text-sm font-medium">{lang === 'tl' ? 'Bagong Password' : 'New Password'}</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} required minLength={6} />
          </div>
          <div>
            <label className="block text-sm font-medium">{lang === 'tl' ? 'Kumpirmahin ang Bagong Password' : 'Confirm New Password'}</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} required />
          </div>
          <button type="submit" disabled={saving} className="rounded-xl bg-flag-blue px-6 py-2 text-sm font-semibold text-white transition-colors hover:brightness-90 disabled:opacity-50">
            {saving ? (lang === 'tl' ? 'Pinapalitan...' : 'Saving...') : (lang === 'tl' ? 'Palitan ang Password' : 'Change Password')}
          </button>
          {pwMessage && <p className={`text-sm ${pwMessage.includes('Error') || pwMessage.includes('error') || pwMessage.includes('tugma') ? 'text-flag-red' : 'text-leafy-green'}`}>{pwMessage}</p>}
        </form>
      </section>

      <section className="rounded-xl border border-flag-red/30 bg-surface p-6">
        <h2 className="font-[var(--font-display)] text-xl font-bold text-flag-red">{lang === 'tl' ? 'Delikadong Sona' : 'Danger Zone'}</h2>
        <p className="mt-1 text-sm text-muted">
          {lang === 'tl' ? ' Permanenteng burahin ang iyong account at lahat ng data.' : 'Permanently delete your account and all data.'}
        </p>
        <button onClick={handleDeleteAccount} className="mt-4 rounded-xl bg-flag-red px-6 py-2 text-sm font-semibold text-white transition-colors hover:brightness-90">
          {lang === 'tl' ? 'Burahin ang Account' : 'Delete Account'}
        </button>
      </section>
    </div>
  )
}
