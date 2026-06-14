import { PrismaClient } from '@prisma/content-client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import bcrypt from 'bcryptjs'

const url = process.env.DATABASE_URL ?? 'file:./dev.db'
const authToken = process.env.TURSO_AUTH_TOKEN
const adapter = new PrismaLibSql(authToken ? { url, authToken } : { url })
const prisma = new PrismaClient({ adapter })

async function main() {
  const password = await bcrypt.hash('password123', 10)

  await prisma.author.upsert({
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
    { name: 'UX Research', slug: 'ux-research' },
    { name: 'E-Commerce', slug: 'e-commerce' },
    { name: 'Accessibility', slug: 'accessibility' },
    { name: 'Creator Economy', slug: 'creator-economy' },
    { name: 'Open Source', slug: 'open-source' },
  ]

  for (const t of tags) {
    await prisma.tag.upsert({ where: { slug: t.slug }, update: {}, create: t })
  }

  const techCat = await prisma.category.findUnique({ where: { slug: 'technology' } })
  const designCat = await prisma.category.findUnique({ where: { slug: 'design' } })
  const bizCat = await prisma.category.findUnique({ where: { slug: 'business' } })

  const nextTag = await prisma.tag.findUnique({ where: { slug: 'nextjs' } })
  const tsTag = await prisma.tag.findUnique({ where: { slug: 'typescript' } })
  const archTag = await prisma.tag.findUnique({ where: { slug: 'architecture' } })
  const perfTag = await prisma.tag.findUnique({ where: { slug: 'performance' } })
  const cssTag = await prisma.tag.findUnique({ where: { slug: 'css' } })
  const uxTag = await prisma.tag.findUnique({ where: { slug: 'ux-research' } })
  const ecommerceTag = await prisma.tag.findUnique({ where: { slug: 'e-commerce' } })
  const a11yTag = await prisma.tag.findUnique({ where: { slug: 'accessibility' } })
  const creatorTag = await prisma.tag.findUnique({ where: { slug: 'creator-economy' } })
  const ossTag = await prisma.tag.findUnique({ where: { slug: 'open-source' } })

  const articles = [
    // ── Original 6 published ──
    {
      title: 'Getting Started with Next.js 16', slug: 'getting-started-nextjs-16',
      excerpt: 'Explore the new App Router patterns, server components, and Turbopack improvements in Next.js 16.',
      content: 'Next.js 16 introduces significant improvements to the App Router...\n\n## Server Components\n\nServer Components allow you to render components on the server...\n\n## Turbopack\n\nTurbopack is the new bundler that replaces webpack...',
      status: 'PUBLISHED' as const, categoryId: techCat!.id, authorId: author1.id,
      tags: [nextTag!.id, tsTag!.id], publishAt: new Date('2026-05-15'),
      format: 'WRITING' as const,
    },
    {
      title: 'Building Scalable APIs with TypeScript', slug: 'building-scalable-apis-typescript',
      excerpt: 'Learn how to design and implement APIs that scale gracefully using TypeScript patterns.',
      content: 'When building APIs that need to scale, TypeScript provides the type safety...\n\n## Domain-Driven Design\n\nOrganizing your API around business domains...',
      status: 'PUBLISHED' as const, categoryId: techCat!.id, authorId: author1.id,
      tags: [tsTag!.id, archTag!.id], publishAt: new Date('2026-05-20'),
      format: 'WRITING' as const,
    },
    {
      title: 'SEO Best Practices in 2026', slug: 'seo-best-practices-2026',
      excerpt: 'Stay ahead of search algorithms with these modern SEO techniques and patterns.',
      content: 'Search engines continue to evolve. Here are the most important SEO practices...\n\n## Core Web Vitals\n\nGoogle continues to emphasize user experience metrics...',
      status: 'PUBLISHED' as const, categoryId: bizCat!.id, authorId: author2.id,
      tags: [perfTag!.id], publishAt: new Date('2026-06-01'),
      format: 'WRITING' as const,
    },
    {
      title: 'Design System Architecture', slug: 'design-system-architecture',
      excerpt: 'How to build a maintainable design system that scales across teams and products.',
      content: 'A well-structured design system is the foundation of consistent product development...\n\n## Component Hierarchy\n\nStart with atoms, then molecules, then organisms...',
      status: 'PUBLISHED' as const, categoryId: designCat!.id, authorId: author2.id,
      tags: [cssTag!.id, archTag!.id], publishAt: new Date('2026-06-05'),
      format: 'WRITING' as const,
    },
    {
      title: 'Database Design Patterns', slug: 'database-design-patterns',
      excerpt: 'Common database design patterns and when to apply them in modern applications.',
      content: 'Choosing the right database patterns early prevents costly migrations later...\n\n## Normalization vs Denormalization\n\nUnderstanding when to normalize and when to denormalize...',
      status: 'PUBLISHED' as const, categoryId: techCat!.id, authorId: author1.id,
      tags: [archTag!.id], publishAt: new Date('2026-06-10'),
      format: 'WRITING' as const,
    },
    {
      title: 'Introduction to WebSockets', slug: 'introduction-to-websockets',
      excerpt: 'A practical guide to real-time communication using WebSockets in web applications.',
      content: 'WebSockets provide full-duplex communication channels over a single TCP connection...\n\n## When to Use WebSockets\n\nWebSockets excel in scenarios requiring low-latency updates...',
      status: 'PUBLISHED' as const, categoryId: techCat!.id, authorId: author2.id,
      tags: [perfTag!.id], publishAt: new Date('2026-06-15'),
      format: 'WRITING' as const,
    },
    // ── New 8 published ──
    {
      title: 'UX Research Methods for Filipino Startups', slug: 'ux-research-filipino-startups',
      excerpt: 'Practical user research techniques that work in the Philippine market — from guerrilla testing to remote interviews.',
      content: 'User research in the Philippines requires cultural sensitivity and creative approaches...\n\n## Guerrilla Testing in Mall Food Courts\n\nSome of the best UX insights come from informal testing sessions...\n\n## Remote interviews via Messenger\n\nFilipinos are heavy Messenger users — leverage that for remote research...',
      status: 'PUBLISHED' as const, categoryId: designCat!.id, authorId: author1.id,
      tags: [uxTag!.id], publishAt: new Date('2026-05-18'),
      format: 'WRITING' as const,
    },
    {
      title: 'Understanding Philippine E-Commerce Trends', slug: 'philippine-ecommerce-trends',
      excerpt: 'From Shopee to social commerce — how Filipino buying habits are shaping the digital marketplace.',
      content: 'The Philippine e-commerce landscape is evolving rapidly...\n\n## Social Commerce Rise\n\nFacebook and Instagram shops are becoming the primary sales channel for many Filipino businesses...\n\n## Cash on Delivery Still King\n\nDespite digital payment adoption, COD remains the preferred payment method...',
      status: 'PUBLISHED' as const, categoryId: bizCat!.id, authorId: author2.id,
      tags: [ecommerceTag!.id], publishAt: new Date('2026-05-25'),
      format: 'WRITING' as const,
    },
    {
      title: 'Building Accessible Web Apps', slug: 'building-accessible-web-apps',
      excerpt: 'A comprehensive guide to web accessibility — because the web should work for everyone.',
      content: 'Web accessibility is not just a legal requirement — it is the right thing to do...\n\n## Semantic HTML\n\nUsing the right HTML elements is the foundation of accessibility...\n\n## ARIA Labels\n\nWhen semantic HTML is not enough, ARIA labels bridge the gap...',
      status: 'PUBLISHED' as const, categoryId: techCat!.id, authorId: author1.id,
      tags: [a11yTag!.id, cssTag!.id], publishAt: new Date('2026-06-02'),
      format: 'WRITING' as const,
    },
    {
      title: 'The Rise of Creator Economy in Southeast Asia', slug: 'creator-economy-southeast-asia',
      excerpt: 'How content creators in the Philippines and beyond are building sustainable businesses online.',
      content: 'The creator economy is booming across Southeast Asia...\n\n## Filipino Creators Leading the Way\n\nFrom YouTube to TikTok, Filipino creators are gaining global audiences...\n\n## Monetization Strategies\n\nBrand partnerships, merchandise, and direct fan support are the primary revenue streams...',
      status: 'PUBLISHED' as const, categoryId: bizCat!.id, authorId: author2.id,
      tags: [creatorTag!.id], publishAt: new Date('2026-06-08'),
      format: 'WRITING' as const,
    },
    {
      title: 'Modern CSS Techniques You Should Know', slug: 'modern-css-techniques',
      excerpt: 'Container queries, cascade layers, :has(), and other CSS features that change how we style the web.',
      content: 'CSS has evolved dramatically in the past year...\n\n## Container Queries\n\nFinally, components can respond to their container width instead of the viewport...\n\n## The :has() Selector\n\nOften called the "parent selector," :has() enables patterns previously impossible in CSS...',
      status: 'PUBLISHED' as const, categoryId: designCat!.id, authorId: author1.id,
      tags: [cssTag!.id], publishAt: new Date('2026-06-12'),
      format: 'WRITING' as const,
    },
    {
      title: 'Scaling Infrastructure for Philippine SaaS', slug: 'scaling-infrastructure-philippine-saas',
      excerpt: 'Lessons learned from building and scaling software products in the Philippine market.',
      content: 'Building SaaS products for the Philippines comes with unique challenges...\n\n## Internet Connectivity\n\nVariable internet speeds require careful optimization...\n\n## Local Payment Integration\n\nGCash, Maya, and bank transfers are essential payment options...',
      status: 'PUBLISHED' as const, categoryId: techCat!.id, authorId: author2.id,
      tags: [archTag!.id, perfTag!.id], publishAt: new Date('2026-06-18'),
      format: 'WRITING' as const,
    },
    {
      title: 'Content Strategy for Filipino Brands', slug: 'content-strategy-filipino-brands',
      excerpt: 'How to craft content that resonates with Filipino audiences — language, culture, and storytelling.',
      content: 'Content strategy in the Philippines requires understanding local culture...\n\n## Taglish Works\n\nMixing Filipino and English (Taglish) feels natural and authentic...\n\n## Storytelling Over Selling\n\nFilipinos respond better to stories than hard sells...',
      status: 'PUBLISHED' as const, categoryId: bizCat!.id, authorId: author1.id,
      tags: [creatorTag!.id, uxTag!.id], publishAt: new Date('2026-06-22'),
      format: 'WRITING' as const,
    },
    {
      title: 'Open Source Contributions Guide', slug: 'open-source-contributions-guide',
      excerpt: 'Your first steps into open source — finding projects, making PRs, and building your reputation.',
      content: 'Contributing to open source is one of the best ways to grow as a developer...\n\n## Finding the Right Project\n\nStart with projects you already use...\n\n## Making Your First PR\n\nRead the contributing guidelines, fork the repo, and start small...',
      status: 'PUBLISHED' as const, categoryId: techCat!.id, authorId: author2.id,
      tags: [ossTag!.id, tsTag!.id], publishAt: new Date('2026-06-25'),
      format: 'WRITING' as const,
    },
    // ── Draft + Pending ──
    {
      title: 'The Future of CSS Layout', slug: 'future-of-css-layout',
      excerpt: 'Exploring container queries, anchor positioning, and other modern CSS features.',
      content: 'CSS has evolved dramatically. Container queries finally enable true component-level responsiveness...',
      status: 'DRAFT' as const, categoryId: designCat!.id, authorId: author1.id,
      tags: [cssTag!.id], publishAt: null,
      format: 'WRITING' as const,
    },
    {
      title: 'Microservices vs Monoliths', slug: 'microservices-vs-monoliths',
      excerpt: 'A balanced comparison of architectural approaches for modern web applications.',
      content: 'The debate between microservices and monoliths continues. The answer depends on your specific context...',
      status: 'PENDING_REVIEW' as const, categoryId: bizCat!.id, authorId: author2.id,
      tags: [archTag!.id], publishAt: null,
      format: 'WRITING' as const,
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
