'use client'

import { useCanvasDraw } from '@/hooks/use-canvas-draw'
import { BrushToolbar } from './brush-toolbar'

interface CanvasEditorProps {
  onSave: (dataUrl: string) => void
  width?: number
  height?: number
}

export function CanvasEditor({ onSave, width = 400, height = 400 }: CanvasEditorProps) {
  const {
    canvasRef,
    brushColor, setBrushColor,
    brushSize, setBrushSize,
    startDrawing, draw, stopDrawing,
    undo, clear, hasDrawn, toDataURL,
    toggleEraser, eraserMode,
  } = useCanvasDraw({ width, height })

  function handleSave() {
    const dataUrl = toDataURL()
    if (dataUrl) onSave(dataUrl)
  }

  return (
    <div className="space-y-3">
      <BrushToolbar
        brushColor={brushColor}
        onColorChange={setBrushColor}
        brushSize={brushSize}
        onSizeChange={setBrushSize}
        isEraser={eraserMode}
        onToggleEraser={toggleEraser}
        onUndo={undo}
        onClear={clear}
        hasDrawn={hasDrawn}
      />

      <div className="flex items-center justify-center rounded-lg border border-border bg-card p-2">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
          className="touch-none cursor-crosshair rounded"
          style={{ width, height }}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasDrawn}
          className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-30"
        >
          Set as Thumbnail
        </button>
      </div>
    </div>
  )
}
