import type { ArticleStatus, MediaFormat, AuthorRole } from './enums'

export interface AuthorResponse {
  id: string
  name: string
  email: string
  role: AuthorRole
  image: string | null
}

export interface ArticleSummary {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  image: string | null
  format: MediaFormat
  aiFreeDeclaration: boolean
  provenanceStatus: string
  provenanceNote: string | null
  readingTime: number
  status: ArticleStatus
  publishAt: string | null
  createdAt: string
  likes: number
  authorId: string
  authorName: string
  categoryId: string
  categoryName: string
  commentCount: number
}

export interface ArticleDetail extends ArticleSummary {
  tags: { id: string; name: string }[]
  authorRole: string
  authorArticleCount: number
  relatedArticles: { title: string; slug: string; readingTime: number; commentCount: number }[]
  jsonLd: Record<string, unknown>
  versions?: { version: number; title: string; changeNote: string | null; createdAt: string }[]
}

export interface CommentResponse {
  id: string
  authorName: string
  body: string
  createdAt: string
}

export interface CategoryResponse {
  id: string
  slug: string
  name: string
  _count?: { articles: number }
}

export interface TagResponse {
  id: string
  name: string
}

export interface AdminStatsResponse {
  totalArticles: number
  publishedArticles: number
  draftArticles: number
  pendingReview: number
  archivedArticles: number
  totalAuthors: number
  totalCategories: number
  totalTags: number
  totalComments: number
  categories: { slug: string; name: string; _count: { articles: number } }[]
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: AuthorResponse
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface CreateArticleRequest {
  title: string
  content: string
  excerpt?: string
  image?: string
  categoryId: string
  tags?: string[]
  format: MediaFormat
  aiFreeDeclaration: boolean
  metaTitle?: string
  metaDescription?: string
  canonicalUrl?: string
}

export interface UpdateArticleRequest extends Partial<CreateArticleRequest> {
  slug?: string
  status?: ArticleStatus
}

export interface TransitionRequest {
  action: 'submit' | 'approve' | 'reject' | 'archive' | 'restore'
}

export interface SearchResult {
  id: string
  title: string
  slug: string
  excerpt: string | null
  authorName: string
  categoryName: string
  readingTime: number
  image: string | null
  format: MediaFormat
  aiFreeDeclaration: boolean
  publishAt: string | null
}

export interface ArticleVersionResponse {
  id: string
  title: string
  content: string
  changeNote: string | null
  mediaUrl: string | null
  createdAt: string
  version: number
}

export interface ApiError {
  error: string
  message: string
}
