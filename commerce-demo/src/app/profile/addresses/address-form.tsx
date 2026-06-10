'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'

type Address = {
  id: string
  label: string
  region: string
  province: string
  city: string
  barangay: string
  street: string
  isDefault: boolean
}

export function AddressForm({ addresses, lang }: { addresses: Address[]; lang: string }) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [label, setLabel] = useState('')
  const [region, setRegion] = useState('')
  const [province, setProvince] = useState('')
  const [city, setCity] = useState('')
  const [barangay, setBarangay] = useState('')
  const [street, setStreet] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!label || !region || !province || !city || !barangay || !street) return
    setSaving(true)
    try {
      const res = await fetch('/api/profile/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label, region, province, city, barangay, street }),
      })
      if (res.ok) {
        setLabel(''); setRegion(''); setProvince(''); setCity(''); setBarangay(''); setStreet('')
        setShowForm(false)
        setMessage(lang === 'tl' ? 'Nai-save ang address!' : 'Address saved!')
        router.refresh()
      }
    } catch { /* ignore */ }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    await fetch('/api/profile/address', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    router.refresh()
  }

  const inputClass = 'mt-1 block w-full rounded-xl border border-subtle bg-white px-4 py-2.5 text-sm dark:bg-surface focus:border-flag-blue focus:ring-flag-blue'

  return (
    <div className="mt-8 space-y-4">
      {message && <p className="rounded-lg bg-leafy-green/10 px-4 py-2 text-sm text-leafy-green">{message}</p>}

      {addresses.map((addr) => (
        <div key={addr.id} className="flex items-start justify-between rounded-xl border border-subtle bg-surface p-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{addr.label}</span>
              {addr.isDefault && <span className="rounded-full bg-flag-blue/10 px-2 py-0.5 text-[10px] font-medium text-flag-blue">{lang === 'tl' ? 'Default' : 'Default'}</span>}
            </div>
            <p className="mt-1 text-xs text-muted">{addr.street}, {addr.barangay}, {addr.city}</p>
            <p className="text-xs text-muted">{addr.province}, {addr.region}</p>
          </div>
          <button onClick={() => handleDelete(addr.id)} className="rounded-lg p-2 text-flag-red transition-colors hover:bg-flag-red/10" aria-label={lang === 'tl' ? 'Burahin' : 'Delete'}>
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      {addresses.length === 0 && (
        <p className="py-8 text-center text-sm text-muted">{lang === 'tl' ? 'Wala pang address.' : 'No addresses yet.'}</p>
      )}

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-xl bg-flag-blue px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:brightness-90">
          <Plus className="h-4 w-4" /> {lang === 'tl' ? 'Magdagdag ng Address' : 'Add Address'}
        </button>
      ) : (
        <form onSubmit={handleAdd} className="rounded-xl border border-subtle bg-surface p-5">
          <h3 className="text-sm font-semibold">{lang === 'tl' ? 'Bagong Address' : 'New Address'}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-muted">{lang === 'tl' ? 'Label' : 'Label'}</label>
              <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder={lang === 'tl' ? 'Bahay, Trabaho...' : 'Home, Work...'} className={inputClass} required />
            </div>
            <div>
              <label className="text-xs font-medium text-muted">{lang === 'tl' ? 'Rehiyon' : 'Region'}</label>
              <input type="text" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="NCR" className={inputClass} required />
            </div>
            <div>
              <label className="text-xs font-medium text-muted">{lang === 'tl' ? 'Lalawigan' : 'Province'}</label>
              <input type="text" value={province} onChange={(e) => setProvince(e.target.value)} placeholder="Metro Manila" className={inputClass} required />
            </div>
            <div>
              <label className="text-xs font-medium text-muted">{lang === 'tl' ? 'Lungsod' : 'City'}</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Quezon City" className={inputClass} required />
            </div>
            <div>
              <label className="text-xs font-medium text-muted">Barangay</label>
              <input type="text" value={barangay} onChange={(e) => setBarangay(e.target.value)} placeholder="Diliman" className={inputClass} required />
            </div>
            <div>
              <label className="text-xs font-medium text-muted">{lang === 'tl' ? 'Kalsada' : 'Street'}</label>
              <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} placeholder="123 Rizal St" className={inputClass} required />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button type="submit" disabled={saving} className="rounded-xl bg-flag-blue px-6 py-2 text-sm font-semibold text-white transition-colors hover:brightness-90 disabled:opacity-50">
              {saving ? (lang === 'tl' ? 'Sine-save...' : 'Saving...') : (lang === 'tl' ? 'I-save' : 'Save')}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-muted hover:underline">
              {lang === 'tl' ? 'Kanselahin' : 'Cancel'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
