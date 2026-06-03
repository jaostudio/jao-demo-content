export interface SeedProduct {
  name: string
  slug: string
  description: string
  price: number
  image: string
  categorySlug: string
  inventory: number
}

export const products: SeedProduct[] = [
  {
    name: 'Wireless Headphones',
    slug: 'wireless-headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life.',
    price: 29999,
    image: '/images/headphones.jpg',
    categorySlug: 'electronics',
    inventory: 50,
  },
  {
    name: 'Mechanical Keyboard',
    slug: 'mechanical-keyboard',
    description: 'RGB mechanical keyboard with Cherry MX Blue switches and aluminum frame.',
    price: 14999,
    image: '/images/keyboard.jpg',
    categorySlug: 'electronics',
    inventory: 30,
  },
  {
    name: 'USB-C Hub',
    slug: 'usb-c-hub',
    description: '7-in-1 USB-C hub with HDMI, SD card, and 100W power delivery.',
    price: 4999,
    image: '/images/usb-hub.jpg',
    categorySlug: 'electronics',
    inventory: 100,
  },
  {
    name: 'Cotton T-Shirt',
    slug: 'cotton-tshirt',
    description: 'Ultra-soft organic cotton t-shirt in heather gray.',
    price: 2999,
    image: '/images/tshirt.jpg',
    categorySlug: 'clothing',
    inventory: 200,
  },
  {
    name: 'Denim Jacket',
    slug: 'denim-jacket',
    description: 'Classic denim jacket with a modern slim fit. Machine washable.',
    price: 8999,
    image: '/images/jacket.jpg',
    categorySlug: 'clothing',
    inventory: 40,
  },
  {
    name: 'Indoor Plant Pot',
    slug: 'indoor-plant-pot',
    description: 'Ceramic plant pot with drainage tray. Fits 6-inch pots.',
    price: 2499,
    image: '/images/planter.jpg',
    categorySlug: 'home-garden',
    inventory: 75,
  },
  {
    name: 'Scented Candle Set',
    slug: 'scented-candle-set',
    description: 'Set of 3 soy wax candles: lavender, vanilla, and sandalwood.',
    price: 3499,
    image: '/images/candles.jpg',
    categorySlug: 'home-garden',
    inventory: 60,
  },
  {
    name: 'TypeScript Handbook',
    slug: 'typescript-handbook',
    description: 'Comprehensive guide to TypeScript 5.x with real-world examples.',
    price: 3999,
    image: '/images/book-ts.jpg',
    categorySlug: 'books',
    inventory: 150,
  },
  {
    name: 'System Design Interview',
    slug: 'system-design-interview',
    description: 'An insider\'s guide to acing system design interviews at top tech companies.',
    price: 3499,
    image: '/images/book-sd.jpg',
    categorySlug: 'books',
    inventory: 120,
  },
]
