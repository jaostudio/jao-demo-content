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
      <div className="mb-4 flex h-16 w-16 animate-float items-center justify-center border-2 border-black bg-saffron-100 dark:border-white dark:bg-saffron-900/30">
        <FileText className="h-8 w-8 text-saffron-600 dark:text-saffron-400" />
      </div>
      <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">{message}</p>
      {submessage && (
        <p className="mt-1 text-xs text-neutral-400">{submessage}</p>
      )}
    </div>
  )
}
