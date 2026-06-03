'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  listingId: string
  vendorId: string
  name: string
  price: number
  quantity: number
}

interface CartGroup {
  vendorId: string
  vendorName: string
  items: CartItem[]
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (listingId: string) => void
  updateQuantity: (listingId: string, quantity: number) => void
  clearCart: () => void
  groups: () => CartGroup[]
  total: () => number
  itemCount: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.listingId === item.listingId)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.listingId === item.listingId
                  ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
                  : i
              ),
            }
          }
          return {
            items: [
              ...state.items,
              {
                listingId: item.listingId,
                vendorId: item.vendorId,
                name: item.name,
                price: item.price,
                quantity: item.quantity ?? 1,
              },
            ],
          }
        }),
      removeItem: (listingId) =>
        set((state) => ({ items: state.items.filter((i) => i.listingId !== listingId) })),
      updateQuantity: (listingId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.listingId !== listingId)
              : state.items.map((i) =>
                  i.listingId === listingId ? { ...i, quantity } : i
                ),
        })),
      clearCart: () => set({ items: [] }),
      groups: () => {
        const items = get().items
        const map = new Map<string, { vendorName: string; items: CartItem[] }>()
        for (const item of items) {
          if (!map.has(item.vendorId)) {
            map.set(item.vendorId, { vendorName: '', items: [] })
          }
          map.get(item.vendorId)!.items.push(item)
        }
        return Array.from(map.entries()).map(([vendorId, g]) => ({
          vendorId,
          vendorName: g.vendorName,
          items: g.items,
        }))
      },
      total: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
      itemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    { name: 'marketplace-cart' }
  )
)
