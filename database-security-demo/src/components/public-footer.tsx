import Link from 'next/link'

export function PublicFooter() {
  return (
    <footer className="border-t border-isla-border py-10 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xs text-isla-muted uppercase tracking-wider mb-3">Product</h3>
            <ul className="space-y-2">
              <li><Link href="/security" className="text-sm text-isla-white hover:text-isla-pacific transition-colors">Security</Link></li>
              <li><Link href="/architecture" className="text-sm text-isla-white hover:text-isla-pacific transition-colors">Architecture</Link></li>
              <li><Link href="/demo" className="text-sm text-isla-white hover:text-isla-pacific transition-colors">Demo</Link></li>
              <li><Link href="/case-study" className="text-sm text-isla-white hover:text-isla-pacific transition-colors">Case Study</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs text-isla-muted uppercase tracking-wider mb-3">Trust</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-isla-white hover:text-isla-pacific transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="text-sm text-isla-white hover:text-isla-pacific transition-colors">Terms</Link></li>
              <li><Link href="/disclaimer" className="text-sm text-isla-white hover:text-isla-pacific transition-colors">Disclaimer</Link></li>
              <li><Link href="/security-policy" className="text-sm text-isla-white hover:text-isla-pacific transition-colors">Security Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs text-isla-muted uppercase tracking-wider mb-3">Project</h3>
            <ul className="space-y-2">
              <li><a href="https://github.com/jaostudio/jao-demo-database-security" target="_blank" rel="noopener noreferrer" className="text-sm text-isla-white hover:text-isla-pacific transition-colors">GitHub</a></li>
              <li><a href="https://jao-demo-security.vercel.app" target="_blank" rel="noopener noreferrer" className="text-sm text-isla-white hover:text-isla-pacific transition-colors">Live Demo</a></li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-xs text-isla-muted uppercase tracking-wider mb-3">About</h3>
            <p className="text-sm text-isla-muted leading-relaxed">
              IslaVault is a fictional security demo built with care by{' '}
              <a href="https://jaostudio.vercel.app" target="_blank" rel="noopener noreferrer" className="text-isla-pacific hover:underline">JAOstudio</a>.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-isla-border/50 text-center">
          <p className="text-xs text-isla-muted/60">
            IslaVault is a fictional portfolio project. It is not a real company, government system, healthcare provider, bank, or compliance-certified product.
          </p>
        </div>
      </div>
    </footer>
  )
}
