import Image from 'next/image'

interface ImageBlockProps {
  props: { src: string; alt: string; caption?: string; width?: number; height?: number }
  onUpdate?: (props: Record<string, unknown>) => void
}

export function ImageBlock({ props, onUpdate }: ImageBlockProps) {
  if (!onUpdate) {
    if (!props.src) return <div className="flex items-center justify-center rounded-lg bg-surface-alt py-12 text-xs text-text-muted">Image placeholder</div>
    return (
      <figure className="my-6">
        <Image src={props.src} alt={props.alt} width={props.width ?? 800} height={props.height ?? 450} className="rounded-lg" />
        {props.caption && <figcaption className="mt-1 text-center text-xs text-text-muted">{props.caption}</figcaption>}
      </figure>
    )
  }

  return (
    <div className="space-y-2">
      {props.src ? (
        <div className="relative overflow-hidden rounded-lg">
          <Image src={props.src} alt={props.alt} width={props.width ?? 800} height={props.height ?? 450} className="rounded-lg" />
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border bg-surface-alt py-12">
          <p className="text-xs text-text-muted">Click to add image URL</p>
        </div>
      )}
      <input
        type="url"
        value={props.src}
        onChange={(e) => onUpdate({ ...props, src: e.target.value })}
        placeholder="Image URL..."
        className="w-full rounded border border-border bg-card px-2 py-1 text-xs text-text-secondary focus:border-primary focus:outline-none"
      />
      <input
        type="text"
        value={props.alt}
        onChange={(e) => onUpdate({ ...props, alt: e.target.value })}
        placeholder="Alt text..."
        className="w-full rounded border border-border bg-card px-2 py-1 text-xs text-text-muted focus:border-primary focus:outline-none"
      />
      <input
        type="text"
        value={props.caption ?? ''}
        onChange={(e) => onUpdate({ ...props, caption: e.target.value })}
        placeholder="Caption (optional)..."
        className="w-full rounded border border-border bg-card px-2 py-1 text-xs text-text-muted focus:border-primary focus:outline-none"
      />
    </div>
  )
}
