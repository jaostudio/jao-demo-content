import { PrismaClient } from '@prisma/security-client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import bcrypt from 'bcryptjs'

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? 'file:./dev.db',
})
const prisma = new PrismaClient({ adapter })

const PASSWORD = bcrypt.hashSync('password123', 10)

async function main() {
  // ── Organizations ──

  const luntian = await prisma.organization.upsert({
    where: { slug: 'luntian-health' },
    update: {},
    create: { name: 'Luntian Health Network', slug: 'luntian-health' },
  })

  const talapay = await prisma.organization.upsert({
    where: { slug: 'talapay-cooperative' },
    update: {},
    create: { name: 'TalaPay Cooperative', slug: 'talapay-cooperative' },
  })

  const bayani = await prisma.organization.upsert({
    where: { slug: 'bayani-freight' },
    update: {},
    create: { name: 'Bayani Freight Systems', slug: 'bayani-freight' },
  })

  const sampaguita = await prisma.organization.upsert({
    where: { slug: 'sampaguita-export' },
    update: {},
    create: { name: 'Sampaguita Export House', slug: 'sampaguita-export' },
  })

  // ── Users ──

  const maria = await prisma.user.upsert({
    where: { email: 'maria@luntian.demo' },
    update: {},
    create: { name: 'Maria Santos', email: 'maria@luntian.demo', password: PASSWORD, role: 'ORG_ADMIN', organizationId: luntian.id },
  })

  await prisma.user.upsert({
    where: { email: 'paolo@luntian.demo' },
    update: {},
    create: { name: 'Paolo Reyes', email: 'paolo@luntian.demo', password: PASSWORD, role: 'ORG_USER', organizationId: luntian.id },
  })

  await prisma.user.upsert({
    where: { email: 'ana@talapay.demo' },
    update: {},
    create: { name: 'Ana Villarin', email: 'ana@talapay.demo', password: PASSWORD, role: 'ORG_USER', organizationId: talapay.id },
  })

  await prisma.user.upsert({
    where: { email: 'rafael@islavault.demo' },
    update: {},
    create: { name: 'Rafael Cruz', email: 'rafael@islavault.demo', password: PASSWORD, role: 'SYSTEM_ADMIN' },
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
      data: { title: doc.title, body: doc.body, organizationId: luntian.id, uploadedById: maria.id },
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
      data: { title: doc.title, body: doc.body, organizationId: talapay.id, uploadedById: maria.id },
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
      data: { title: doc.title, body: doc.body, organizationId: bayani.id, uploadedById: maria.id },
    })
  }

  // ── Documents: Sampaguita Export House ──

  const sampaguitaDocs = [
    { title: 'Supplier Agreement Records', body: 'All active supplier agreements, NDAs, and data processing addendums for export operations.' },
    { title: 'Compliance Filing Status', body: 'Current compliance filing status for all export destinations. Updated after Q1 regulatory review.' },
    { title: 'Export License Documentation', body: 'Active export licenses, permits, and certifications required for cross-border shipments.' },
    { title: 'Quality Control Reports', body: 'Monthly quality control audit reports for outgoing shipments. Average pass rate: 98.7%.' },
  ]

  for (const doc of sampaguitaDocs) {
    await prisma.document.create({
      data: { title: doc.title, body: doc.body, organizationId: sampaguita.id, uploadedById: maria.id },
    })
  }

  // ── Security Settings ──

  const orgs = [luntian, talapay, bayani, sampaguita]
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
