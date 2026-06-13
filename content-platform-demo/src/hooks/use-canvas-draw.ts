'use client'

import { useRef, useCallback, useState, useEffect } from 'react'

interface UseCanvasDrawOptions {
  width?: number
  height?: number
  brushColor?: string
  brushSize?: number
}

export function useCanvasDraw(options: UseCanvasDrawOptions = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [brushColor, setBrushColor] = useState(options.brushColor ?? '#0D9488')
  const [brushSize, setBrushSize] = useState(options.brushSize ?? 4)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const isEraserRef = useRef(false)
  const [eraserMode, setEraserMode] = useState(false)
  const lastPoint = useRef<{ x: number; y: number } | null>(null)

  const width = options.width ?? 400
  const height = options.height ?? 400

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, width, height)
  }, [width, height])

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const startDrawing = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const pos = getPos(e)
    lastPoint.current = pos
    setIsDrawing(true)
    setHasDrawn(true)

    ctx.beginPath()
    ctx.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2)
    ctx.fillStyle = isEraserRef.current ? '#FFFFFF' : brushColor
    ctx.fill()
  }, [brushColor, brushSize])

  const draw = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const pos = getPos(e)
    if (!lastPoint.current) {
      lastPoint.current = pos
      return
    }

    ctx.beginPath()
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = isEraserRef.current ? '#FFFFFF' : brushColor
    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()

    lastPoint.current = pos
  }, [isDrawing, brushColor, brushSize])

  const stopDrawing = useCallback(() => {
    setIsDrawing(false)
    lastPoint.current = null
  }, [])

  const undo = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, width, height)
    setHasDrawn(false)
  }, [width, height])

  const clear = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, width, height)
    setHasDrawn(false)
  }, [width, height])

  const toDataURL = useCallback((type = 'image/png', quality?: number): string => {
    return canvasRef.current?.toDataURL(type, quality) ?? ''
  }, [])

  const toggleEraser = useCallback(() => {
    isEraserRef.current = !isEraserRef.current
    setEraserMode(isEraserRef.current)
  }, [])

  return {
    canvasRef,
    brushColor,
    setBrushColor,
    brushSize,
    setBrushSize,
    isDrawing,
    hasDrawn,
    startDrawing,
    draw,
    stopDrawing,
    undo,
    clear,
    toDataURL,
    toggleEraser,
    eraserMode,
    width,
    height,
  }
}
