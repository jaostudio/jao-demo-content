'use client'

import { motion } from 'framer-motion'

interface Island {
  name: string
  x: number
  y: number
  label: string
}

const islands: Island[] = [
  { name: 'Luntian Health Network', x: 120, y: 110, label: 'Luntian Health' },
  { name: 'TalaPay Cooperative', x: 380, y: 100, label: 'TalaPay' },
  { name: 'Bayani Freight Systems', x: 90, y: 280, label: 'Bayani Freight' },
  { name: 'Sampaguita Export House', x: 400, y: 290, label: 'Sampaguita Export' },
]

const statusBadges = [
  { label: 'TENANT BOUNDARY ACTIVE', x: 250, y: 30, color: '#38BDF8' },
  { label: 'RBAC ENFORCED', x: 250, y: 48, color: '#A78BFA' },
  { label: 'AUDIT STREAM LIVE', x: 250, y: 66, color: '#22C55E' },
  { label: 'TURSO CONNECTED', x: 250, y: 84, color: '#8B5CF6' },
]

export function ArchipelagoMap() {
  return (
    <div className="relative w-full max-w-[520px] mx-auto">
      <svg viewBox="0 0 520 400" className="w-full h-auto" role="img" aria-label="IslaVault archipelago security map">
        <defs>
          <radialGradient id="violet-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="blue-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="success-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22C55E" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-strong">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background water */}
        <rect x="0" y="0" width="520" height="400" fill="none" />

        {/* Grid lines */}
        <g opacity="0.06" stroke="#A78BFA" strokeWidth="0.5">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <line key={`h${i}`} x1="0" y1={i * 80} x2="520" y2={i * 80} />
          ))}
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <line key={`v${i}`} x1={i * 86} y1="0" x2={i * 86} y2="400" />
          ))}
        </g>

        {/* Allowed paths - islands to Turso core */}
        <motion.g
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 1, ease: 'easeInOut' }}
          fill="none"
          stroke="#8B5CF6"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          opacity="0.5"
        >
          <path d="M175 155 Q220 190 250 200" />
          <path d="M340 150 Q290 190 260 200" />
          <path d="M160 280 Q200 240 250 210" />
          <path d="M355 285 Q310 240 260 210" />
        </motion.g>

        {/* Cross-tenant blocked path */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 0.5 }}
        >
          <line x1="250" y1="200" x2="380" y2="100" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" filter="url(#glow)" />
          <text x="300" y="155" fill="#EF4444" fontSize="8" textAnchor="middle" opacity="0.8">BLOCKED</text>
          <text x="350" y="140" fill="#EF4444" fontSize="6" textAnchor="middle" opacity="0.5" fontFamily="monospace">CROSS-TENANT</text>
          {/* X mark */}
          <line x1="290" y1="160" x2="300" y2="170" stroke="#EF4444" strokeWidth="2" opacity="0.7" />
          <line x1="300" y1="160" x2="290" y2="170" stroke="#EF4444" strokeWidth="2" opacity="0.7" />
        </motion.g>

        {/* Turso database core */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6, type: 'spring' }}
        >
          <circle cx="250" cy="195" r="36" fill="url(#violet-glow)" />
          <circle cx="250" cy="195" r="24" fill="#141725" stroke="#8B5CF6" strokeWidth="1.5" filter="url(#glow)" />
          <text x="250" y="191" fill="#A78BFA" fontSize="9" textAnchor="middle" fontWeight="bold" fontFamily="monospace">TURSO</text>
          <text x="250" y="202" fill="#A78BFA" fontSize="7" textAnchor="middle" fontFamily="monospace">DATABASE</text>
        </motion.g>

        {/* Islands */}
        {islands.map((island) => {
          const islandDelay = 0.3
          return (
            <motion.g
              key={island.name}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: islandDelay, duration: 0.5, type: 'spring' }}
            >
              {/* Island glow */}
              <ellipse cx={island.x + 5} cy={island.y + 8} rx="48" ry="28" fill="url(#blue-glow)" />
              {/* Island body */}
              <ellipse cx={island.x} cy={island.y} rx="44" ry="24" fill="#1B2033" stroke="rgba(56,189,248,0.3)" strokeWidth="1" />
              {/* Island label */}
              <text x={island.x} y={island.y - 2} fill="#F8FAFC" fontSize="9" textAnchor="middle" fontWeight="600">{island.label}</text>
              <text x={island.x} y={island.y + 10} fill="#94A3B8" fontSize="6" textAnchor="middle" fontFamily="monospace">TENANT-SCOPED</text>
            </motion.g>
          )
        })}

        {/* Status badges */}
        <motion.g
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.5 }}
        >
          {statusBadges.map((badge) => (
            <g key={badge.label}>
              <rect
                x={badge.x - 60}
                y={badge.y}
                width="120"
                height="14"
                rx="3"
                fill="rgba(20,23,37,0.85)"
                stroke={`${badge.color}33`}
                strokeWidth="0.5"
              />
              <circle cx={badge.x - 53} cy={badge.y + 7} r="2.5" fill={badge.color} filter="url(#glow)" />
              <text x={badge.x - 46} y={badge.y + 9.5} fill={badge.color} fontSize="6.5" fontWeight="600" fontFamily="monospace" letterSpacing="1">
                {badge.label}
              </text>
            </g>
          ))}
        </motion.g>
      </svg>
    </div>
  )
}
