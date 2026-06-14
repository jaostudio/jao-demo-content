import { revalidatePath } from 'next/cache'

export function revalidateArticlePaths(article: {
  slug: string
  category: { slug: string }
}) {
  revalidatePath('/')
  revalidatePath(`/articles/${article.slug}`)
  revalidatePath(`/category/${article.category.slug}`)
  revalidatePath('/admin')
}
