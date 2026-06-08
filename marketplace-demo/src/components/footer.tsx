import Link from 'next/link'
import { Leaf, Facebook, Instagram } from 'lucide-react'

const footerLinks = {
  about: [
    { label: 'About Likha', href: '/about' },
    { label: 'Our Makers', href: '/listings' },
    { label: 'Press', href: '/about' },
    { label: 'Careers', href: '/about' },
  ],
  browse: [
    { label: 'All Categories', href: '/listings' },
    { label: 'Featured', href: '/listings' },
    { label: 'New Arrivals', href: '/listings' },
    { label: 'Service Bookings', href: '/listings' },
  ],
  support: [
    { label: 'Help Center', href: '/about' },
    { label: 'Shipping & Delivery', href: '/about' },
    { label: 'Returns & Refunds', href: '/about' },
    { label: 'Contact Us', href: '/about' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/privacy' },
    { label: 'Vendor Agreement', href: '/terms' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-100/50 dark:border-neutral-800 dark:bg-neutral-900/50">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-5">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500 text-white shadow-warm-sm">
                <Leaf className="h-5 w-5" strokeWidth={2.25} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-lg tracking-tight text-neutral-800 dark:text-neutral-100">
                  Likha
                </span>
                <span className="text-[10px] uppercase tracking-widest text-primary-600 dark:text-primary-400 font-medium mt-0.5">
                  Filipino Craft
                </span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              A multi-vendor marketplace for authentic Filipino artisan goods. Handmade with care, shipped from the islands.
            </p>
            <div className="mt-6 flex gap-2">
              <SocialLink href="https://facebook.com" label="Facebook">
                <Facebook className="h-4 w-4" />
              </SocialLink>
              <SocialLink href="https://instagram.com" label="Instagram">
                <Instagram className="h-4 w-4" />
              </SocialLink>
            </div>
          </div>

          {/* Link columns */}
          <FooterColumn title="About" links={footerLinks.about} />
          <FooterColumn title="Browse" links={footerLinks.browse} />
          <FooterColumn title="Support" links={footerLinks.support} />
          <FooterColumn title="Legal" links={footerLinks.legal} />
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-neutral-200 pt-8 text-sm text-neutral-600 dark:text-neutral-300 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Likha Marketplace. Made with care in the Philippines.</p>
          <p className="text-xs">Demo portfolio project — not a real store.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-primary-700 dark:hover:bg-primary-900/30 dark:hover:text-primary-400 transition-colors"
    >
      {children}
    </a>
  )
}
