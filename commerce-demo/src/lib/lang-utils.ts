import type { Lang } from './lang'

const dict: Record<Lang, Record<string, string>> = {
  en: {
    'products.title': 'Products',
    'products.all': 'All',
    'products.noResults': 'No products found.',
    'products.noCategory': 'No products in this category.',
    'products.lowStock': 'Low stock',
    'products.outOfStock': 'Out of stock',
    'products.sort': 'Sort by',
    'products.sort.newest': 'Newest',
    'products.sort.priceAsc': 'Price: Low to High',
    'products.sort.priceDesc': 'Price: High to Low',
    'products.lowStockOnly': 'Low stock only',
    'products.items': 'items',
    'cart.lowStock': 'Low stock',
  },
  tl: {
    'products.title': 'Tinda / Products',
    'products.all': 'Lahat / All',
    'products.noResults': 'Walang natagpuang tinda.',
    'products.noCategory': 'Walang tinda sa kategoryang ito.',
    'products.lowStock': 'Low stock — mabilis maubos!',
    'products.outOfStock': 'Ubos na',
    'products.sort': 'Pag-ayos',
    'products.sort.newest': 'Pinakabago',
    'products.sort.priceAsc': 'Presyo: Mababa hanggang Mataas',
    'products.sort.priceDesc': 'Presyo: Mataas hanggang Mababa',
    'products.lowStockOnly': 'Low stock lang',
    'products.items': 'mga tinda',
    'cart.lowStock': 'Mabilis maubos',
  },
}

export function t(lang: Lang, key: string): string {
  return dict[lang]?.[key] ?? dict.en[key] ?? key
}