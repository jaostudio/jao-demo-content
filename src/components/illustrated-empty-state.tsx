import { FileText } from 'lucide-react'

interface IllustratedEmptyStateProps {
  message?: string
  submessage?: string
}

export function IllustratedEmptyState({
  message = 'Wala pang artikulo dito.',
  submessage = 'Ikaw ba ang unang magsusulat?',
}: IllustratedEmptyStateProps) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-light dark:bg-primary/10">
        <FileText className="h-6 w-6 text-primary" />
      </div>
      <p className="text-sm font-medium text-text-secondary">{message}</p>
      {submessage && (
        <p className="mt-1 text-xs text-text-muted">{submessage}</p>
      )}
    </div>
  )
}
