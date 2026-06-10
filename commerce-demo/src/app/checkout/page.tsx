'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useCart } from '@/lib/store/cart'
import { createOrder } from '@/lib/actions/orders'
import { toast } from 'sonner'
import { useLang } from '@/lib/use-lang'

const REGIONS = ['NCR', 'CAR', 'Region I (Ilocos)', 'Region III (Central Luzon)', 'Region IV-A (CALABARZON)']
const PROVINCES: Record<string, string[]> = {
  NCR: ['Metro Manila'],
  CAR: ['Benguet', 'Ifugao'],
  'Region I (Ilocos)': ['Ilocos Norte', 'Ilocos Sur', 'La Union', 'Pangasinan'],
  'Region III (Central Luzon)': ['Bulacan', 'Nueva Ecija', 'Pampanga', 'Tarlac', 'Zambales'],
  'Region IV-A (CALABARZON)': ['Cavite', 'Laguna', 'Batangas', 'Rizal', 'Quezon'],
}
const CITIES: Record<string, string[]> = {
  'Metro Manila': ['Manila', 'Quezon City', 'Makati', 'Pasig', 'Mandaluyong', 'Parañaque', 'Taguig'],
  Benguet: ['Baguio', 'La Trinidad'],
  'Ilocos Norte': ['Laoag', 'San Nicolas'],
  'Ilocos Sur': ['Vigan', 'Candon'],
  Bulacan: ['Malolos', 'Meycauayan', 'San Jose del Monte'],
  'Nueva Ecija': ['Cabanatuan', 'Palayan', 'San Jose'],
  Pampanga: ['Angeles', 'San Fernando', 'Mabalacat'],
  Cavite: ['Dasmariñas', 'Bacoor', 'Imus', 'General Trias'],
  Laguna: ['Santa Rosa', 'Biñan', 'Calamba', 'San Pedro'],
  Batangas: ['Batangas City', 'Lipa', 'Tanauan'],
  Rizal: ['Antipolo', 'Cainta', 'Taytay'],
}
const BARANGAYS: Record<string, string[]> = {
  Manila: ['Barangay 1', 'Barangay 2', 'Intramuros', 'Malate', 'Ermita'],
  'Quezon City': ['Diliman', 'Cubao', 'Project 4', 'Tandang Sora', 'Fairview'],
  Makati: ['Poblacion', 'San Antonio', 'Bel-Air', 'Palanan'],
  Pasig: ['San Miguel', 'Kapitolyo', 'Oranbo', 'Rosario'],
  Baguio: ['Session Road', 'Burnham', 'Country Club', 'Loakan'],
  'Santa Rosa': ['Pulo', 'Don Jose', 'Balibago', 'Santo Domingo'],
  Calamba: ['Real', 'Pansol', 'Uno', 'Parian'],
  Dasmariñas: ['Zone 1', 'Zone 2', 'Sampaloc', 'Salawag'],
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const lang = useLang()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  const [region, setRegion] = useState('')
  const [province, setProvince] = useState('')
  const [city, setCity] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [gcashStep, setGcashStep] = useState<'idle' | 'sent' | 'confirming'>('idle')

  const provinces = region ? PROVINCES[region] ?? [] : []
  const cities = province ? CITIES[province] ?? [] : []
  const barangays = city ? BARANGAYS[city] ?? [] : []

  const deliveryFee = subtotal() >= 49900 ? 0 : 4900
  const total = subtotal() + deliveryFee

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError('')

    const form = e.currentTarget
    const formData = new FormData(form)

    if (paymentMethod === 'gcash' && gcashStep === 'idle') {
      setGcashStep('sent')
      setPending(false)
      return
    }

    formData.set('items', JSON.stringify(items.map(({ productId, slug, name, price, image, quantity }) => ({ productId, slug, name, price, image, quantity }))))

    try {
      const result = await createOrder(formData)
      const existing = JSON.parse(localStorage.getItem('palengkee-orders') ?? '[]')
      existing.push(result.orderId)
      localStorage.setItem('palengkee-orders', JSON.stringify(existing))
      clearCart()
      toast.success(lang === 'tl' ? `Order ${result.orderNumber} created! Salamat!` : `Order ${result.orderNumber} created! Thank you!`)
      router.push(`/orders/${result.orderId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : (lang === 'tl' ? 'May error, mamsir. Subukan ulit.' : 'An error occurred. Please try again.'))
      toast.error(err instanceof Error ? err.message : (lang === 'tl' ? 'Hala, nag-error sa checkout!' : 'Checkout error!'))
      setPending(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <span className="text-6xl">🛒</span>
        <h1 className="mt-6 text-2xl font-bold">{lang === 'tl' ? 'Walang laman ang basket mo.' : 'Your cart is empty.'}</h1>
        <p className="mt-2 text-muted">{lang === 'tl' ? 'Mamili ka na sa Sari-Sari!' : 'Start shopping at Sari-Sari!'}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-[var(--font-display)] text-2xl font-bold">{lang === 'tl' ? 'Checkout' : 'Checkout'}</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-12 lg:grid-cols-2">
        {/* Billing */}
        <div className="space-y-4">
          <h2 className="font-semibold">{lang === 'tl' ? 'Impormasyon sa Paghahatid' : 'Shipping Info'}</h2>

          <div>
            <label className="block text-sm font-medium text-muted">{lang === 'tl' ? 'Buong Pangalan' : 'Full Name'}</label>
            <input name="name" required className="mt-1 block w-full rounded-xl border border-subtle bg-white px-4 py-2.5 text-sm dark:bg-surface" />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted">Email</label>
            <input name="email" type="email" required className="mt-1 block w-full rounded-xl border border-subtle bg-white px-4 py-2.5 text-sm dark:bg-surface" />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted">{lang === 'tl' ? 'Mobile' : 'Mobile'}</label>
            <input name="mobile" type="tel" placeholder="09171234567" className="mt-1 block w-full rounded-xl border border-subtle bg-white px-4 py-2.5 text-sm dark:bg-surface" />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted">{lang === 'tl' ? 'Rehiyon' : 'Region'}</label>
            <select name="region" value={region} onChange={(e) => { setRegion(e.target.value); setProvince(''); setCity('') }} required className="mt-1 block w-full rounded-xl border border-subtle bg-white px-4 py-2.5 text-sm dark:bg-surface">
              <option value="">{lang === 'tl' ? 'Pumili ng rehiyon' : 'Select region'}</option>
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted">{lang === 'tl' ? 'Probinsya' : 'Province'}</label>
            <select name="province" value={province} onChange={(e) => { setProvince(e.target.value); setCity('') }} required disabled={!region} className="mt-1 block w-full rounded-xl border border-subtle bg-white px-4 py-2.5 text-sm disabled:opacity-50 dark:bg-surface">
              <option value="">{lang === 'tl' ? 'Pumili ng probinsya' : 'Select province'}</option>
              {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted">{lang === 'tl' ? 'Lungsod / Munisipalidad' : 'City / Municipality'}</label>
            <select name="city" value={city} onChange={(e) => setCity(e.target.value)} required disabled={!province} className="mt-1 block w-full rounded-xl border border-subtle bg-white px-4 py-2.5 text-sm disabled:opacity-50 dark:bg-surface">
              <option value="">{lang === 'tl' ? 'Pumili ng lungsod' : 'Select city'}</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted">{lang === 'tl' ? 'Barangay' : 'Barangay'}</label>
            <select name="barangay" required disabled={!city} className="mt-1 block w-full rounded-xl border border-subtle bg-white px-4 py-2.5 text-sm disabled:opacity-50 dark:bg-surface">
              <option value="">{lang === 'tl' ? 'Pumili ng barangay' : 'Select barangay'}</option>
              {barangays.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {/* Payment */}
          <div className="pt-4">
            <h2 className="font-semibold">{lang === 'tl' ? 'Bayad' : 'Payment'}</h2>
            <div className="mt-3 space-y-2">
              {[
                { value: 'cod', label: 'Cash on Delivery', desc: lang === 'tl' ? 'Bayad pagdating, paki-exact daw' : 'Pay upon delivery, exact amount preferred' },
                { value: 'gcash', label: 'GCash', desc: lang === 'tl' ? 'Magbayad gamit ang GCash' : 'Send payment via GCash' },
              ].map((pm) => (
                <label key={pm.value} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${paymentMethod === pm.value ? 'border-flag-blue bg-flag-blue/5' : 'border-subtle'}`}>
                  <input type="radio" name="paymentMethod" value={pm.value} checked={paymentMethod === pm.value} onChange={(e) => { setPaymentMethod(e.target.value); setGcashStep('idle') }} className="accent-flag-blue" />
                  <div>
                    <span className="text-sm font-semibold">{pm.label}</span>
                    <p className="text-xs text-muted">{pm.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* GCash simulation */}
          {paymentMethod === 'gcash' && (
            <div className="rounded-xl border border-leafy-green/30 bg-leafy-green/5 p-4">
              <p className="text-sm font-semibold text-leafy-green-dark dark:text-leafy-green">📱 {lang === 'tl' ? 'Magbayad gamit ang GCash' : 'Pay with GCash'}</p>
              {gcashStep === 'idle' && (
                <p className="mt-2 text-xs text-muted">
                  {lang === 'tl' ? 'I-click ang "Nagbayad na ako" pagkatapos magpadala ng' : 'Click "I have paid" after sending'} <strong>₱{(total / 100).toFixed(2)}</strong> {lang === 'tl' ? 'sa GCash' : 'to GCash'} <strong>09171234567</strong> (Sari-Sari Store).
                </p>
              )}
              {gcashStep === 'sent' && (
                <div>
                  <label className="block text-xs font-medium text-muted">{lang === 'tl' ? 'GCash Reference Number' : 'GCash Reference Number'}</label>
                  <input name="gcashRef" placeholder="e.g. GC1234567890" className="mt-1 block w-full rounded-lg border border-subtle bg-white px-3 py-2 text-sm dark:bg-surface" />
                </div>
              )}
              <input type="hidden" name="gcashStep" value={gcashStep} />
            </div>
          )}

          {error && <p className="text-sm text-flag-red">{error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-flag-blue text-sm font-semibold text-white shadow-lg shadow-flag-blue/25 transition-all hover:brightness-90 disabled:opacity-50 active:scale-[0.99]"
          >
            {pending ? (lang === 'tl' ? 'Pinoproseso...' : 'Processing...') : paymentMethod === 'gcash' && gcashStep === 'idle' ? (lang === 'tl' ? 'Nagbayad na ako sa GCash' : 'I have paid via GCash') : `${lang === 'tl' ? 'Mag-order' : 'Place Order'} — ₱${(total / 100).toFixed(2)}`}
          </button>
        </div>

        {/* Summary */}
        <div>
          <h2 className="font-semibold">{lang === 'tl' ? 'Buod ng Order' : 'Order Summary'}</h2>
          <div className="mt-4 divide-y divide-subtle">
            {items.map((item) => (
              <div key={item.slug} className="flex items-center gap-4 py-4">
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-subtle">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted">{lang === 'tl' ? 'Qty:' : 'Qty:'} {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold">₱{((item.price * item.quantity) / 100).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">{lang === 'tl' ? 'Subtotal' : 'Subtotal'}</span>
              <span>₱{(subtotal() / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">{lang === 'tl' ? 'Delivery' : 'Delivery'}</span>
              <span>{deliveryFee === 0 ? (lang === 'tl' ? 'LIBRE!' : 'FREE!') : `₱${(deliveryFee / 100).toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between border-t border-subtle pt-2 text-lg font-bold">
              <span>{lang === 'tl' ? 'Kabuuan' : 'Total'}</span>
              <span>₱{(total / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
