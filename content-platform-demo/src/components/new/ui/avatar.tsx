import type { HTMLAttributes } from 'react'

type Size = 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  name: string
  size?: Size
  color?: string
}

const sizeClasses: Record<Size, string> = {
  sm: 'avatar avatar-sm',
  md: 'avatar avatar-md',
  lg: 'avatar avatar-lg',
  xl: 'avatar avatar-xl',
}

const avatarColors = [
  'bg-primary', 'bg-secondary', 'bg-accent',
  'bg-violet-500', 'bg-amber-600', 'bg-emerald-600',
  'bg-rose-500', 'bg-sky-600',
]

export function Avatar({ name, size = 'md', color, className = '', ...props }: AvatarProps) {
  const bgColor = color || avatarColors[name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % avatarColors.length]
  const initial = name.charAt(0).toUpperCase()

  return (
    <div className={`${sizeClasses[size]} ${bgColor} ${className}`} title={name} {...props}>
      {initial}
    </div>
  )
}
