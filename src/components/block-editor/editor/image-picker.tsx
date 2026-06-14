import Image from 'next/image'

interface ImagePickerProps {
  src: string
  alt: string
  onSrcChange: (src: string) => void
  onAltChange: (alt: string) => void
}

export function ImagePicker({ src, alt, onSrcChange, onAltChange }: ImagePickerProps) {
  return (
    <div className="space-y-2">
      {src ? (
        <div className="relative overflow-hidden rounded-lg">
          <Image src={src} alt={alt} width={800} height={450} className="rounded-lg" />
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border bg-surface-alt py-12">
          <p className="text-xs text-text-muted">Enter an image URL above</p>
        </div>
      )}
      <input
        type="url"
        value={src}
        onChange={(e) => onSrcChange(e.target.value)}
        placeholder="https://images.unsplash.com/..."
        className="w-full rounded border border-border bg-card px-3 py-2 text-sm text-text-secondary focus:border-primary focus:outline-none"
      />
      <input
        type="text"
        value={alt}
        onChange={(e) => onAltChange(e.target.value)}
        placeholder="Descriptive alt text for accessibility..."
        className="w-full rounded border border-border bg-card px-3 py-2 text-sm text-text-muted focus:border-primary focus:outline-none"
      />
    </div>
  )
}
