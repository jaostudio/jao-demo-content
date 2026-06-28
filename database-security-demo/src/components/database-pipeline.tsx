'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const steps = [
  { label: 'Auth Session', desc: 'JWT validated', icon: '🔑' },
  { label: 'RBAC Guard', desc: 'Role checked', icon: '🛡️' },
  { label: 'Tenant Scope', desc: 'orgId resolved', icon: '🏝️' },
  { label: 'Turso Query', desc: 'SQL executed', icon: '🗄️' },
  { label: 'Audit Event', desc: 'Action logged', icon: '📋' },
]

export function DatabasePipeline() {
  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <motion.div
          key={step.label}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.12, duration: 0.4 }}
          className="flex items-center gap-4 py-3"
        >
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center text-sm border shrink-0',
            'bg-isla-glass border-isla-border',
          )}>
            {step.icon}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-isla-white">{step.label}</div>
            <div className="text-xs text-isla-muted">{step.desc}</div>
          </div>
          {i < steps.length - 1 && (
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: 24 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 + 0.2, duration: 0.3 }}
              className="w-px bg-isla-border mx-auto"
            />
          )}
        </motion.div>
      ))}
    </div>
  )
}
