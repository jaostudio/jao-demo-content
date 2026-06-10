'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useCart } from '@/lib/store/cart'
import { Trash2, Minus, Plus, Ticket, Gift, Package } from 'lucide-react'
import { useLang } from '@/lib/use-lang'

const TAWAD_CODES: Record<string, { label: string; discount: number; type: 'percent' | 'flat' | 'free_shipping'; min?: number }> = {
  SENIOR: { label: 'Senior Discount', discount: 10, type: 'percent' },
  TAWAD: { label: 'Tawad Promo', discount: 2000, type: 'flat' },
  SARI: { label: 'Free Delivery', discount: 4900, type: 'free_shipping' },
  SUKING: { label: 'Suki Discount', discount: 5, type: 'percent', min: 10000 },
}

const DELIVERY_FEE = 4900

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart()
  const lang = useLang()
  const [tawadCode, setTawadCode] = useState('')
  const [appliedCode, setAppliedCode] = useState<string | null>(null)
  const [tawadError, setTawadError] = useState('')
  const [sukiPoints] = useState(50)
  const [bundles, setBundles] = useState<{ name: string; discountTotal: number }[]>([])

  useEffect(() => {
    const checkBundles = async () => {
      const res = await fetch('/api/bundles/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: items.map((i) => i.slug) }),
      })
      if (res.ok) setBundles(await res.json())
    }
    if (items.length > 0) checkBundles()
    else setBundles([])
  }, [items])

  const bundleDiscount = bundles.reduce((sum, b) => sum + b.discountTotal, 0)
  const sub = subtotal()

  const handleTawadSubmit = () => {
    const code = tawadCode.trim().toUpperCase()
    const promo = TAWAD_CODES[code]
    if (promo) {
      if (promo.min && sub < promo.min) {
        setTawadError(lang === 'tl' ? `Kailangan ng ₱${(promo.min / 100).toFixed(0)} minimum order, mamsir!` : `Minimum order of ₱${(promo.min / 100).toFixed(0)} required.`)
        setAppliedCode(null)
      } else {
        setAppliedCode(code)
        setTawadError('')
      }
    } else {
      setTawadError(lang === 'tl' ? 'Walang ganitong code, mamsir!' : 'Invalid promo code.')
      setAppliedCode(null)
    }
  }

  const discount = appliedCode ? TAWAD_CODES[appliedCode] : null

  let discountAmount = 0
  if (discount?.type === 'percent') {
    discountAmount = Math.round(sub * (discount.discount / 100))
  } else if (discount?.type === 'flat') {
    discountAmount = discount.discount
  }

  const delivery = discount?.type === 'free_shipping' ? 0 : DELIVERY_FEE
  const total = Math.max(0, sub - discountAmount - bundleDiscount + delivery)
  const pointsUsed = Math.min(sukiPoints * 100, total)
  const finalTotal = Math.max(0, total - pointsUsed)

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <span className="text-6xl">🛒</span>
        <h1 className="mt-6 text-2xl font-bold">{lang === 'tl' ? 'Walang laman ang basket mo.' : 'Your cart is empty.'}</h1>
        <p className="mt-2 text-muted">{lang === 'tl' ? 'Mamili ka na sa Sari-Sari!' : 'Start shopping at Sari-Sari!'}</p>
        <Link
          href="/products"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-flag-blue px-6 text-sm font-semibold text-white shadow-lg shadow-flag-blue/25 transition-all hover:brightness-90"
        >
          {lang === 'tl' ? 'Mamili Na!' : 'Shop Now!'}
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-[var(--font-display)] text-2xl font-bold">{lang === 'tl' ? 'Basket' : 'Cart'}</h1>

      <div className="mt-8 divide-y divide-subtle">
        {items.map((item) => (
          <div key={item.slug} className="flex items-center gap-4 py-6">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-subtle">
              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <Link href={`/products/${item.slug}`} className="font-semibold hover:text-foreground">
                {item.name}
              </Link>
              <p className="mt-1 text-sm text-muted">₱{(item.price / 100).toFixed(2)} {lang === 'tl' ? 'bawat isa' : 'each'}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-subtle hover:bg-surface dark:hover:bg-surface"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-subtle hover:bg-surface dark:hover:bg-surface"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <p className="w-20 text-right font-bold">
              ₱{((item.price * item.quantity) / 100).toFixed(2)}
            </p>
            <button
              onClick={() => removeItem(item.slug)}
              className="flex h-8 w-8 items-center justify-center text-muted transition-colors hover:text-flag-red"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Tawad Code */}
      <div className="mt-6 rounded-xl border border-subtle p-4">
        <div className="flex items-center gap-2">
          <Ticket className="h-4 w-4 text-flag-yellow" />
          <span className="text-sm font-semibold">{lang === 'tl' ? 'Tawad Code' : 'Promo Code'}</span>
        </div>
        <div className="mt-2 flex gap-2">
          <input
            value={tawadCode}
            onChange={(e) => setTawadCode(e.target.value)}
            placeholder={lang === 'tl' ? 'Ilagay ang code: SENIOR, TAWAD, SARI, SUKING' : 'Enter code: SENIOR, TAWAD, SARI, SUKING'}
            className="flex-1 rounded-lg border border-subtle bg-white px-3 py-2 text-sm dark:bg-surface"
          />
          <button
            onClick={handleTawadSubmit}
            className="rounded-lg bg-flag-blue px-4 py-2 text-sm font-semibold text-white"
          >
            {lang === 'tl' ? 'Ilapat' : 'Apply'}
          </button>
        </div>
        {appliedCode && (
          <p className="mt-1 text-xs text-leafy-green">{TAWAD_CODES[appliedCode].label} {lang === 'tl' ? 'inilapat na!' : 'applied!'}</p>
        )}
        {tawadError && <p className="mt-1 text-xs text-flag-red">{tawadError}</p>}
        <div className="mt-2 flex gap-2">
          {Object.keys(TAWAD_CODES).map((code) => (
            <button
              key={code}
              onClick={() => { setTawadCode(code); setAppliedCode(null); setTawadError('') }}
              className="rounded-full border border-subtle px-2.5 py-0.5 text-[10px] font-medium text-muted transition-colors hover:border-subtle hover:text-foreground"
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      {/* Sukli Points */}
      <div className="mt-4 rounded-xl border border-leafy-green/20 bg-leafy-green/5 p-4 dark:border-leafy-green/30">
        <div className="flex items-center gap-2">
          <Gift className="h-4 w-4 text-leafy-green" />
          <span className="text-sm font-semibold">{lang === 'tl' ? 'Sukli Points' : 'Suki Points'}</span>
        </div>
        <p className="mt-1 text-xs text-muted">
          {lang === 'tl' ? `Mayroon kang ` : `You have `}<strong className="text-leafy-green">{sukiPoints} {lang === 'tl' ? 'points' : 'points'}</strong> (₱{(sukiPoints * 100 / 100).toFixed(2)} {lang === 'tl' ? 'halaga' : 'value'}). {lang === 'tl' ? 'Maaaring gamitin sa checkout.' : 'Can be applied at checkout.'}
        </p>
      </div>

      {/* Summary */}
      <div className="mt-8 border-t border-subtle pt-6">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">{lang === 'tl' ? 'Subtotal' : 'Subtotal'}</span>
            <span>₱{(sub / 100).toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-leafy-green">
              <span>{discount?.label}</span>
              <span>-₱{(discountAmount / 100).toFixed(2)}</span>
            </div>
          )}
          {bundleDiscount > 0 && (
            <div className="flex justify-between text-flag-yellow">
              <span className="flex items-center gap-1"><Package className="h-3 w-3" /> Bundle Deal</span>
              <span>-₱{(bundleDiscount / 100).toFixed(2)}</span>
            </div>
          )}
          {bundles.length === 0 && items.length >= 2 && (
            <div className="rounded-lg bg-flag-yellow/10 px-3 py-2 text-xs text-muted">
              <Package className="mr-1 inline h-3 w-3" /> {lang === 'tl' ? 'Magdagdag ng mga produkto para ma-unlock ang bundle discounts!' : 'Add specific products to unlock bundle discounts!'}
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted">{lang === 'tl' ? 'Delivery' : 'Delivery'}</span>
            <span>{delivery === 0 ? (lang === 'tl' ? 'LIBRE!' : 'FREE!') : `₱${(delivery / 100).toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between border-t border-subtle pt-2 text-lg font-bold">
            <span>{lang === 'tl' ? 'Kabuuan' : 'Total'}</span>
            <span>₱{(finalTotal / 100).toFixed(2)}</span>
          </div>
        </div>

        <Link
          href="/checkout"
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-flag-blue text-sm font-semibold text-white shadow-lg shadow-flag-blue/25 transition-all hover:brightness-90 active:scale-[0.99]"
        >
          {lang === 'tl' ? 'Checkout Na!' : 'Proceed to Checkout'}
        </Link>
      </div>
    </div>
  )
}
