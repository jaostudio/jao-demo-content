import { PrismaClient } from '@prisma/security-client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import bcrypt from 'bcryptjs'
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from '../src/lib/demo-accounts'

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? 'file:./dev.db',
})
const prisma = new PrismaClient({ adapter })

const PASSWORD = bcrypt.hashSync(DEMO_PASSWORD, 10)

async function main() {
  // ── Organizations ──

  const luntian = await prisma.organization.upsert({
    where: { slug: 'luntian-health' },
    update: {},
    create: { name: 'Luntian Health', slug: 'luntian-health' },
  })

  const talapay = await prisma.organization.upsert({
    where: { slug: 'talapay-cooperative' },
    update: {},
    create: { name: 'TalaPay', slug: 'talapay-cooperative' },
  })

  const bayani = await prisma.organization.upsert({
    where: { slug: 'bayani-freight' },
    update: {},
    create: { name: 'Bayani Freight', slug: 'bayani-freight' },
  })

  const pulodata = await prisma.organization.upsert({
    where: { slug: 'pulo-data-registry' },
    update: {},
    create: { name: 'Pulo Data Registry', slug: 'pulo-data-registry' },
  })

  // ── Users from canonical DEMO_ACCOUNTS ──

  const jao = await prisma.user.upsert({
    where: { email: DEMO_ACCOUNTS[0].email },
    update: {},
    create: { name: DEMO_ACCOUNTS[0].name, email: DEMO_ACCOUNTS[0].email, password: PASSWORD, role: DEMO_ACCOUNTS[0].role, organizationId: luntian.id },
  })

  await prisma.user.upsert({
    where: { email: DEMO_ACCOUNTS[1].email },
    update: {},
    create: { name: DEMO_ACCOUNTS[1].name, email: DEMO_ACCOUNTS[1].email, password: PASSWORD, role: DEMO_ACCOUNTS[1].role, organizationId: talapay.id },
  })

  await prisma.user.upsert({
    where: { email: DEMO_ACCOUNTS[2].email },
    update: {},
    create: { name: DEMO_ACCOUNTS[2].name, email: DEMO_ACCOUNTS[2].email, password: PASSWORD, role: DEMO_ACCOUNTS[2].role, organizationId: bayani.id },
  })

  await prisma.user.upsert({
    where: { email: DEMO_ACCOUNTS[3].email },
    update: {},
    create: { name: DEMO_ACCOUNTS[3].name, email: DEMO_ACCOUNTS[3].email, password: PASSWORD, role: DEMO_ACCOUNTS[3].role, organizationId: pulodata.id },
  })

  // ── Documents: Luntian Health Network ──

  const luntianDocs = [
    { title: 'Regional Clinic Access Matrix', body: 'Access permissions and security clearances for all regional clinics under Luntian Health Network. Updated Q2 2026.' },
    { title: 'Vendor Security Assessment', body: 'Third-party security audit results for clinical software vendors. Includes risk ratings and remediation timelines.' },
    { title: 'Incident Response Checklist', body: 'Step-by-step incident response procedures for data breaches, system outages, and unauthorized access events.' },
    { title: 'Confidential Operations Memo', body: 'Internal memorandum regarding patient data handling protocols and updated privacy safeguards.' },
    { title: 'Patient Data Handling Protocol', body: 'Standard operating procedure for collecting, storing, and sharing patient health information across departments.' },
  ]

  for (const doc of luntianDocs) {
    await prisma.document.create({
      data: { title: doc.title, body: doc.body, organizationId: luntian.id, uploadedById: jao.id },
    })
  }

  // ── Documents: TalaPay Cooperative ──

  const talapayDocs = [
    { title: 'Member Data Handling Policy', body: 'Policies governing the collection, storage, and sharing of cooperative member personal and financial data.' },
    { title: 'Loan Review Board Notes', body: 'Minutes and decisions from the Loan Review Board meetings for Q1 and Q2 2026.' },
    { title: 'Branch Cash Audit Summary', body: 'Quarterly cash audit results across all TalaPay branches. All branches passed with no material findings.' },
    { title: 'Partner API Access Request', body: 'Access request and security review for third-party payment gateway integration.' },
  ]

  for (const doc of talapayDocs) {
    await prisma.document.create({
      data: { title: doc.title, body: doc.body, organizationId: talapay.id, uploadedById: jao.id },
    })
  }

  // ── Documents: Bayani Freight Systems ──

  const bayaniDocs = [
    { title: 'Port Clearance Procedures', body: 'Documented procedures for obtaining port clearance for international and domestic shipments.' },
    { title: 'Vendor Contract Database', body: 'Master register of all active vendor contracts, renewal dates, and security review status.' },
    { title: 'Fleet Security Assessment', body: 'Annual security assessment of fleet tracking systems, driver verification, and cargo integrity protocols.' },
    { title: 'Cargo Manifest Review', body: 'Q2 cargo manifest reconciliation report. Discrepancy rate below 0.3%.' },
  ]

  for (const doc of bayaniDocs) {
    await prisma.document.create({
      data: { title: doc.title, body: doc.body, organizationId: bayani.id, uploadedById: jao.id },
    })
  }

  // ── Documents: Pulo Data Registry ──

  const pulodataDocs = [
    { title: 'Citizen Record Schema', body: 'Master schema definition for citizen identity records, including encryption-at-rest requirements.' },
    { title: 'Data Sharing MOA', body: 'Memorandum of agreement governing cross-agency data sharing and access controls.' },
    { title: 'Registry Audit Log', body: 'System-level audit log for registry access events. Append-only with tamper detection.' },
    { title: 'Access Control Policy', body: 'Policies defining role-based access tiers for registry data consumer applications.' },
  ]

  for (const doc of pulodataDocs) {
    await prisma.document.create({
      data: { title: doc.title, body: doc.body, organizationId: pulodata.id, uploadedById: jao.id },
    })
  }

  // ── Security Settings ──

  const orgs = [luntian, talapay, bayani, pulodata]
  for (const org of orgs) {
    await prisma.securitySetting.upsert({
      where: { key_organizationId: { key: 'mfa_enabled', organizationId: org.id } },
      update: {},
      create: { key: 'mfa_enabled', value: 'true', organizationId: org.id },
    })
    await prisma.securitySetting.upsert({
      where: { key_organizationId: { key: 'session_timeout_minutes', organizationId: org.id } },
      update: {},
      create: { key: 'session_timeout_minutes', value: '60', organizationId: org.id },
    })
  }

  console.log('IslaVault seeded successfully')
}

main().catch((e) => { console.error(e); process.exit(1) })
