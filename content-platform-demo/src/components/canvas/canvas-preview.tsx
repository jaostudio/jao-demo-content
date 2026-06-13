interface CanvasPreviewProps {
  imageUrl: string
  title: string
}

export function CanvasPreview({ imageUrl, title }: CanvasPreviewProps) {
  if (!imageUrl) {
    return (
      <div className="flex items-center justify-center rounded-lg bg-surface-alt py-16 text-text-muted">
        <p className="text-sm">No drawing available</p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={title}
        className="max-w-full rounded-lg shadow-md"
      />
    </div>
  )
}
