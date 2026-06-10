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
      ? 'bg-coral-400 text-black border-black hover:bg-coral-500 dark:border-white'
      : 'bg-black text-saffron-500 border-black hover:nb-shadow dark:border-white dark:bg-white dark:text-black'

  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <AlertDialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 border-2 border-black bg-cream p-6 nb-shadow-lg dark:border-white dark:bg-[#1A1A1A]">
          <AlertDialogPrimitive.Title className="font-display text-lg font-bold">
            {title}
          </AlertDialogPrimitive.Title>
          <AlertDialogPrimitive.Description className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            {description}
          </AlertDialogPrimitive.Description>
          <div className="mt-6 flex justify-end gap-3">
            <AlertDialogPrimitive.Cancel className="rounded-none border-2 border-black px-4 py-2 text-sm font-bold hover:bg-black/5 dark:border-white dark:hover:bg-white/5">
              Cancel
            </AlertDialogPrimitive.Cancel>
            <AlertDialogPrimitive.Action
              onClick={onConfirm}
              className={`rounded-none border-2 px-4 py-2 text-sm font-bold ${confirmClass}`}
            >
              {confirmLabel}
            </AlertDialogPrimitive.Action>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  )
}
