'use client'

import { Undo2, Eraser, Paintbrush } from 'lucide-react'

interface BrushToolbarProps {
  brushColor: string
  onColorChange: (color: string) => void
  brushSize: number
  onSizeChange: (size: number) => void
  isEraser: boolean
  onToggleEraser: () => void
  onUndo: () => void
  onClear: () => void
  hasDrawn: boolean
}

const COLORS = [
  '#0D9488', '#D4A843', '#E85D75', '#2563EB', '#7C3AED',
  '#DC2626', '#EA580C', '#16A34A', '#6B7280', '#000000',
]

export function BrushToolbar({
  brushColor, onColorChange,
  brushSize, onSizeChange,
  isEraser, onToggleEraser,
  onUndo, onClear, hasDrawn,
}: BrushToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-2">
      {/* Colors */}
      <div className="flex items-center gap-0.5">
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onColorChange(c)}
            className={`h-5 w-5 rounded-full border-2 transition-transform ${
              brushColor === c && !isEraser
                ? 'scale-125 border-text-primary'
                : 'border-transparent'
            }`}
            style={{ backgroundColor: c }}
            aria-label={`Color ${c}`}
          />
        ))}
      </div>

      <div className="h-5 w-px bg-border" />

      {/* Brush size */}
      <div className="flex items-center gap-1">
        <Paintbrush className="h-3 w-3 text-text-muted" />
        <input
          type="range"
          min={1}
          max={20}
          value={brushSize}
          onChange={(e) => onSizeChange(Number(e.target.value))}
          className="w-16 accent-primary"
          aria-label="Brush size"
        />
        <span className="w-4 text-center text-[10px] text-text-muted">{brushSize}</span>
      </div>

      <div className="h-5 w-px bg-border" />

      {/* Eraser */}
      <button
        type="button"
        onClick={onToggleEraser}
        className={`rounded p-1 transition-colors ${
          isEraser ? 'bg-primary text-white' : 'text-text-muted hover:bg-surface-alt'
        }`}
        aria-label="Toggle eraser"
      >
        <Eraser className="h-3.5 w-3.5" />
      </button>

      {/* Undo */}
      <button
        type="button"
        onClick={onUndo}
        disabled={!hasDrawn}
        className="rounded p-1 text-text-muted transition-colors hover:bg-surface-alt disabled:opacity-30"
        aria-label="Clear canvas"
      >
        <Undo2 className="h-3.5 w-3.5" />
      </button>

      {/* Clear */}
      <button
        type="button"
        onClick={onClear}
        disabled={!hasDrawn}
        className="rounded px-2 py-0.5 text-[11px] font-medium text-danger transition-colors hover:bg-danger-light disabled:opacity-30"
      >
        Clear
      </button>
    </div>
  )
}
