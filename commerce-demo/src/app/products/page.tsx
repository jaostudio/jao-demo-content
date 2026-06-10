import Link from 'next/link'
import { getCategories } from '@/lib/products'
import { prisma } from '@/lib/prisma'
import { getLang } from '@/lib/lang'
import { t } from '@/lib/lang-utils'
import { SortSelect, LowStockCheckbox } from '@/components/products-toolbar'
import type { Prisma } from '@prisma/commerce-client'

export const dynamic = 'force-dynamic'

const PER_PAGE = 12

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; sort?: string; lowStock?: string; page?: string }>
}) {
  const { category, q, sort, lowStock, page } = await searchParams
  const lang = await getLang()
  const categories = await getCategories()
  const currentPage = Math.max(1, Number(page) || 1)

  const where: Prisma.ProductWhereInput = {}
  if (category) where.category = { slug: category }
  if (q) {
    where.OR = [
      { nameEn: { contains: q } },
      { nameTl: { contains: q } },
      { descriptionEn: { contains: q } },
      { descriptionTl: { contains: q } },
    ]
  }
  if (lowStock === 'true') where.inventory = { lte: 5 }

  let orderBy: Record<string, string>
  switch (sort) {
    case 'price_asc':
      orderBy = { price: 'asc' }
      break
    case 'price_desc':
      orderBy = { price: 'desc' }
      break
    default:
      orderBy = { createdAt: 'desc' }
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: where as Prisma.ProductWhereInput,
      include: { category: true },
      orderBy,
      skip: (currentPage - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.product.count({ where: where as Prisma.ProductWhereInput }),
  ])

  const totalPages = Math.ceil(total / PER_PAGE)

  const buildQueryString = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (q) params.set('q', q)
    if (sort) params.set('sort', sort)
    if (lowStock === 'true') params.set('lowStock', 'true')
    Object.entries(overrides).forEach(([k, v]) => {
      if (v) params.set(k, v)
      else params.delete(k)
    })
    const s = params.toString()
    return s ? `/products?${s}` : '/products'
  }

  const searchParamsStr = (() => {
    const p = new URLSearchParams()
    if (category) p.set('category', category)
    if (q) p.set('q', q)
    if (sort) p.set('sort', sort)
    if (lowStock === 'true') p.set('lowStock', 'true')
    return p.toString()
  })()

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-baseline justify-between">
        <h1 className="font-[var(--font-display)] text-3xl font-bold">{t(lang, 'products.title')}</h1>
        <span className="text-sm text-muted">{total} {t(lang, 'products.items')}</span>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          <Link
            href={buildQueryString({ page: '1', category: undefined })}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              !category && !q && !lowStock
                ? 'bg-flag-blue text-white'
                : 'border border-subtle text-muted hover:border-subtle hover:text-foreground'
            }`}
          >
            {t(lang, 'products.all')}
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={buildQueryString({ category: cat.slug, page: '1' })}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                category === cat.slug
                  ? 'bg-flag-blue text-white'
                  : 'border border-subtle text-muted hover:border-subtle hover:text-foreground'
              }`}
            >
              {lang === 'tl' ? cat.nameTl : cat.nameEn}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <SortSelect lang={lang} sort={sort} searchParams={searchParamsStr} />
          <LowStockCheckbox lang={lang} lowStock={lowStock} searchParams={searchParamsStr} />
        </div>
      </div>

      {/* Search info */}
      {q && (
        <p className="mt-4 text-sm text-muted">
          {lang === 'tl'
            ? `Naghanap ka ng "${q}" — ${total} ${total === 1 ? 'ang natagpuan' : 'ang natagpuan'}`
            : `Search results for "${q}" — ${total} ${total === 1 ? 'found' : 'found'}`}
        </p>
      )}

      {/* Product grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link
            key={product.slug}
            href={`/products/${product.slug}`}
            className="group overflow-hidden rounded-xl border border-subtle bg-surface p-4 transition-all hover:border-flag-blue/30 hover:shadow-md dark:border-subtle dark:bg-surface"
          >
            <div className="aspect-square overflow-hidden rounded-lg bg-surface dark:bg-surface">
              <img
                src={product.image}
                alt={lang === 'tl' ? product.nameTl : product.nameEn}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="mt-4">
              <span className="text-xs font-medium uppercase tracking-wider text-muted">
                {lang === 'tl' ? product.category.nameTl : product.category.nameEn}
              </span>
              <h2 className="mt-1 font-semibold">
                {lang === 'tl' ? product.nameTl : product.nameEn}
              </h2>
              <p className="text-xs text-muted">{lang === 'tl' ? product.nameEn : product.nameTl}</p>
              <p className="mt-1 text-sm text-muted line-clamp-2">{lang === 'tl' ? product.descriptionTl : product.descriptionEn}</p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-lg font-bold">₱{(product.price / 100).toFixed(2)}</p>
                <span className={`text-xs font-medium ${product.inventory > 0 ? 'text-leafy-green' : 'text-flag-red'}`}>
                  {product.inventory > 0 ? `${product.inventory} ${lang === 'tl' ? 'sa stock' : 'in stock'}` : t(lang, 'products.outOfStock')}
                </span>
              </div>
              {product.inventory > 0 && product.inventory <= 5 && (
                <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-flag-red">
                  {t(lang, 'products.lowStock')}
                </p>
              )}
            </div>
          </Link>
        ))}
        {products.length === 0 && (
          <p className="col-span-full py-12 text-center text-muted">
            {q ? t(lang, 'products.noResults') : t(lang, 'products.noCategory')}
          </p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          {currentPage > 1 && (
            <Link
              href={buildQueryString({ page: String(currentPage - 1) })}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-subtle px-4 text-sm font-medium text-muted transition-colors hover:border-flag-blue/30 hover:text-foreground"
            >
              &larr; {lang === 'tl' ? 'Nauna' : 'Previous'}
            </Link>
          )}
          <span className="text-sm text-muted">
            {lang === 'tl' ? 'Pahina' : 'Page'} {currentPage} {lang === 'tl' ? 'ng' : 'of'} {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link
              href={buildQueryString({ page: String(currentPage + 1) })}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-subtle px-4 text-sm font-medium text-muted transition-colors hover:border-flag-blue/30 hover:text-foreground"
            >
              {lang === 'tl' ? 'Susunod' : 'Next'} &rarr;
            </Link>
          )}
        </div>
      )}
    </div>
  )
}