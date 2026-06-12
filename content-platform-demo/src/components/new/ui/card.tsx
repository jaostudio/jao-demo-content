import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  noise?: boolean
}

export function Card({ noise = true, className = '', children, ...props }: CardProps) {
  return (
    <div className={`kard ${noise ? 'kard-noise' : ''} ${className}`} {...props}>
      {children}
    </div>
  )
}
