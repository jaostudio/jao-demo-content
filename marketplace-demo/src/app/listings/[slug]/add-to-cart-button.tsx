'use client'

import { useCart } from '@/lib/store/cart'

interface ListingInfo {
  id: string
  title: string
  price: number
  vendorId: string
  vendorName: string
}

export function AddToCartButton({ listing }: { listing: ListingInfo }) {
  const addItem = useCart((s) => s.addItem)

  return (
    <button
      onClick={() =>
        addItem({
          listingId: listing.id,
          vendorId: listing.vendorId,
          name: listing.title,
          price: listing.price,
          quantity: 1,
        })
      }
      className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-neutral-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
    >
      Add to Cart
    </button>
  )
}
