'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, X, Shield, User, Fingerprint, Database, ScrollText, Lock, Unlock, MapPin } from 'lucide-react'

type ProofContextType = {
  isOpen: boolean
  open: () => void
  close: () => void
}

const ProofContext = createContext<ProofContextType>({
  isOpen: false,
  open: () => {},
  close: () => {},
})

export function useSecurityProof() {
  return useContext(ProofContext)
}

const rolePermissions: Record<string, { allowed: string[]; denied: string[] }> = {
  SYSTEM_ADMIN: {
    allowed: [
      'View all organizations',
      'Manage users',
      'Manage organizations',
      'View audit logs',
      'Access Security Lab',
      'Edit documents',
      'Delete documents',
      'View settings',
    ],
    denied: [],
  },
  ORG_ADMIN: {
    allowed: [
      'View own org documents',
      'Create documents',
      'Edit documents',
      'Delete documents',
      'View audit logs',
      'Access Security Lab',
      'View settings',
    ],
    denied: ['Manage users', 'Manage organizations', 'System administration'],
  },
  ORG_USER: {
    allowed: [
      'View own org documents',
      'Create documents',
      'Access Security Lab',
      'View audit logs',
    ],
    denied: [
      'Edit documents',
      'Delete documents',
      'Manage users',
      'Manage organizations',
      'System administration',
      'View settings',
    ],
  },
}

const pageLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/documents': 'Documents',
  '/audit': 'Audit Trail',
  '/security-lab': 'Security Lab',
  '/settings': 'Settings',
  '/admin/users': 'Admin — Users',
  '/admin/organizations': 'Admin — Organizations',
}

function getPageLabel(path: string) {
  if (pageLabels[path]) return pageLabels[path]
  if (path.startsWith('/documents/')) return 'Document Detail'
  if (path.startsWith('/admin/')) return 'Admin'
  return path
}

type ProofData = {
  user: { name: string | null; email: string | null; role: string | null; orgId: string | null; orgName: string | null }
  latestAuditEvent: { id: string; action: string; createdAt: string; user: string } | null
  sessionSource: string
  database: string
  timestamp: string
}

function SecurityProofPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [data, setData] = useState<ProofData | null>(null)
  const [loading, setLoading] = useState(false)

  const currentUser = session?.user as any

  useEffect(() => {
    if (isOpen && !data) {
      setLoading(true)
      fetch('/api/security/proof-context')
        .then((r) => r.json())
        .then((d) => setData(d))
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [isOpen, data])

  const perms = rolePermissions[currentUser?.role] ?? { allowed: [], denied: [] }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-black/40"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-full w-80 border-l border-isla-border bg-isla-glass/95 backdrop-blur-xl overflow-y-auto"
          >
            <div className="p-4 border-b border-isla-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-isla-amethyst" />
                <span className="text-sm font-semibold text-isla-white">Security Proof</span>
              </div>
              <button onClick={onClose} className="text-isla-muted hover:text-isla-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-5 text-xs">
              <Section title="User" icon={<User className="w-3 h-3" />}>
                <Row label="Name" value={currentUser?.name ?? '—'} />
                <Row label="Email" value={currentUser?.email ?? '—'} />
              </Section>

              <Section title="Role" icon={<Shield className="w-3 h-3" />}>
                <Row label="Role" value={currentUser?.role ?? '—'} />
                <Row label="Tenant" value={currentUser?.orgName ?? 'Global Control Plane'} />
              </Section>

              <Section title="Session" icon={<Fingerprint className="w-3 h-3" />}>
                <Row label="orgId" value={currentUser?.orgId ?? '(none)'} mono />
                <Row label="Source" value={loading ? 'Loading...' : (data?.sessionSource ?? '—')} />
              </Section>

              <Section title="Access" icon={perms.denied.length > 0 ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}>
                <div>
                  <div className="text-isla-success mb-1">Allowed:</div>
                  {perms.allowed.map((a) => (
                    <div key={a} className="text-isla-muted pl-3">+ {a}</div>
                  ))}
                </div>
                {perms.denied.length > 0 && (
                  <div className="mt-2">
                    <div className="text-isla-danger mb-1">Denied:</div>
                    {perms.denied.map((a) => (
                      <div key={a} className="text-isla-muted pl-3">— {a}</div>
                    ))}
                  </div>
                )}
              </Section>

              <Section title="Scope" icon={<MapPin className="w-3 h-3" />}>
                <Row label="Current page" value={getPageLabel(pathname)} />
                <Row label="Query scope" value={currentUser?.orgId ? `organizationId = ${currentUser.orgId.slice(0, 12)}... (tenant-scoped)` : 'global (SYSTEM_ADMIN)'} />
              </Section>

              <Section title="Latest Audit Event" icon={<ScrollText className="w-3 h-3" />}>
                {loading ? (
                  <div className="text-isla-muted">Loading...</div>
                ) : data?.latestAuditEvent ? (
                  <>
                    <Row label="Action" value={data.latestAuditEvent.action} />
                    <Row label="By" value={data.latestAuditEvent.user} />
                    <Row label="Time" value={new Date(data.latestAuditEvent.createdAt).toLocaleString()} />
                  </>
                ) : (
                  <div className="text-isla-muted">No audit events yet</div>
                )}
              </Section>

              <Section title="Infrastructure" icon={<Database className="w-3 h-3" />}>
                <Row label="Database" value={data?.database ?? 'Turso/libSQL'} />
                <Row label="Auth" value="NextAuth.js (JWT)" />
              </Section>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function Section({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-isla-amethyst font-medium mb-2">
        {icon}
        <span>{title}</span>
      </div>
      <div className="space-y-1 pl-5">{children}</div>
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-isla-muted shrink-0">{label}:</span>
      <span className={`text-isla-white text-right truncate ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  )
}

export function SecurityProofProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  return (
    <ProofContext.Provider value={{ isOpen, open, close }}>
      {children}
      <SecurityProofPanel isOpen={isOpen} onClose={close} />
    </ProofContext.Provider>
  )
}
