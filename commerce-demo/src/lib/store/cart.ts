'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productId: string
  slug: string
  name: string
  price: number
  image: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (slug: string) => void
  updateQuantity: (slug: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  subtotal: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.slug === item.slug)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.slug === item.slug ? { ...i, quantity: i.quantity + (item.quantity ?? 1) } : i,
              ),
            }
          }
          return { items: [...state.items, { ...item, quantity: item.quantity ?? 1, productId: item.productId ?? item.slug }] }
        }),
      removeItem: (slug) =>
        set((state) => ({ items: state.items.filter((i) => i.slug !== slug) })),
      updateQuantity: (slug, quantity) =>
        set((state) => ({
          items: quantity <= 0
            ? state.items.filter((i) => i.slug !== slug)
            : state.items.map((i) => (i.slug === slug ? { ...i, quantity } : i)),
        })),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: 'palengkee-cart' },
  ),
)
