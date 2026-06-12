'use client'

import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  variant,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
  variant?: 'danger' | 'warning'
}) {
  const confirmClass =
    variant === 'danger'
      ? 'bg-danger text-white hover:bg-red-600'
      : 'bg-primary text-white hover:bg-primary-hover'

  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <AlertDialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-6 shadow-xl dark:border-border-dark dark:bg-card-dark">
          <AlertDialogPrimitive.Title className="text-base font-bold text-text-primary dark:text-slate-100">
            {title}
          </AlertDialogPrimitive.Title>
          <AlertDialogPrimitive.Description className="mt-2 text-sm text-text-secondary">
            {description}
          </AlertDialogPrimitive.Description>
          <div className="mt-5 flex justify-end gap-2">
            <AlertDialogPrimitive.Cancel className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-text-secondary hover:bg-slate-50 dark:border-border-dark dark:hover:bg-slate-700">
              Cancel
            </AlertDialogPrimitive.Cancel>
            <AlertDialogPrimitive.Action
              onClick={onConfirm}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${confirmClass}`}
            >
              {confirmLabel}
            </AlertDialogPrimitive.Action>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  )
}
