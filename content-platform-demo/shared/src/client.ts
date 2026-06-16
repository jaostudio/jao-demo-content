import type {
  ArticleSummary,
  ArticleDetail,
  ArticleVersionResponse,
  CommentResponse,
  CategoryResponse,
  TagResponse,
  AdminStatsResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  CreateArticleRequest,
  UpdateArticleRequest,
  TransitionRequest,
  SearchResult,
  ApiError,
} from './types'

export class ApiClient {
  private baseUrl: string
  private token: string | null

  constructor(baseUrl = '', token: string | null = null) {
    this.baseUrl = baseUrl
    this.token = token
  }

  withToken(token: string | null): ApiClient {
    return new ApiClient(this.baseUrl, token)
  }

  private async request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    })

    if (!res.ok) {
      const err: ApiError = await res.json().catch(() => ({
        error: 'UNKNOWN',
        message: `Request failed with status ${res.status}`,
      }))
      throw new Error(err.message)
    }

    return res.json()
  }

  // Auth
  login(data: LoginRequest): Promise<LoginResponse> {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  register(data: RegisterRequest): Promise<{ token: string; user: { id: string; name: string; email: string; role: string } }> {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  getMe(): Promise<{ id: string; name: string; email: string; role: string }> {
    return this.request('/api/auth/me')
  }

  // Articles
  getArticles(): Promise<ArticleSummary[]> {
    return this.request('/api/articles')
  }

  getArticle(slug: string): Promise<ArticleDetail> {
    return this.request(`/api/articles/${slug}`)
  }

  createArticle(data: CreateArticleRequest): Promise<ArticleDetail> {
    return this.request('/api/articles', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  updateArticle(id: string, data: UpdateArticleRequest): Promise<ArticleDetail> {
    return this.request(`/api/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  deleteArticle(id: string): Promise<void> {
    return this.request(`/api/articles/${id}`, {
      method: 'DELETE',
    })
  }

  transitionArticle(id: string, data: TransitionRequest): Promise<ArticleDetail> {
    return this.request(`/api/articles/${id}/transition`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  getArticleVersions(id: string): Promise<ArticleVersionResponse[]> {
    return this.request(`/api/articles/${id}/versions`)
  }

  // Comments
  getComments(articleId: string): Promise<CommentResponse[]> {
    return this.request(`/api/articles/${articleId}/comments`)
  }

  addComment(articleId: string, body: string): Promise<CommentResponse> {
    return this.request(`/api/articles/${articleId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ body }),
    })
  }

  // Likes
  likeArticle(articleId: string, action: 'like' | 'unlike'): Promise<{ likes: number }> {
    return this.request(`/api/articles/${articleId}/like`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    })
  }

  // Categories
  getCategories(): Promise<CategoryResponse[]> {
    return this.request('/api/categories')
  }

  // Search
  search(query: string): Promise<SearchResult[]> {
    return this.request(`/api/search?q=${encodeURIComponent(query)}`)
  }

  // Trending
  getTrending(): Promise<ArticleSummary[]> {
    return this.request('/api/trending')
  }

  // Admin
  getAdminArticles(): Promise<ArticleSummary[]> {
    return this.request('/api/admin/articles')
  }

  getAdminStats(): Promise<AdminStatsResponse> {
    return this.request('/api/admin/stats')
  }
}
