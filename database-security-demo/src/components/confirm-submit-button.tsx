'use client'

import { useFormStatus } from 'react-dom'

export function ConfirmSubmitButton({ label, confirmMessage, className }: { label: string; confirmMessage: string; className?: string }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(confirmMessage)) {
          e.preventDefault()
        }
      }}
      className={className ?? 'text-xs text-isla-danger hover:underline'}
    >
      {pending ? 'Deleting...' : label}
    </button>
  )
}
