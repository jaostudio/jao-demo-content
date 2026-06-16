'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001'

async function getAuthHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies()
  const token = cookieStore.get('likha-token')?.value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function fetchBackend(path: string, options: RequestInit = {}): Promise<Response> {
  const headers = await getAuthHeaders()
  return fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...headers, ...options.headers },
  })
}

export async function createArticle(_prevState: { error?: string } | null, formData: FormData) {
  const payload: Record<string, unknown> = {
    title: formData.get('title'),
    format: formData.get('format') || 'WRITING',
    content: formData.get('content') || '',
    imageUrl: formData.get('imageUrl') || null,
    aiFreeDeclaration: formData.get('aiFreeDeclaration') === 'true',
    excerpt: formData.get('excerpt') || null,
    categoryId: formData.get('categoryId'),
    tagIds: formData.getAll('tagIds'),
  }

  const res = await fetchBackend('/api/articles', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to create article' }))
    return { error: err.message ?? 'Failed to create article' }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  redirect('/admin')
}

export async function updateArticle(id: string, _prevState: { error?: string } | null, formData: FormData) {
  const payload: Record<string, unknown> = {
    title: formData.get('title'),
    format: formData.get('format') || 'WRITING',
    content: formData.get('content') || '',
    imageUrl: formData.get('imageUrl') || null,
    aiFreeDeclaration: formData.get('aiFreeDeclaration') === 'true',
    excerpt: formData.get('excerpt') || null,
    categoryId: formData.get('categoryId'),
    tags: formData.getAll('tagIds'),
  }

  const res = await fetchBackend(`/api/articles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to update article' }))
    return { error: err.message ?? 'Failed to update article' }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  redirect('/admin')
}
