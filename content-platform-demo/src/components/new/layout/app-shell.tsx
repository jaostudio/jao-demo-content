import { LeftRail } from './left-rail'
import { Footer } from './footer'

interface AppShellProps {
  children: React.ReactNode
  rightPanel?: React.ReactNode
  hideFooter?: boolean
}

export function AppShell({ children, rightPanel, hideFooter }: AppShellProps) {
  return (
    <div className="min-h-dvh bg-surface dark:bg-surface-dark">
      <LeftRail />
      <div className="mx-auto grid min-h-dvh w-full max-w-[1040px] grid-cols-1 gap-6 px-4 pb-24 pt-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:pl-[68px] lg:pr-4">
        <main className="min-w-0">{children}</main>
        {rightPanel && (
          <aside className="hidden min-w-0 lg:block">{rightPanel}</aside>
        )}
      </div>
      {!hideFooter && <Footer />}
    </div>
  )
}
