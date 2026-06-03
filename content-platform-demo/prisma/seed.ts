import { PrismaClient } from '@prisma/content-client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import bcrypt from 'bcryptjs'

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? 'file:./dev.db',
})
const prisma = new PrismaClient({ adapter })

async function main() {
  const password = await bcrypt.hash('password123', 10)

  const admin = await prisma.author.upsert({
    where: { email: 'admin@content.dev' },
    update: {},
    create: { name: 'Editor', email: 'admin@content.dev', password, role: 'ADMIN' },
  })

  const author1 = await prisma.author.upsert({
    where: { email: 'sarah@content.dev' },
    update: {},
    create: { name: 'Sarah Chen', email: 'sarah@content.dev', password, role: 'AUTHOR' },
  })

  const author2 = await prisma.author.upsert({
    where: { email: 'marcus@content.dev' },
    update: {},
    create: { name: 'Marcus Rivera', email: 'marcus@content.dev', password, role: 'AUTHOR' },
  })

  const categories = [
    { name: 'Technology', slug: 'technology' },
    { name: 'Design', slug: 'design' },
    { name: 'Business', slug: 'business' },
  ]

  for (const c of categories) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c })
  }

  const tags = [
    { name: 'Next.js', slug: 'nextjs' },
    { name: 'TypeScript', slug: 'typescript' },
    { name: 'Architecture', slug: 'architecture' },
    { name: 'Performance', slug: 'performance' },
    { name: 'CSS', slug: 'css' },
  ]

  for (const t of tags) {
    await prisma.tag.upsert({ where: { slug: t.slug }, update: {}, create: t })
  }

  const techCat = await prisma.category.findUnique({ where: { slug: 'technology' } })
  const designCat = await prisma.category.findUnique({ where: { slug: 'design' } })
  const bizCat = await prisma.category.findUnique({ where: { slug: 'business' } })
  const tsTag = await prisma.tag.findUnique({ where: { slug: 'typescript' } })
  const nextTag = await prisma.tag.findUnique({ where: { slug: 'nextjs' } })
  const archTag = await prisma.tag.findUnique({ where: { slug: 'architecture' } })
  const perfTag = await prisma.tag.findUnique({ where: { slug: 'performance' } })
  const cssTag = await prisma.tag.findUnique({ where: { slug: 'css' } })

  const articles = [
    {
      title: 'Getting Started with Next.js 16', slug: 'getting-started-nextjs-16',
      excerpt: 'Explore the new App Router patterns, server components, and Turbopack improvements in Next.js 16.',
      content: 'Next.js 16 introduces significant improvements to the App Router...\n\n## Server Components\n\nServer Components allow you to render components on the server...\n\n## Turbopack\n\nTurbopack is the new bundler that replaces webpack...',
      status: 'PUBLISHED' as const, categoryId: techCat!.id, authorId: author1.id,
      tags: [nextTag!.id, tsTag!.id], publishAt: new Date('2026-05-15'),
    },
    {
      title: 'Building Scalable APIs with TypeScript', slug: 'building-scalable-apis-typescript',
      excerpt: 'Learn how to design and implement APIs that scale gracefully using TypeScript patterns.',
      content: 'When building APIs that need to scale, TypeScript provides the type safety...\n\n## Domain-Driven Design\n\nOrganizing your API around business domains...',
      status: 'PUBLISHED' as const, categoryId: techCat!.id, authorId: author1.id,
      tags: [tsTag!.id, archTag!.id], publishAt: new Date('2026-05-20'),
    },
    {
      title: 'SEO Best Practices in 2026', slug: 'seo-best-practices-2026',
      excerpt: 'Stay ahead of search algorithms with these modern SEO techniques and patterns.',
      content: 'Search engines continue to evolve. Here are the most important SEO practices...\n\n## Core Web Vitals\n\nGoogle continues to emphasize user experience metrics...',
      status: 'PUBLISHED' as const, categoryId: bizCat!.id, authorId: author2.id,
      tags: [perfTag!.id], publishAt: new Date('2026-06-01'),
    },
    {
      title: 'Design System Architecture', slug: 'design-system-architecture',
      excerpt: 'How to build a maintainable design system that scales across teams and products.',
      content: 'A well-structured design system is the foundation of consistent product development...\n\n## Component Hierarchy\n\nStart with atoms, then molecules, then organisms...',
      status: 'PUBLISHED' as const, categoryId: designCat!.id, authorId: author2.id,
      tags: [cssTag!.id, archTag!.id], publishAt: new Date('2026-06-05'),
    },
    {
      title: 'Database Design Patterns', slug: 'database-design-patterns',
      excerpt: 'Common database design patterns and when to apply them in modern applications.',
      content: 'Choosing the right database patterns early prevents costly migrations later...\n\n## Normalization vs Denormalization\n\nUnderstanding when to normalize and when to denormalize...',
      status: 'PUBLISHED' as const, categoryId: techCat!.id, authorId: author1.id,
      tags: [archTag!.id], publishAt: new Date('2026-06-10'),
    },
    {
      title: 'Introduction to WebSockets', slug: 'introduction-to-websockets',
      excerpt: 'A practical guide to real-time communication using WebSockets in web applications.',
      content: 'WebSockets provide full-duplex communication channels over a single TCP connection...\n\n## When to Use WebSockets\n\nWebSockets excel in scenarios requiring low-latency updates...',
      status: 'PUBLISHED' as const, categoryId: techCat!.id, authorId: author2.id,
      tags: [perfTag!.id], publishAt: new Date('2026-06-15'),
    },
    {
      title: 'The Future of CSS Layout', slug: 'future-of-css-layout',
      excerpt: 'Exploring container queries, anchor positioning, and other modern CSS features.',
      content: 'CSS has evolved dramatically. Container queries finally enable true component-level responsiveness...',
      status: 'DRAFT' as const, categoryId: designCat!.id, authorId: author1.id,
      tags: [cssTag!.id], publishAt: null,
    },
    {
      title: 'Microservices vs Monoliths', slug: 'microservices-vs-monoliths',
      excerpt: 'A balanced comparison of architectural approaches for modern web applications.',
      content: 'The debate between microservices and monoliths continues. The answer depends on your specific context...',
      status: 'PENDING_REVIEW' as const, categoryId: bizCat!.id, authorId: author2.id,
      tags: [archTag!.id], publishAt: null,
    },
  ]

  for (const article of articles) {
    const { tags, ...data } = article
    const existing = await prisma.article.findUnique({ where: { slug: data.slug } })
    if (!existing) {
      await prisma.article.create({
        data: {
          ...data,
          tags: { create: tags.map((tagId) => ({ tagId })) },
        },
      })
    }
  }

  console.log('Seeded successfully')
}

main().catch((e) => { console.error(e); process.exit(1) })
