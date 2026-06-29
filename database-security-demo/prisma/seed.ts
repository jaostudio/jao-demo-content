import { PrismaClient } from '@prisma/security-client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { SANDOX_ORGANIZATIONS, sandboxUsers, SANDOX_DOCUMENTS, SANDOX_SECURITY_SETTINGS, sandboxDocId, sandboxSettingId } from '../src/lib/sandbox/seed-data'

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? 'file:./dev.db',
})
const prisma = new PrismaClient({ adapter })

async function main() {
  // ── Organizations ──
  for (const org of SANDOX_ORGANIZATIONS) {
    await prisma.organization.upsert({
      where: { slug: org.slug },
      update: {},
      create: { id: org.id, name: org.name, slug: org.slug },
    })
  }

  // ── Users ──
  for (const user of sandboxUsers()) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: { id: user.id, name: user.name, email: user.email, password: user.password, role: user.role, organizationId: user.organizationId },
    })
  }

  // ── Documents ──
  for (let i = 0; i < SANDOX_DOCUMENTS.length; i++) {
    const doc = SANDOX_DOCUMENTS[i]
    await prisma.document.create({
      data: { id: sandboxDocId(i), title: doc.title, body: doc.body, organizationId: doc.orgId, uploadedById: doc.uploadedById },
    })
  }

  // ── Security Settings ──
  for (const org of SANDOX_ORGANIZATIONS) {
    for (const setting of SANDOX_SECURITY_SETTINGS) {
      await prisma.securitySetting.upsert({
        where: { key_organizationId: { key: setting.key, organizationId: org.id } },
        update: {},
        create: { id: sandboxSettingId(org.id, setting.key), key: setting.key, value: setting.value, organizationId: org.id },
      })
    }
  }

  console.log('IslaVault seeded successfully')
}

main().catch((e) => { console.error(e); process.exit(1) })
