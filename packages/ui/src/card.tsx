interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={`rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 ${className ?? ''}`}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: CardProps) {
  return <div className={`mb-4 ${className ?? ''}`}>{children}</div>
}

export function CardTitle({ children, className }: CardProps) {
  return <h3 className={`text-lg font-semibold text-neutral-900 dark:text-neutral-100 ${className ?? ''}`}>{children}</h3>
}

export function CardDescription({ children, className }: CardProps) {
  return <p className={`mt-1 text-sm text-neutral-500 dark:text-neutral-400 ${className ?? ''}`}>{children}</p>
}

export function CardContent({ children, className }: CardProps) {
  return <div className={className ?? ''}>{children}</div>
}
