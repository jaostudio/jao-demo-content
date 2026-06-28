'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface CheckStep {
  label: string
  passed: boolean
}

interface AccessDecisionProps {
  result: 'ALLOWED' | 'DENIED'
  steps: CheckStep[]
  reason?: string
  sessionOrg?: string
  targetOrg?: string
  responseCode?: number
  className?: string
}

function StepRow({ label, passed, delay }: CheckStep & { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.2 }}
      className="flex items-center justify-between py-1.5"
    >
      <span className="text-sm text-isla-muted mono">{label}</span>
      <span
        className={cn(
          'text-xs font-semibold mono',
          passed ? 'text-isla-success' : 'text-isla-danger',
        )}
      >
        {passed ? 'PASSED' : 'FAILED'}
      </span>
    </motion.div>
  )
}

export function AccessDecision({
  result,
  steps,
  reason,
  sessionOrg,
  targetOrg,
  responseCode,
  className,
}: AccessDecisionProps) {
  const isAllowed = result === 'ALLOWED'

  return (
    <div
      className={cn(
        'glass-card-static overflow-hidden',
        isAllowed ? 'border-isla-success/20' : 'border-isla-danger/20',
        className,
      )}
    >
      <div
        className={cn(
          'px-4 py-2.5 border-b text-xs font-semibold uppercase tracking-wider flex items-center gap-2',
          isAllowed ? 'bg-isla-success/5 border-isla-success/20 text-isla-success' : 'bg-isla-danger/5 border-isla-danger/20 text-isla-danger',
        )}
      >
        <span className={cn('status-dot', isAllowed ? 'status-dot-success' : 'status-dot-danger')} />
        Access Decision
      </div>

      <div className="p-4 space-y-2">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'text-center py-3 rounded-lg text-lg font-bold tracking-wide',
            isAllowed ? 'bg-isla-success/10 text-isla-success' : 'bg-isla-danger/10 text-isla-danger',
          )}
        >
          Result: {result}
        </motion.div>

        <div className="border-t border-isla-border pt-3 mt-3 space-y-0.5">
          {steps.map((step, i) => (
            <StepRow key={step.label} {...step} delay={0.15 + i * 0.08} />
          ))}
        </div>

        {reason && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.2 }}
            className="pt-2 text-xs text-isla-muted mono"
          >
            Reason: {reason}
          </motion.div>
        )}

        {sessionOrg && targetOrg && sessionOrg !== targetOrg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.2 }}
            className="space-y-1 pt-1 text-xs mono"
          >
            <div className="flex justify-between">
              <span className="text-isla-muted">Session Org</span>
              <span className="text-isla-white">{sessionOrg}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-isla-muted">Target Org</span>
              <span className="text-isla-coral">{targetOrg}</span>
            </div>
          </motion.div>
        )}

        {responseCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.2 }}
            className="flex justify-between text-xs mono pt-1"
          >
            <span className="text-isla-muted">Response</span>
            <span className={cn(responseCode >= 400 ? 'text-isla-danger' : 'text-isla-success')}>
              {responseCode}
            </span>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.2 }}
          className="flex justify-between text-xs mono pt-1"
        >
          <span className="text-isla-muted">Audit Event</span>
          <span className="text-isla-success">RECORDED</span>
        </motion.div>
      </div>
    </div>
  )
}
