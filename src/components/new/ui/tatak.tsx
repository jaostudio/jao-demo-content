import type { HTMLAttributes } from 'react'

type Status = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'ARCHIVED'

interface TatakProps extends HTMLAttributes<HTMLSpanElement> {
  status: Status
  label?: string
}

const statusStyles: Record<Status, string> = {
  DRAFT: 'tatak tatak-draft',
  PENDING_REVIEW: 'tatak tatak-pending',
  PUBLISHED: 'tatak tatak-published',
  ARCHIVED: 'tatak tatak-archived',
}

const statusLabels: Record<Status, string> = {
  DRAFT: 'Draft',
  PENDING_REVIEW: 'For Review',
  PUBLISHED: 'Published',
  ARCHIVED: 'Archived',
}

export function Tatak({ status, label, className = '', ...props }: TatakProps) {
  return (
    <span className={`${statusStyles[status]} ${className}`} {...props}>
      {label || statusLabels[status]}
    </span>
  )
}
