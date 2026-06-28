import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import bcrypt from 'bcryptjs'

const url = process.env.DATABASE_URL ?? 'file:./dev.db'
const authToken = process.env.TURSO_AUTH_TOKEN
const adapter = new PrismaLibSql(authToken ? { url, authToken } : { url })
const prisma = new PrismaClient({ adapter })

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

async function main() {
  console.log('🌱 Seeding Likha...')

  // ── Passwords ──
  const password = await bcrypt.hash('password123', 10)

  // ── Authors (5) ──
  const sarah = await prisma.author.upsert({
    where: { email: 'sarah@content.dev' },
    update: {},
    create: { name: 'Sarah Chen', email: 'sarah@content.dev', password, role: 'AUTHOR' },
  })
  const marcus = await prisma.author.upsert({
    where: { email: 'marcus@content.dev' },
    update: {},
    create: { name: 'Marcus Rivera', email: 'marcus@content.dev', password, role: 'AUTHOR' },
  })
  const admin = await prisma.author.upsert({
    where: { email: 'admin@content.dev' },
    update: {},
    create: { name: 'Maya Santos', email: 'admin@content.dev', password, role: 'ADMIN' },
  })
  const tala = await prisma.author.upsert({
    where: { email: 'tala@content.dev' },
    update: {},
    create: { name: 'Tala Cruz', email: 'tala@content.dev', password, role: 'AUTHOR' },
  })
  const leo = await prisma.author.upsert({
    where: { email: 'leo@content.dev' },
    update: {},
    create: { name: 'Leo Reyes', email: 'leo@content.dev', password, role: 'AUTHOR' },
  })

  // ── Categories (3) ──
  const tech = await prisma.category.upsert({
    where: { slug: 'technology' },
    update: {},
    create: { name: 'Technology', slug: 'technology' },
  })
  const design = await prisma.category.upsert({
    where: { slug: 'design' },
    update: {},
    create: { name: 'Design', slug: 'design' },
  })
  const business = await prisma.category.upsert({
    where: { slug: 'business' },
    update: {},
    create: { name: 'Business', slug: 'business' },
  })

  // ── Tags ──
  const tagData = [
    { name: 'Typography', slug: 'typography' },
    { name: 'Open Source', slug: 'open-source' },
    { name: 'Accessibility', slug: 'accessibility' },
    { name: 'Illustration', slug: 'illustration' },
    { name: 'UI Design', slug: 'ui-design' },
    { name: 'Animation', slug: 'animation' },
    { name: 'Photography', slug: 'photography' },
    { name: 'Creative Process', slug: 'creative-process' },
    { name: 'Community', slug: 'community' },
    { name: 'Storytelling', slug: 'storytelling' },
  ]
  const tags: Record<string, string> = {}
  for (const t of tagData) {
    const tag = await prisma.tag.upsert({ where: { slug: t.slug }, update: {}, create: t })
    tags[t.slug] = tag.id
  }

  // ── Clean existing articles, versions, comments, follows, collections ──
  await prisma.collectionItem.deleteMany()
  await prisma.collection.deleteMany()
  await prisma.follow.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.articleVersion.deleteMany()
  await prisma.articleTag.deleteMany()
  await prisma.article.deleteMany()

  // ── Helper ──
  let articleCount = 0
  async function createArticle(opts: {
    authorId: string
    title: string
    format: string
    status: string
    provenanceStatus?: string
    provenanceNote?: string | null
    categoryId: string
    tagSlugs?: string[]
    imageUrl?: string | null
    publishAt?: Date | null
    likes?: number
    excerpt?: string
    content?: string
  }) {
    articleCount++
    const slug = slugify(opts.title) + (articleCount > 1 ? `-${articleCount}` : '')
    const article = await prisma.article.create({
      data: {
        title: opts.title,
        slug,
        format: opts.format as any,
        status: opts.status as any,
        provenanceStatus: (opts.provenanceStatus as any) || 'UNDECLARED',
        provenanceNote: opts.provenanceNote ?? null,
        authorId: opts.authorId,
        categoryId: opts.categoryId,
        imageUrl: opts.imageUrl ?? null,
        excerpt: opts.excerpt ?? null,
        content: opts.content ?? 'Content placeholder.',
        publishAt: opts.publishAt ?? null,
        likes: opts.likes ?? 0,
        tags: opts.tagSlugs
          ? { create: opts.tagSlugs.map((s) => ({ tagId: tags[s] })) }
          : undefined,
      },
    })

    // Create initial version
    await prisma.articleVersion.create({
      data: {
        articleId: article.id,
        content: opts.content ?? 'Content placeholder.',
        changeNote: 'Initial draft',
        version: 1,
      },
    })

    return article
  }

  const now = new Date()
  const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000)

  // ═══════════════════════════════════════════
  // WORKS
  // ═══════════════════════════════════════════

  // Sarah — declared human-made, process-documented, writing + drawing
  const s1 = await createArticle({
    authorId: sarah.id, title: 'The Art of Letterpress in Digital Design',
    format: 'WRITING', status: 'PUBLISHED', provenanceStatus: 'DECLARED_HUMAN_MADE',
    categoryId: design.id, tagSlugs: ['typography', 'creative-process', 'storytelling'],
    excerpt: 'How traditional letterpress techniques inform modern typography.',
    publishAt: daysAgo(2), likes: 24,
  })
  await prisma.articleVersion.create({
    data: { articleId: s1.id, content: 'Edited draft.', changeNote: 'Added section on color theory', version: 2 },
  })
  await prisma.articleVersion.create({
    data: { articleId: s1.id, content: 'Final.', changeNote: 'Final polish before publish', version: 3 },
  })

  const s2 = await createArticle({
    authorId: sarah.id, title: 'Sketchbook: July Explorations',
    format: 'DRAWING', status: 'PUBLISHED', provenanceStatus: 'PROCESS_DOCUMENTED',
    categoryId: design.id, tagSlugs: ['illustration', 'creative-process'],
    excerpt: 'A collection of daily sketches exploring form and negative space.',
    publishAt: daysAgo(5), likes: 42,
  })
  await prisma.articleVersion.create({
    data: { articleId: s2.id, content: 'Initial.', changeNote: 'Added 5 new sketches', version: 2 },
  })

  const s3 = await createArticle({
    authorId: sarah.id, title: 'Why I Left AI Tools Behind',
    format: 'WRITING', status: 'PUBLISHED', provenanceStatus: 'DECLARED_HUMAN_MADE',
    categoryId: tech.id, tagSlugs: ['creative-process', 'community'],
    excerpt: 'A personal reflection on choosing human-made creative tools.',
    publishAt: daysAgo(8), likes: 67,
  })

  const s4 = await createArticle({
    authorId: sarah.id, title: 'Work in Progress: Brand Identity',
    format: 'DRAWING', status: 'DRAFT',
    categoryId: design.id, tagSlugs: ['illustration', 'ui-design'],
    excerpt: 'Early sketches for a proposed brand system.',
  })

  // Marcus — AI-assisted, writing, some process-documented
  const m1 = await createArticle({
    authorId: marcus.id, title: 'Scaling Community Platforms',
    format: 'WRITING', status: 'PUBLISHED', provenanceStatus: 'AI_ASSISTED',
    provenanceNote: 'Research outline generated with AI, content written by author.',
    categoryId: tech.id, tagSlugs: ['open-source', 'community'],
    excerpt: 'Lessons from scaling a community platform to 100k users.',
    publishAt: daysAgo(3), likes: 31,
  })

  const m2 = await createArticle({
    authorId: marcus.id, title: 'Accessibility-First Design Systems',
    format: 'WRITING', status: 'PUBLISHED', provenanceStatus: 'PROCESS_DOCUMENTED',
    categoryId: design.id, tagSlugs: ['accessibility', 'ui-design'],
    excerpt: 'Building design systems that work for everyone from day one.',
    publishAt: daysAgo(10), likes: 55,
  })
  await prisma.articleVersion.create({
    data: { articleId: m2.id, content: 'Draft v1.', changeNote: 'Added WCAG compliance checklist', version: 2 },
  })

  const m3 = await createArticle({
    authorId: marcus.id, title: 'My Photography Process: Finding Light',
    format: 'VIDEO', status: 'PENDING_REVIEW',
    categoryId: design.id, tagSlugs: ['photography', 'creative-process'],
    excerpt: 'A video essay on natural light photography techniques.',
  })

  const m4 = await createArticle({
    authorId: marcus.id, title: 'AI-Assisted Research Notes',
    format: 'WRITING', status: 'PUBLISHED', provenanceStatus: 'AI_ASSISTED',
    provenanceNote: 'Literature review generated with AI, analysis by author.',
    categoryId: tech.id, tagSlugs: ['open-source', 'storytelling'],
    excerpt: 'Using AI tools responsibly in the research phase of writing.',
    publishAt: daysAgo(1), likes: 18,
  })

  // Tala — human-made, drawings, some process-documented
  const t1 = await createArticle({
    authorId: tala.id, title: 'Character Design: The Guardian',
    format: 'DRAWING', status: 'PUBLISHED', provenanceStatus: 'DECLARED_HUMAN_MADE',
    categoryId: design.id, tagSlugs: ['illustration', 'creative-process'],
    excerpt: 'A behind-the-scenes look at my character design process.',
    publishAt: daysAgo(4), likes: 89,
  })
  await prisma.articleVersion.create({
    data: { articleId: t1.id, content: 'Sketch phase.', changeNote: 'Refined face proportions', version: 2 },
  })
  await prisma.articleVersion.create({
    data: { articleId: t1.id, content: 'Final.', changeNote: 'Color palette finalized', version: 3 },
  })

  const t2 = await createArticle({
    authorId: tala.id, title: 'Stylized Anatomy Studies',
    format: 'DRAWING', status: 'PUBLISHED',
    categoryId: design.id, tagSlugs: ['illustration', 'animation'],
    excerpt: 'A series of anatomy studies exploring stylized proportions.',
    publishAt: daysAgo(7), likes: 73,
  })

  const t3 = await createArticle({
    authorId: tala.id, title: 'Process Notes: Mural Project',
    format: 'WRITING', status: 'PUBLISHED', provenanceStatus: 'PROCESS_DOCUMENTED',
    categoryId: business.id, tagSlugs: ['creative-process', 'storytelling', 'community'],
    excerpt: 'Documenting the process behind a community mural project.',
    publishAt: daysAgo(12), likes: 44,
  })
  await prisma.articleVersion.create({
    data: { articleId: t3.id, content: 'Draft.', changeNote: 'Added timeline and budget section', version: 2 },
  })

  const t4 = await createArticle({
    authorId: tala.id, title: 'Experimental Animation Tests',
    format: 'VIDEO', status: 'DRAFT',
    categoryId: design.id, tagSlugs: ['animation', 'creative-process'],
    excerpt: 'Early tests for an experimental animation project.',
  })

  // Leo — photography, writing, mixed provenance
  const l1 = await createArticle({
    authorId: leo.id, title: 'Street Photography: Manila',
    format: 'DRAWING', status: 'PUBLISHED', provenanceStatus: 'DECLARED_HUMAN_MADE',
    categoryId: design.id, tagSlugs: ['photography', 'storytelling'],
    excerpt: 'Capturing everyday life on the streets of Manila.',
    publishAt: daysAgo(6), likes: 61,
  })
  await prisma.articleVersion.create({
    data: { articleId: l1.id, content: 'Initial.', changeNote: 'Added 10 new photos and captions', version: 2 },
  })

  const l2 = await createArticle({
    authorId: leo.id, title: 'Building a Zine Distribution Network',
    format: 'WRITING', status: 'PUBLISHED',
    categoryId: business.id, tagSlugs: ['community', 'creative-process'],
    excerpt: 'How we built a community zine distribution network from scratch.',
    publishAt: daysAgo(14), likes: 35,
  })

  const l3 = await createArticle({
    authorId: leo.id, title: 'Audio Diaries: Creative Block',
    format: 'AUDIO', status: 'PUBLISHED', provenanceStatus: 'DECLARED_HUMAN_MADE',
    categoryId: design.id, tagSlugs: ['creative-process', 'storytelling'],
    excerpt: 'A raw audio reflection on working through creative block.',
    publishAt: daysAgo(9), likes: 27,
  })

  const l4 = await createArticle({
    authorId: leo.id, title: 'Archived Project: 2024 Portfolio',
    format: 'WRITING', status: 'ARCHIVED',
    categoryId: design.id, tagSlugs: ['illustration', 'ui-design'],
    excerpt: 'An older portfolio project that has been superseded.',
  })

  // Admin (Maya) — moderation activity
  const a1 = await createArticle({
    authorId: admin.id, title: 'Community Guidelines Update',
    format: 'WRITING', status: 'PUBLISHED',
    categoryId: business.id, tagSlugs: ['community', 'storytelling'],
    excerpt: 'Updated community guidelines for the Likha platform.',
    publishAt: daysAgo(15), likes: 12,
  })

  const a2 = await createArticle({
    authorId: admin.id, title: 'Flagged Content Report',
    format: 'WRITING', status: 'ARCHIVED', provenanceStatus: 'REMOVED_BY_ADMIN',
    provenanceNote: 'Provenance badge removed after investigation.',
    categoryId: tech.id, tagSlugs: ['community'],
    excerpt: 'An internal report that has been superseded.',
  })

  // ═══════════════════════════════════════════
  // FOLLOWS
  // ═══════════════════════════════════════════
  await prisma.follow.createMany({
    data: [
      { followerId: sarah.id, followingId: tala.id },
      { followerId: sarah.id, followingId: leo.id },
      { followerId: marcus.id, followingId: sarah.id },
      { followerId: marcus.id, followingId: tala.id },
      { followerId: tala.id, followingId: sarah.id },
      { followerId: tala.id, followingId: leo.id },
      { followerId: leo.id, followingId: sarah.id },
      { followerId: leo.id, followingId: tala.id },
      { followerId: admin.id, followingId: sarah.id },
      { followerId: admin.id, followingId: marcus.id },
      { followerId: admin.id, followingId: tala.id },
      { followerId: admin.id, followingId: leo.id },
    ],
  })

  // ═══════════════════════════════════════════
  // COMMENTS
  // ═══════════════════════════════════════════
  const commentMap = [
    { articleSlug: s1.slug, name: 'Tala Cruz', body: 'The section on color theory really resonated with me. Salamat!' },
    { articleSlug: s1.slug, name: 'Leo Reyes', body: 'Have you tried combining letterpress textures with variable fonts?' },
    { articleSlug: s2.slug, name: 'Marcus Rivera', body: 'The negative space studies are stunning. Would love to see these printed.' },
    { articleSlug: s3.slug, name: 'Tala Cruz', body: 'This is exactly how I feel. Human-made is the way to go.' },
    { articleSlug: m1.slug, name: 'Sarah Chen', body: 'Great insights on platform scaling. The community aspect is key.' },
    { articleSlug: m2.slug, name: 'Maya Santos', body: 'Accessibility is not optional — thank you for this comprehensive guide.' },
    { articleSlug: t1.slug, name: 'Leo Reyes', body: 'The evolution of this character is amazing. Love the palette!' },
    { articleSlug: t1.slug, name: 'Sarah Chen', body: 'Can you share what brush set you used for the line art?' },
    { articleSlug: l1.slug, name: 'Tala Cruz', body: 'These photos capture Manila so beautifully. Galing!' },
    { articleSlug: l3.slug, name: 'Marcus Rivera', body: 'Thank you for sharing this. It helps to know others go through the same.' },
    { articleSlug: t3.slug, name: 'Maya Santos', body: 'This is exactly the kind of process documentation we want to encourage.' },
    { articleSlug: m4.slug, name: 'Sarah Chen', body: 'Responsible AI use is so important. Thanks for being transparent.' },
  ]

  for (const c of commentMap) {
    const article = await prisma.article.findFirst({ where: { slug: c.articleSlug } })
    if (article) {
      await prisma.comment.create({
        data: { articleId: article.id, authorName: c.name, authorEmail: `${slugify(c.name)}@content.dev`, body: c.body },
      })
    }
  }

  // ═══════════════════════════════════════════
  // COLLECTIONS
  // ═══════════════════════════════════════════
  const col1 = await prisma.collection.create({
    data: {
      ownerId: sarah.id, slug: 'inspiring-works', title: 'Inspiring Works',
      description: 'Works that inspire me.', visibility: 'PUBLIC',
    },
  })
  const col2 = await prisma.collection.create({
    data: {
      ownerId: tala.id, slug: 'design-reference', title: 'Design Reference',
      description: 'Reference works for my design practice.', visibility: 'PUBLIC',
    },
  })

  // Add items to public collections
  for (const articleSlug of [m2.slug, l1.slug]) {
    const a = await prisma.article.findFirst({ where: { slug: articleSlug } })
    if (a) {
      await prisma.collectionItem.create({ data: { collectionId: col1.id, articleId: a.id } })
    }
  }
  for (const articleSlug of [s2.slug, l1.slug]) {
    const a = await prisma.article.findFirst({ where: { slug: articleSlug } })
    if (a) {
      await prisma.collectionItem.create({ data: { collectionId: col2.id, articleId: a.id } })
    }
  }

  console.log(`✅ Seeded ${articleCount} works, 5 artists, 3 categories, 10 tags`)
  console.log(`   ${commentMap.length} comments, 12 follows, 2 collections`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
