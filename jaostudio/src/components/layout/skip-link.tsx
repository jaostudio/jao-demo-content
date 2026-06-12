export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="fixed left-4 top-4 z-[9999] -translate-y-full rounded-xl bg-text-primary px-4 py-3 text-base font-medium text-background opacity-0 transition-[opacity,transform] focus-visible:translate-y-0 focus-visible:opacity-100 focus-visible:outline-none"
    >
      Skip to content
    </a>
  )
}
