'use client'

import { getPreviewConfig } from './preview-registry'
import { PreviewFrame } from './preview-frame'
import { ScreenshotPreview } from './screenshot-preview'
import type { ProjectMetadata } from '@/types'

interface PreviewRendererProps {
  project: ProjectMetadata
  className?: string
}

export function PreviewRenderer({ project, className }: PreviewRendererProps) {
  const config = getPreviewConfig(project.slug)

  if (config.type === 'iframe' && config.url) {
    return <PreviewFrame url={config.url} title={project.title} className={className} />
  }

  const firstGalleryImage = project.gallery?.[0]
  if (firstGalleryImage) {
    return <ScreenshotPreview src={firstGalleryImage} alt={project.title} className={className} />
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-bg-surface p-8" style={{ minHeight: '16rem' }}>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface-hover">
        <span className="text-lg text-text-tertiary">→</span>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-text-primary">{project.title}</p>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-xs text-text-tertiary transition-colors hover:text-text-primary"
          >
            Open Live Site →
          </a>
        )}
      </div>
    </div>
  )
}
