'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Settings } from 'lucide-react'
import Link from 'next/link'

type UserData = {
  id: string
  name: string
  email: string
  mobile: string | null
  avatar: string | null
  sukiPoints: number
  isActive: boolean
}

export function ProfileForm({ user, lang }: { user: UserData; lang: string }) {
  const router = useRouter()
  const [name, setName] = useState(user.name)
  const [mobile, setMobile] = useState(user.mobile || '')
  const [avatar, setAvatar] = useState(user.avatar || '')
  const [message, setMessage] = useState('')

  const handleSave = async () => {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, mobile, avatar }),
    })
    if (res.ok) {
      setMessage(lang === 'tl' ? 'Nai-save!' : 'Saved!')
      router.refresh()
    } else {
      setMessage(lang === 'tl' ? 'Error sa pag-save' : 'Error saving')
    }
  }

  const inputClass = 'mt-1 block w-full rounded-xl border border-subtle bg-white px-4 py-2.5 text-sm dark:bg-surface focus:border-flag-blue focus:ring-flag-blue'

  return (
    <div className="mt-8 space-y-6">
      <section className="rounded-xl border border-subtle bg-surface p-6">
        <h2 className="font-[var(--font-display)] text-xl font-bold">{lang === 'tl' ? 'Pangunahing Impormasyon' : 'Basic Info'}</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium">{lang === 'tl' ? 'Avatar URL' : 'Avatar URL'}</label>
            <input type="text" value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://..." className={inputClass} />
            {avatar && <img src={avatar} alt="Preview" className="mt-2 h-16 w-16 rounded-full object-cover" />}
          </div>
          <div>
            <label className="block text-sm font-medium">{lang === 'tl' ? 'Pangalan' : 'Name'}</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" value={user.email} disabled className="mt-1 block w-full rounded-xl border border-subtle bg-surface px-4 py-2.5 text-sm dark:bg-surface" />
          </div>
          <div>
            <label className="block text-sm font-medium">{lang === 'tl' ? 'Mobile' : 'Mobile'}</label>
            <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="+63..." className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium">{lang === 'tl' ? 'Suki Points' : 'Suki Points'}</label>
            <p className="mt-1 text-lg font-bold text-flag-yellow">{user.sukiPoints} pts</p>
          </div>
        </div>
        <button onClick={handleSave} className="mt-4 rounded-xl bg-flag-blue px-6 py-2 text-sm font-semibold text-white transition-colors hover:brightness-90">
          {lang === 'tl' ? 'I-save ang mga Pagbabago' : 'Save Changes'}
        </button>
        {message && <p className={`mt-2 text-sm ${message.includes('Error') || message.includes('error') ? 'text-flag-red' : 'text-leafy-green'}`}>{message}</p>}
      </section>

      <section className="rounded-xl border border-subtle bg-surface p-6">
        <h2 className="font-[var(--font-display)] text-xl font-bold">{lang === 'tl' ? 'Account Links' : 'Account Links'}</h2>
        <div className="mt-4 space-y-3">
          <Link href="/profile/addresses" className="flex items-center gap-3 rounded-lg border border-subtle p-4 transition-colors hover:border-flag-blue/30 hover:bg-surface">
            <MapPin className="h-5 w-5 text-flag-blue" />
            <div>
              <p className="text-sm font-medium">{lang === 'tl' ? 'Mga Address' : 'Addresses'}</p>
              <p className="text-xs text-muted">{lang === 'tl' ? 'I-manage ang iyong mga delivery address' : 'Manage your delivery addresses'}</p>
            </div>
          </Link>
          <Link href="/profile/settings" className="flex items-center gap-3 rounded-lg border border-subtle p-4 transition-colors hover:border-flag-blue/30 hover:bg-surface">
            <Settings className="h-5 w-5 text-flag-blue" />
            <div>
              <p className="text-sm font-medium">{lang === 'tl' ? 'Settings' : 'Settings'}</p>
              <p className="text-xs text-muted">{lang === 'tl' ? 'Baguhin ang password at pamahalaan ang account' : 'Change password and manage account'}</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
