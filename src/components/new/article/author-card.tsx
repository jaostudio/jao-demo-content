import { Card } from '../ui/card'
import { Avatar } from '../ui/avatar'

interface AuthorCardProps {
  name: string
  role?: string
  articleCount?: number
}

export function AuthorCard({ name, role, articleCount }: AuthorCardProps) {
  return (
    <Card className="p-4 flex items-center gap-3">
      <Avatar name={name} size="lg" />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-text-primary">{name}</p>
        {role && <p className="text-xs text-text-muted">{role}</p>}
        {articleCount !== undefined && (
          <p className="text-[11px] text-text-muted mt-0.5">{articleCount} articles written</p>
        )}
      </div>
    </Card>
  )
}
