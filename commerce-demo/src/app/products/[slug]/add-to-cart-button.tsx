'use client'

import { useCart } from '@/lib/store/cart'
import { useState } from 'react'
import { toast } from 'sonner'
import { useLang } from '@/lib/use-lang'

interface Product {
  slug: string
  nameTl: string
  nameEn: string
  price: number
  image: string
  inventory: number
}

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem)
  const [added, setAdded] = useState(false)
  const lang = useLang()

  const handleClick = () => {
    const cartName = lang === 'tl' ? product.nameTl : product.nameEn
    addItem({
      productId: product.slug,
      slug: product.slug,
      name: cartName,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
    setAdded(true)
    toast.success(`${cartName} — ${lang === 'tl' ? 'isinama sa basket!' : 'added to basket!'}`, { duration: 2000 })
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <button
      onClick={handleClick}
      disabled={product.inventory <= 0}
      className={`mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold text-white shadow-lg shadow-flag-blue/25 transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 ${
        added ? 'bg-leafy-green hover:brightness-90' : 'bg-flag-blue hover:brightness-90'
      }`}
    >
      {added ? (lang === 'tl' ? '✓ Naisama!' : '✓ Added!') : (lang === 'tl' ? '🛒 Isama sa Basket' : '🛒 Add to Basket')}
    </button>
  )
}
