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
  console.log('\u{1f331} Seeding Likha...')

  // ── Clean order ──
  await prisma.comment.deleteMany()
  await prisma.collectionItem.deleteMany()
  await prisma.collection.deleteMany()
  await prisma.follow.deleteMany()
  await prisma.articleVersion.deleteMany()
  await prisma.articleTag.deleteMany()
  await prisma.article.deleteMany()

  // ── Passwords ──
  const password = await bcrypt.hash('password123', 10)

  // ═══════════════════════════════════════════
  // AUTHORS (5) — with image, bio, specialty
  // ═══════════════════════════════════════════
  const sarah = await prisma.author.upsert({
    where: { email: 'sarah@content.dev' },
    update: {
      image: '/demo/artists/sarah-avatar.svg',
      bio: 'Human-made design systems, typography, and sketchbooks. Based in San Francisco.',
      specialty: 'Typography, Design Systems, Illustration',
    },
    create: {
      name: 'Sarah Chen', email: 'sarah@content.dev', password, role: 'AUTHOR',
      image: '/demo/artists/sarah-avatar.svg',
      bio: 'Human-made design systems, typography, and sketchbooks. Based in San Francisco.',
      specialty: 'Typography, Design Systems, Illustration',
    },
  })
  const marcus = await prisma.author.upsert({
    where: { email: 'marcus@content.dev' },
    update: {
      image: '/demo/artists/marcus-avatar.svg',
      bio: 'Accessibility advocate, research notes, and platform design. Building inclusive digital spaces.',
      specialty: 'Accessibility, Research, Platform Design',
    },
    create: {
      name: 'Marcus Rivera', email: 'marcus@content.dev', password, role: 'AUTHOR',
      image: '/demo/artists/marcus-avatar.svg',
      bio: 'Accessibility advocate, research notes, and platform design. Building inclusive digital spaces.',
      specialty: 'Accessibility, Research, Platform Design',
    },
  })
  const admin = await prisma.author.upsert({
    where: { email: 'admin@content.dev' },
    update: {
      image: '/demo/artists/editor-avatar.svg',
      bio: 'Platform editor and community moderator for Likha.',
      specialty: 'Moderation, Community, Platform Operations',
    },
    create: {
      name: 'Maya Santos', email: 'admin@content.dev', password, role: 'ADMIN',
      image: '/demo/artists/editor-avatar.svg',
      bio: 'Platform editor and community moderator for Likha.',
      specialty: 'Moderation, Community, Platform Operations',
    },
  })
  const tala = await prisma.author.upsert({
    where: { email: 'tala@content.dev' },
    update: {
      image: '/demo/artists/tala-avatar.svg',
      bio: 'Character designer and mural artist based in Manila. Explores visual storytelling through traditional and digital media.',
      specialty: 'Character Design, Mural Art, Visual Storytelling',
    },
    create: {
      name: 'Tala Cruz', email: 'tala@content.dev', password, role: 'AUTHOR',
      image: '/demo/artists/tala-avatar.svg',
      bio: 'Character designer and mural artist based in Manila. Explores visual storytelling through traditional and digital media.',
      specialty: 'Character Design, Mural Art, Visual Storytelling',
    },
  })
  const leo = await prisma.author.upsert({
    where: { email: 'leo@content.dev' },
    update: {
      image: '/demo/artists/leo-avatar.svg',
      bio: 'Street photographer, community publisher, and audio diarist. Capturing stories from the streets of Manila.',
      specialty: 'Photography, Community Publishing, Audio',
    },
    create: {
      name: 'Leo Reyes', email: 'leo@content.dev', password, role: 'AUTHOR',
      image: '/demo/artists/leo-avatar.svg',
      bio: 'Street photographer, community publisher, and audio diarist. Capturing stories from the streets of Manila.',
      specialty: 'Photography, Community Publishing, Audio',
    },
  })

  // ── Categories ──
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
    const result = await prisma.article.create({
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
        articleId: result.id,
        content: opts.content ?? 'Content placeholder.',
        changeNote: 'Initial draft',
        version: 1,
      },
    })
    return result
  }

  const now = new Date()
  const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000)

  // ═══════════════════════════════════════════
  // WORKS — flagship works with SVG media
  // ═══════════════════════════════════════════

  // ── TALA: Character Design: The Guardian (3 versions, PROCESS_DOCUMENTED) ──
  const t1 = await createArticle({
    authorId: tala.id, title: 'Character Design: The Guardian',
    format: 'DRAWING', status: 'PUBLISHED', provenanceStatus: 'PROCESS_DOCUMENTED',
    categoryId: design.id, tagSlugs: ['illustration', 'creative-process'],
    imageUrl: '/demo/works/guardian-final.svg',
    excerpt: 'A behind-the-scenes look at my character design process from silhouette exploration to final rendered poster.',
    publishAt: daysAgo(4), likes: 89,
    content: 'This project explores the full character design pipeline — from initial silhouette exploration through armor shape language to final rendered poster. Each phase of the process is documented with annotations and decision notes.',
  })
  await prisma.articleVersion.create({
    data: { articleId: t1.id, content: 'Silhouette exploration and initial concept sketches.', changeNote: 'Silhouette exploration and initial concept sketches.', version: 2, mediaUrl: '/demo/works/guardian-sketch.svg', createdAt: daysAgo(8) },
  })
  await prisma.articleVersion.create({
    data: { articleId: t1.id, content: 'Armor shape pass and proportion refinement.', changeNote: 'Armor shape pass and proportion refinement.', version: 3, mediaUrl: '/demo/works/guardian-armor.svg', createdAt: daysAgo(6) },
  })
  await prisma.articleVersion.create({
    data: { articleId: t1.id, content: 'Final rendered character poster with lighting and color.', changeNote: 'Final rendered character poster with lighting and color.', version: 4, mediaUrl: '/demo/works/guardian-final.svg', createdAt: daysAgo(4) },
  })

  // ── TALA: Stylized Anatomy Studies (2 versions, PROCESS_DOCUMENTED) ──
  const t2 = await createArticle({
    authorId: tala.id, title: 'Stylized Anatomy Studies',
    format: 'DRAWING', status: 'PUBLISHED', provenanceStatus: 'PROCESS_DOCUMENTED',
    categoryId: design.id, tagSlugs: ['illustration', 'animation'],
    imageUrl: '/demo/works/anatomy-final.svg',
    excerpt: 'A series of anatomy studies exploring stylized proportions for character design.',
    publishAt: daysAgo(7), likes: 73,
  })
  await prisma.articleVersion.create({
    data: { articleId: t2.id, content: 'Initial gesture sketches and proportion studies.', changeNote: 'Initial proportion studies', version: 2, mediaUrl: '/demo/works/anatomy-refinement.svg', createdAt: daysAgo(9) },
  })

  // ── TALA: Process Notes: Mural Project (3 versions, PROCESS_DOCUMENTED) ──
  const t3 = await createArticle({
    authorId: tala.id, title: 'Process Notes: Mural Project',
    format: 'WRITING', status: 'PUBLISHED', provenanceStatus: 'PROCESS_DOCUMENTED',
    categoryId: business.id, tagSlugs: ['creative-process', 'storytelling', 'community'],
    imageUrl: '/demo/works/mural-final.svg',
    excerpt: 'Documenting the full process behind a community mural project from concept sketches to completed installation.',
    publishAt: daysAgo(12), likes: 44,
  })
  await prisma.articleVersion.create({
    data: { articleId: t3.id, content: 'Concept sketches and site analysis.', changeNote: 'Concept sketches and site analysis.', version: 2, mediaUrl: '/demo/works/mural-sketches.svg', createdAt: daysAgo(16) },
  })
  await prisma.articleVersion.create({
    data: { articleId: t3.id, content: 'In-progress documentation with community participation.', changeNote: 'In-progress documentation with community participation.', version: 3, mediaUrl: '/demo/works/mural-progress.svg', createdAt: daysAgo(14) },
  })

  // ── TALA: Experimental Animation Tests ──
  const t4 = await createArticle({
    authorId: tala.id, title: 'Experimental Animation Tests',
    format: 'VIDEO', status: 'DRAFT',
    categoryId: design.id, tagSlugs: ['animation', 'creative-process'],
    excerpt: 'Early tests for an experimental animation project exploring organic motion.',
  })

  // ── SARAH: Letterpress in Digital Design (3 versions, DECLARED_HUMAN_MADE) ──
  const s1 = await createArticle({
    authorId: sarah.id, title: 'The Art of Letterpress in Digital Design',
    format: 'WRITING', status: 'PUBLISHED', provenanceStatus: 'DECLARED_HUMAN_MADE',
    categoryId: design.id, tagSlugs: ['typography', 'creative-process', 'storytelling'],
    imageUrl: '/demo/works/letterpress-final.svg',
    excerpt: 'How traditional letterpress techniques inform modern typography and digital design.',
    publishAt: daysAgo(2), likes: 24,
  })
  await prisma.articleVersion.create({
    data: { articleId: s1.id, content: 'Research and plate proof documentation.', changeNote: 'Added plate proof documentation', version: 2, mediaUrl: '/demo/works/letterpress-process.svg', createdAt: daysAgo(5) },
  })
  await prisma.articleVersion.create({
    data: { articleId: s1.id, content: 'Final draft with color theory section.', changeNote: 'Added section on color theory', version: 3, createdAt: daysAgo(3) },
  })

  // ── SARAH: Sketchbook: July Explorations ──
  const s2 = await createArticle({
    authorId: sarah.id, title: 'Sketchbook: July Explorations',
    format: 'DRAWING', status: 'PUBLISHED', provenanceStatus: 'PROCESS_DOCUMENTED',
    categoryId: design.id, tagSlugs: ['illustration', 'creative-process'],
    excerpt: 'A collection of daily sketches exploring form and negative space.',
    publishAt: daysAgo(5), likes: 42,
  })
  await prisma.articleVersion.create({
    data: { articleId: s2.id, content: 'Initial set of 20 sketches.', changeNote: 'Added 5 new sketches', version: 2, createdAt: daysAgo(3) },
  })

  // ── SARAH: Human-Made Reflection ──
  const s3 = await createArticle({
    authorId: sarah.id, title: 'Why I Left AI Tools Behind',
    format: 'WRITING', status: 'PUBLISHED', provenanceStatus: 'DECLARED_HUMAN_MADE',
    categoryId: tech.id, tagSlugs: ['creative-process', 'community'],
    excerpt: 'A personal reflection on choosing human-made creative tools.',
    publishAt: daysAgo(8), likes: 67,
  })

  // ── SARAH: Brand Identity WIP ──
  const s4 = await createArticle({
    authorId: sarah.id, title: 'Work in Progress: Brand Identity',
    format: 'DRAWING', status: 'DRAFT',
    categoryId: design.id, tagSlugs: ['illustration', 'ui-design'],
    excerpt: 'Early sketches for a proposed brand system.',
  })

  // ── MARCUS: Accessibility-First Design Systems (2 versions, PROCESS_DOCUMENTED) ──
  const m2 = await createArticle({
    authorId: marcus.id, title: 'Accessibility-First Design Systems',
    format: 'WRITING', status: 'PUBLISHED', provenanceStatus: 'PROCESS_DOCUMENTED',
    categoryId: design.id, tagSlugs: ['accessibility', 'ui-design'],
    imageUrl: '/demo/works/accessibility-system.svg',
    excerpt: 'Building design systems that work for everyone from day one.',
    publishAt: daysAgo(10), likes: 55,
  })
  await prisma.articleVersion.create({
    data: { articleId: m2.id, content: 'Initial draft with component library.', changeNote: 'Added WCAG compliance checklist', version: 2, createdAt: daysAgo(10) },
  })

  // ── MARCUS: Scaling Community Platforms ──
  const m1 = await createArticle({
    authorId: marcus.id, title: 'Scaling Community Platforms',
    format: 'WRITING', status: 'PUBLISHED', provenanceStatus: 'AI_ASSISTED',
    provenanceNote: 'Research outline generated with AI, content written by author.',
    categoryId: tech.id, tagSlugs: ['open-source', 'community'],
    excerpt: 'Lessons from scaling a community platform to 100k users.',
    publishAt: daysAgo(3), likes: 31,
  })

  // ── MARCUS: Photography Process ──
  const m3 = await createArticle({
    authorId: marcus.id, title: 'My Photography Process: Finding Light',
    format: 'VIDEO', status: 'PENDING_REVIEW',
    categoryId: design.id, tagSlugs: ['photography', 'creative-process'],
    excerpt: 'A video essay on natural light photography techniques.',
  })

  // ── MARCUS: AI-Assisted Research ──
  const m4 = await createArticle({
    authorId: marcus.id, title: 'AI-Assisted Research Notes',
    format: 'WRITING', status: 'PUBLISHED', provenanceStatus: 'AI_ASSISTED',
    provenanceNote: 'Literature review generated with AI, analysis by author.',
    categoryId: tech.id, tagSlugs: ['open-source', 'storytelling'],
    excerpt: 'Using AI tools responsibly in the research phase of writing.',
    publishAt: daysAgo(1), likes: 18,
  })

  // ── LEO: Street Photography: Manila (2 versions) ──
  const l1 = await createArticle({
    authorId: leo.id, title: 'Street Photography: Manila',
    format: 'DRAWING', status: 'PUBLISHED', provenanceStatus: 'DECLARED_HUMAN_MADE',
    categoryId: design.id, tagSlugs: ['photography', 'storytelling'],
    imageUrl: '/demo/works/manila-street.svg',
    excerpt: 'Capturing everyday life on the streets of Manila through a documentary lens.',
    publishAt: daysAgo(6), likes: 61,
  })
  await prisma.articleVersion.create({
    data: { articleId: l1.id, content: 'Added 10 new photos and captions.', changeNote: 'Added 10 new photos and captions', version: 2, createdAt: daysAgo(3) },
  })

  // ── LEO: Zine Distribution Network ──
  const l2 = await createArticle({
    authorId: leo.id, title: 'Building a Zine Distribution Network',
    format: 'WRITING', status: 'PUBLISHED',
    categoryId: business.id, tagSlugs: ['community', 'creative-process'],
    excerpt: 'How we built a community zine distribution network from scratch.',
    publishAt: daysAgo(14), likes: 35,
  })

  // ── LEO: Audio Diaries: Creative Block ──
  const l3 = await createArticle({
    authorId: leo.id, title: 'Audio Diaries: Creative Block',
    format: 'AUDIO', status: 'PUBLISHED', provenanceStatus: 'DECLARED_HUMAN_MADE',
    categoryId: design.id, tagSlugs: ['creative-process', 'storytelling'],
    imageUrl: '/demo/works/audio-card.svg',
    excerpt: 'A raw audio reflection on working through creative block.',
    publishAt: daysAgo(9), likes: 27,
  })

  // ── LEO: Archived Portfolio ──
  const l4 = await createArticle({
    authorId: leo.id, title: 'Archived Project: 2024 Portfolio',
    format: 'WRITING', status: 'ARCHIVED',
    categoryId: design.id, tagSlugs: ['illustration', 'ui-design'],
    excerpt: 'An older portfolio project that has been superseded.',
  })

  // ── EDITOR: Community Guidelines ──
  const a1 = await createArticle({
    authorId: admin.id, title: 'Community Guidelines Update',
    format: 'WRITING', status: 'PUBLISHED',
    categoryId: business.id, tagSlugs: ['community', 'storytelling'],
    excerpt: 'Updated community guidelines for the Likha platform.',
    publishAt: daysAgo(15), likes: 12,
  })

  // ── EDITOR: Flagged Content Report ──
  const a2 = await createArticle({
    authorId: admin.id, title: 'Flagged Content Report',
    format: 'WRITING', status: 'ARCHIVED', provenanceStatus: 'REMOVED_BY_ADMIN',
    provenanceNote: 'Provenance badge removed after investigation.',
    categoryId: tech.id, tagSlugs: ['community'],
    excerpt: 'An internal report that has been superseded.',
  })

  // ── General process notes work ──
  const processNotes = await createArticle({
    authorId: tala.id, title: 'Introduction to Likha Process Documentation',
    format: 'WRITING', status: 'PUBLISHED', provenanceStatus: 'PROCESS_DOCUMENTED',
    categoryId: design.id, tagSlugs: ['creative-process', 'storytelling'],
    imageUrl: '/demo/works/process-notes.svg',
    excerpt: 'A guide to documenting your creative process on Likha.',
    publishAt: daysAgo(18), likes: 33,
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
  // COLLECTIONS — with covers
  // ═══════════════════════════════════════════
  const col1 = await prisma.collection.create({
    data: {
      ownerId: sarah.id, slug: 'process-documented-works', title: 'Process-Documented Works',
      description: 'Works with full process documentation — sketches, notes, and revisions.',
      cover: '/demo/collections/process-studies.svg', visibility: 'PUBLIC',
    },
  })
  const col2 = await prisma.collection.create({
    data: {
      ownerId: tala.id, slug: 'declared-human-made', title: 'Declared Human-Made',
      description: 'Works declared human-made with no AI assistance.',
      cover: '/demo/collections/human-made.svg', visibility: 'PUBLIC',
    },
  })
  const col3 = await prisma.collection.create({
    data: {
      ownerId: leo.id, slug: 'studio-notes-manila', title: 'Studio Notes from Manila',
      description: 'Creative documentation and process notes from Manila-based artists.',
      visibility: 'PUBLIC',
    },
  })

  // Add items
  for (const articleSlug of [m2.slug, t1.slug, t3.slug, processNotes.slug]) {
    const a = await prisma.article.findFirst({ where: { slug: articleSlug } })
    if (a) {
      await prisma.collectionItem.create({ data: { collectionId: col1.id, articleId: a.id } })
    }
  }
  for (const articleSlug of [s1.slug, s3.slug, t1.slug, l1.slug]) {
    const a = await prisma.article.findFirst({ where: { slug: articleSlug } })
    if (a) {
      await prisma.collectionItem.create({ data: { collectionId: col2.id, articleId: a.id } })
    }
  }
  for (const articleSlug of [t3.slug, l1.slug, l3.slug]) {
    const a = await prisma.article.findFirst({ where: { slug: articleSlug } })
    if (a) {
      await prisma.collectionItem.create({ data: { collectionId: col3.id, articleId: a.id } })
    }
  }

  console.log(`\u2705 Seeded ${articleCount} works, 5 artists, 3 categories, 10 tags`)
  console.log(`   ${commentMap.length} comments, 12 follows, 3 collections`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
