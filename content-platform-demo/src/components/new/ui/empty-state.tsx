import { LikhaLogo } from '@/components/brand/likha-logo'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon ? <div className="mb-4 text-fog-gray">{icon}</div> : (
        <div className="mb-4 opacity-20">
          <LikhaLogo variant="mark" size="md" />
        </div>
      )}
      <p className="text-[14px] font-medium text-text-primary">{title}</p>
      {description && <p className="mt-1 text-[12px] text-ash max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
