'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  listingId: string
  vendorId: string
  vendorName: string
  name: string
  price: number
  imageUrl: string | null
  quantity: number
}

export interface CartGroup {
  vendorId: string
  vendorName: string
  items: CartItem[]
  subtotal: number
}

interface CartState {
  items: CartItem[]
  couponCode: string | null
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (listingId: string) => void
  updateQuantity: (listingId: string, quantity: number) => void
  clearCart: () => void
  setCoupon: (code: string | null) => void
  groups: () => CartGroup[]
  total: () => number
  itemCount: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.listingId === item.listingId)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.listingId === item.listingId
                  ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
                  : i,
              ),
            }
          }
          return {
            items: [
              ...state.items,
              {
                listingId: item.listingId,
                vendorId: item.vendorId,
                vendorName: item.vendorName,
                name: item.name,
                price: item.price,
                imageUrl: item.imageUrl,
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
                  i.listingId === listingId ? { ...i, quantity } : i,
                ),
        })),
      clearCart: () => set({ items: [], couponCode: null }),
      setCoupon: (code) => set({ couponCode: code }),
      groups: () => {
        const items = get().items
        const map = new Map<string, { vendorName: string; items: CartItem[] }>()
        for (const item of items) {
          if (!map.has(item.vendorId)) {
            map.set(item.vendorId, { vendorName: item.vendorName, items: [] })
          }
          map.get(item.vendorId)!.items.push(item)
        }
        return Array.from(map.entries()).map(([vendorId, g]) => ({
          vendorId,
          vendorName: g.vendorName,
          items: g.items,
          subtotal: g.items.reduce((s, i) => s + i.price * i.quantity, 0),
        }))
      },
      total: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
      itemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    { name: 'likha-cart-v2' },
  ),
)
