'use client'

import { useRef, useEffect } from 'react'

interface InlineEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
}

export function InlineEditor({ value, onChange, className, placeholder }: InlineEditorProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isUpdating = useRef(false)

  useEffect(() => {
    if (ref.current && ref.current.innerText !== value && !isUpdating.current) {
      ref.current.innerText = value
    }
  }, [value])

  function handleInput() {
    isUpdating.current = true
    onChange(ref.current?.innerText ?? '')
    isUpdating.current = false
  }

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onBlur={handleInput}
      data-placeholder={placeholder}
      className={`outline-none focus:ring-1 focus:ring-primary rounded px-1 -mx-1 empty:before:text-text-muted empty:before:content-[attr(data-placeholder)] ${className ?? ''}`}
    />
  )
}
