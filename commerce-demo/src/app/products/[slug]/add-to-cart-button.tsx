'use client'

import { useCart } from '@/lib/store/cart'

interface Product {
  slug: string
  name: string
  price: number
  image: string
}

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem)

  return (
    <button
      onClick={() =>
        addItem({
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image,
        })
      }
      className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-neutral-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
    >
      Add to Cart
    </button>
  )
}
