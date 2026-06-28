'use client'

import { useRef } from 'react'

interface MarqueeProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

export function Marquee({ children, speed = 30, className = '' }: MarqueeProps) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        ref={ref}
        className="flex gap-4"
        style={{
          animation: `marquee-scroll ${speed}s linear infinite`,
          width: 'max-content',
        }}
        onMouseEnter={() => { if (ref.current) ref.current.style.animationPlayState = 'paused' }}
        onMouseLeave={() => { if (ref.current) ref.current.style.animationPlayState = 'running' }}
      >
        {children}
        {children}
      </div>
      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
