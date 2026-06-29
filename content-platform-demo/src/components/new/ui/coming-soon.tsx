'use client'

import { useState } from 'react'
import { toast } from 'sonner'

interface ComingSoonProps {
  children: React.ReactNode
  label?: string
  className?: string
}

export function ComingSoon({ children, label = 'Coming soon', className = '' }: ComingSoonProps) {
  const [clicked, setClicked] = useState(false)

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        if (!clicked) {
          setClicked(true)
          toast(label, {
            description: 'This feature is on its way.',
          })
        }
      }}
      className={className}
    >
      {children}
    </button>
  )
}
