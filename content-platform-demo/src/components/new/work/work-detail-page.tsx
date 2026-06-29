import type { ArticleDetail, ArticleVersionResponse } from '@content-platform/shared'
import { AppShell } from '@/components/new/layout/app-shell'
import { RightPanel } from '@/components/new/layout/right-panel'
import { ProvenanceBadge } from '@/components/provenance-badge'
import { ProcessTimeline } from '@/components/process-timeline'
import { CommentSection } from '@/components/comment-section'
import { ScrollProgress } from '@/components/new/motion/scroll-progress'
import { Avatar } from '@/components/new/ui/avatar'

interface WorkDetailPageProps {
  article: ArticleDetail
  versions: ArticleVersionResponse[]
  comments: { id: string; authorName: string; body: string; createdAt: string }[]
}

export function WorkDetailPage({ article, versions, comments }: WorkDetailPageProps) {
  return (
    <>
      <ScrollProgress />
      <AppShell
        rightPanel={
          <div className="space-y-4">
            {/* Author card */}
            <div className="kard p-4">
              <div className="flex items-center gap-3">
                <Avatar name={article.authorName} size="lg" />
                <div>
                  <p className="text-[14px] font-medium text-text-primary">{article.authorName}</p>
                  <p className="text-[12px] text-fog-gray">{article.authorRole}</p>
                  <p className="text-[11px] text-ash">{article.authorArticleCount} works</p>
                </div>
              </div>
            </div>

            {/* Provenance */}
            {article.provenanceStatus && article.provenanceStatus !== 'UNDECLARED' && (
              <div className="kard p-4">
                <p className="text-[11px] uppercase tracking-wider text-fog-gray mb-2">Provenance</p>
                <ProvenanceBadge status={article.provenanceStatus} />
                {article.provenanceNote && (
                  <p className="mt-2 text-[13px] text-text-body">{article.provenanceNote}</p>
                )}
              </div>
            )}

            {/* Related Works */}
            {article.relatedArticles && article.relatedArticles.length > 0 && (
              <div className="kard p-4">
                <p className="text-[11px] uppercase tracking-wider text-fog-gray mb-2">Related Works</p>
                <div className="space-y-2">
                  {article.relatedArticles.map((r: { slug: string; title: string }) => (
                    <a key={r.slug} href={`/work/${r.slug}`} className="block text-[13px] text-text-primary hover:text-reactor-green transition-colors">
                      {r.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        }
      >
        <article className="max-w-[640px]">
          {/* Hero Image */}
          {article.image && (
            <div className="studio-frame mb-8 overflow-hidden rounded-xl border border-hairline bg-surface-dark">
              <img
                src={article.image}
                alt={`${article.title} artwork`}
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
          )}

          {/* Header */}
          <div className="studio-frame mb-8 rounded-xl border border-hairline bg-surface p-6">
            <p className="text-[11px] uppercase tracking-[0.2em] text-fog-gray mb-3">{article.categoryName}</p>
            <h1 className="text-[26px] font-semibold text-text-primary leading-tight tracking-[-0.03em]">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="mt-3 text-[15px] text-graphite leading-relaxed">{article.excerpt}</p>
            )}
            <div className="mt-4 flex items-center gap-3 text-[13px] text-fog-gray">
              <span className="font-medium text-text-primary">{article.authorName}</span>
              <span className="text-ash">&middot;</span>
              {article.publishAt && <span>{new Date(article.publishAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>}
              <span className="text-ash">&middot;</span>
              <span>{article.readingTime} min read</span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-fog-gray px-2 py-0.5 rounded border border-hairline">
                {article.categoryName}
              </span>
              {article.aiFreeDeclaration && <ProvenanceBadge status="DECLARED_HUMAN_MADE" />}
              {article.provenanceStatus && article.provenanceStatus !== 'UNDECLARED' && article.provenanceStatus !== 'DECLARED_HUMAN_MADE' && (
                <ProvenanceBadge status={article.provenanceStatus} />
              )}
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-sm max-w-none">
            {article.content.split('\n').map((line: string, i: number) => line.trim() ? (
              <p key={i} className="text-[15px] text-text-body leading-relaxed mb-3">{line}</p>
            ) : null)}
          </div>

          {/* Process Timeline */}
          {versions.length > 0 && (
            <div className="mt-12 pt-8 border-t border-hairline">
              <ProcessTimeline entries={versions.map((v: ArticleVersionResponse) => ({ version: v.version, title: v.title, changeNote: v.changeNote ?? null, createdAt: v.createdAt, mediaUrl: v.mediaUrl ?? null }))} />
            </div>
          )}

          {/* Comments */}
          <div id="comments" className="mt-12 pt-8 border-t border-hairline">
            <CommentSection
              articleId={article.id}
              initialComments={comments.map((c) => ({
                id: c.id,
                authorName: c.authorName,
                body: c.body,
                createdAt: c.createdAt,
              }))}
            />
          </div>
        </article>
      </AppShell>
    </>
  )
}
