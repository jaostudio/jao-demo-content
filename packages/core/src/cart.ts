export interface CartItem {
  listingId: string
  vendorId: string
  name: string
  price: number
  quantity: number
  image?: string
}

export interface CartGroup {
  vendorId: string
  vendorName: string
  items: CartItem[]
}

export interface Cart {
  items: CartItem[]
  groups: CartGroup[]
  total: number
  itemCount: number
}
