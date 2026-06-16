export const ArticleStatus = {
  DRAFT: 'DRAFT',
  PENDING_REVIEW: 'PENDING_REVIEW',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const

export type ArticleStatus = (typeof ArticleStatus)[keyof typeof ArticleStatus]

export const MediaFormat = {
  WRITING: 'WRITING',
  DRAWING: 'DRAWING',
  VIDEO: 'VIDEO',
  AUDIO: 'AUDIO',
} as const

export type MediaFormat = (typeof MediaFormat)[keyof typeof MediaFormat]

export const AuthorRole = {
  AUTHOR: 'AUTHOR',
  ADMIN: 'ADMIN',
} as const

export type AuthorRole = (typeof AuthorRole)[keyof typeof AuthorRole]
