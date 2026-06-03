import { PrismaClient } from '@prisma/security-client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import bcrypt from 'bcryptjs'

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? 'file:./dev.db',
})
const prisma = new PrismaClient({ adapter })

async function main() {
  const password = await bcrypt.hash('password123', 10)

  const sysAdmin = await prisma.user.upsert({
    where: { email: 'admin@security.dev' },
    update: {},
    create: { name: 'System Admin', email: 'admin@security.dev', password, role: 'SYSTEM_ADMIN' },
  })

  const org = await prisma.organization.upsert({
    where: { slug: 'acme-corp' },
    update: {},
    create: { name: 'Acme Corp', slug: 'acme-corp' },
  })

  const orgAdmin = await prisma.user.upsert({
    where: { email: 'orgadmin@security.dev' },
    update: {},
    create: { name: 'Org Admin', email: 'orgadmin@security.dev', password, role: 'ORG_ADMIN', organizationId: org.id },
  })

  const orgUser = await prisma.user.upsert({
    where: { email: 'orguser@security.dev' },
    update: {},
    create: { name: 'Org User', email: 'orguser@security.dev', password, role: 'ORG_USER', organizationId: org.id },
  })

  const documents = [
    { title: 'Q1 Security Audit Report', body: 'Findings from the Q1 2026 security audit. No critical vulnerabilities found.' },
    { title: 'Incident Response Plan', body: 'Standard operating procedures for security incidents and data breaches.' },
    { title: 'Data Classification Policy', body: 'Internal policy document outlining data classification levels and handling requirements.' },
  ]

  for (const doc of documents) {
    await prisma.document.create({
      data: {
        title: doc.title,
        body: doc.body,
        organizationId: org.id,
        uploadedById: orgAdmin.id,
      },
    })
  }

  await prisma.securitySetting.create({
    data: { key: 'mfa_enabled', value: 'true', organizationId: org.id },
  })

  await prisma.securitySetting.create({
    data: { key: 'session_timeout_minutes', value: '60', organizationId: org.id },
  })

  console.log('Seeded successfully')
}

main().catch((e) => { console.error(e); process.exit(1) })
