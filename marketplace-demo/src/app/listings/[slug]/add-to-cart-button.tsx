'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ShoppingBag, Check, Calendar, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useCart } from '@/lib/store/cart'

interface ListingInfo {
  id: string
  title: string
  price: number
  vendorId: string
  vendorName: string
  imageUrl: string | null
}

interface AddToCartButtonProps {
  listing: ListingInfo
  isService?: boolean
}

export function AddToCartButton({ listing, isService }: AddToCartButtonProps) {
  const reduce = useReducedMotion()
  const { data: session } = useSession()
  const addItem = useCart((s) => s.addItem)
  const [added, setAdded] = useState(false)
  const [pending, setPending] = useState(false)

  function handleAdd() {
    setPending(true)
    addItem({
      listingId: listing.id,
      vendorId: listing.vendorId,
      vendorName: listing.vendorName,
      name: listing.title,
      price: listing.price,
      imageUrl: listing.imageUrl,
      quantity: 1,
    })
    setTimeout(() => {
      setAdded(true)
      setPending(false)
      toast.success('Added to cart')
      setTimeout(() => setAdded(false), 1800)
    }, 200)
  }

  if (!session) {
    return (
      <Link
        href={`/auth/signin?callbackUrl=/listings/${listing.id}`}
        className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary-500 px-6 text-base font-semibold text-white shadow-warm-md transition-colors hover:bg-primary-600"
      >
        <ShoppingBag className="h-5 w-5" />
        Sign in to {isService ? 'book' : 'buy'}
      </Link>
    )
  }

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="mt-6 space-y-2"
    >
      <button
        onClick={handleAdd}
        disabled={pending}
        className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary-500 px-6 text-base font-semibold text-white shadow-warm-md transition-colors hover:bg-primary-600 disabled:opacity-60"
      >
        {pending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Adding…
          </>
        ) : added ? (
          <>
            <Check className="h-5 w-5" />
            Added to cart
          </>
        ) : (
          <>
            {isService ? <Calendar className="h-5 w-5" /> : <ShoppingBag className="h-5 w-5" />}
            {isService ? 'Book this experience' : 'Add to cart'}
          </>
        )}
      </button>
      <Link
        href="/cart"
        className="inline-flex h-11 w-full items-center justify-center rounded-2xl border border-neutral-300 bg-white text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
      >
        View cart
      </Link>
    </motion.div>
  )
}
