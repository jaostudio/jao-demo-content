'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const tabs = [
  {
    id: 'isolation',
    label: 'Tenant Isolation',
    request: 'GET /documents/doc_talapay_001',
    session: 'organizationId = org_luntian',
    dbScope: 'WHERE organizationId = org_luntian',
    result: '404 BLOCKED',
    audit: 'CROSS_TENANT_ACCESS_DENIED',
  },
  {
    id: 'rbac',
    label: 'RBAC Enforcement',
    request: 'POST /api/organizations',
    session: 'role = ORG_USER',
    dbScope: 'requireSystemAdmin(user) → FAILED',
    result: '403 FORBIDDEN',
    audit: 'ADMIN_ACTION_DENIED',
  },
  {
    id: 'audit',
    label: 'Audit Trail',
    request: 'PATCH /audit_events/evt_001',
    session: 'no direct write access',
    dbScope: 'AuditEvent table — append only',
    result: '405 METHOD NOT ALLOWED',
    audit: 'AUDIT_TAMPER_DENIED',
  },
]

export function InteractiveProductPreview() {
  const [active, setActive] = useState('isolation')

  return (
    <div className="glass-card-static overflow-hidden">
      <div className="flex border-b border-isla-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              'flex-1 px-4 py-3 text-sm font-medium transition-colors relative',
              active === tab.id ? 'text-isla-violet' : 'text-isla-muted hover:text-isla-white',
            )}
          >
            {tab.label}
            {active === tab.id && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-isla-violet"
              />
            )}
          </button>
        ))}
      </div>
      <div className="p-5">
        <AnimatePresence mode="wait">
          {tabs.map((tab) =>
            tab.id === active ? (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <div className="space-y-1.5">
                  {[
                    { label: 'Request', value: tab.request, color: 'text-isla-white' },
                    { label: 'Session', value: tab.session, color: 'text-isla-pacific' },
                    { label: 'Database Scope', value: tab.dbScope, color: 'text-isla-violet' },
                  ].map((row) => (
                    <div key={row.label} className="flex items-start gap-3">
                      <span className="text-xs text-isla-muted w-24 shrink-0 mono">{row.label}</span>
                      <span className={cn('text-xs mono', row.color)}>{row.value}</span>
                    </div>
                  ))}
                  <div className="flex items-start gap-3 pt-1 border-t border-isla-border mt-2">
                    <span className="text-xs text-isla-muted w-24 shrink-0 mono">Result</span>
                    <span className="text-xs mono text-isla-danger font-semibold">{tab.result}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-xs text-isla-muted w-24 shrink-0 mono">Audit</span>
                    <span className="text-xs mono text-isla-success">{tab.audit}</span>
                  </div>
                </div>
              </motion.div>
            ) : null,
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
