export function canViewArticle(params: {
  article: { status: string; authorId: string }
  user?: { id: string; role: string } | null
}) {
  if (params.article.status === 'PUBLISHED') return true
  if (!params.user) return false
  if (params.user.role === 'ADMIN') return true
  return params.article.authorId === params.user.id
}

export function canEngageWithArticle(article: { status: string }) {
  return article.status === 'PUBLISHED'
}
