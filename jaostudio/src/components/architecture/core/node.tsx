import type { ArchitectureNode } from '@/types/architecture'

const NODE_WIDTH = 140
const NODE_HEIGHT = 36

const typeStyles: Record<string, { stroke: string; fill: string; dashed?: boolean }> = {
  client: { stroke: 'var(--accent)', fill: 'rgba(124,58,237,0.08)' },
  edge: { stroke: 'var(--accent)', fill: 'transparent' },
  api: { stroke: 'var(--text-secondary)', fill: 'transparent' },
  db: { stroke: 'var(--text-tertiary)', fill: 'transparent' },
  external: { stroke: 'var(--text-tertiary)', fill: 'transparent', dashed: true },
  cache: { stroke: 'var(--accent-warm)', fill: 'transparent' },
  auth: { stroke: 'var(--accent-warm)', fill: 'transparent', dashed: true },
  static: { stroke: 'var(--text-secondary)', fill: 'transparent' },
  validation: { stroke: 'var(--accent-warm)', fill: 'transparent' },
}

export function Node({ node }: { node: ArchitectureNode }) {
  const style = typeStyles[node.type] ?? typeStyles.api

  return (
    <g>
      <rect
        x={node.x}
        y={node.y}
        width={NODE_WIDTH}
        height={NODE_HEIGHT}
        rx={6}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={1}
        strokeDasharray={style.dashed ? '4 3' : undefined}
      />
      <text
        x={node.x + NODE_WIDTH / 2}
        y={node.y + NODE_HEIGHT / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--text-primary)"
        fontSize={11}
        fontFamily="Geist, system-ui, sans-serif"
      >
        {node.label}
      </text>
    </g>
  )
}

export { NODE_WIDTH, NODE_HEIGHT }
