'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border pt-8 pb-6">
      <div className="container-likha flex flex-col items-center gap-3 text-center">
        <p className="text-[13px] leading-relaxed text-faint max-w-lg">
          Built with care by <span className="font-medium text-muted">JAOstudio</span> — a portfolio demo of a process-first creative publishing platform.
        </p>
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-[12px]">
          <Link href="/case-study" className="text-faint hover:text-muted transition-colors">Case Study</Link>
          <Link href="/architecture" className="text-faint hover:text-muted transition-colors">Architecture</Link>
          <Link href="/privacy" className="text-faint hover:text-muted transition-colors">Privacy</Link>
          <Link href="/terms" className="text-faint hover:text-muted transition-colors">Terms</Link>
          <Link href="/disclaimer" className="text-faint hover:text-muted transition-colors">Disclaimer</Link>
          <Link href="/security-policy" className="text-faint hover:text-muted transition-colors">Security</Link>
        </nav>
        <p className="text-[11px] text-faint/60">&copy; {new Date().getFullYear()} JAOstudio. Likha is a fictional demo.</p>
      </div>
    </footer>
  )
}
