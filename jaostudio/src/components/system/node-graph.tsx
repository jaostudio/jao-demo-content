'use client'

import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { GraphSimulation } from '@/lib/graph/simulation'
import type { GraphNode, GraphEdge, NodeId, NodeState, EdgeState } from '@/lib/graph/types'
import { getConnectedEdges } from '@/lib/graph/selectors'
import { useMediaQuery } from '@/lib/hooks/use-media-query'
import { cn } from '@/lib/cn'

const POSITIONS: Record<NodeId, { x: number; y: number; r: number }> = {
  orchestrator: { x: 50, y: 22, r: 22 },
  platform: { x: 20, y: 55, r: 15 },
  pipeline: { x: 80, y: 55, r: 15 },
  data: { x: 30, y: 82, r: 14 },
  inference: { x: 70, y: 82, r: 14 },
}

const PARTICLE_STAGGER = [0, 0.4, 0.8, 1.2, 1.6]

const NODE_STATE_STYLES: Record<
  NodeState,
  { opacity: number; strokeWidth: number; glowColor: string }
> = {
  idle: { opacity: 0.35, strokeWidth: 0.6, glowColor: 'transparent' },
  active: { opacity: 1, strokeWidth: 1.8, glowColor: 'rgba(124,58,237,0.15)' },
  processing: { opacity: 0.9, strokeWidth: 1.2, glowColor: 'rgba(124,58,237,0.1)' },
  syncing: { opacity: 0.85, strokeWidth: 1.2, glowColor: 'rgba(217,119,6,0.1)' },
}

const NODE_FILLS: Record<NodeId, string> = {
  orchestrator: 'rgba(124,58,237,0.9)',
  platform: 'rgba(124,58,237,0.7)',
  pipeline: 'rgba(217,119,6,0.7)',
  inference: 'rgba(124,58,237,0.35)',
  data: 'rgba(124,58,237,0.25)',
}

function edgeStagger(from: NodeId, to: NodeId): number {
  const key = `${from}-${to}`
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash + key.charCodeAt(i)) | 0
  }
  return PARTICLE_STAGGER[Math.abs(hash) % PARTICLE_STAGGER.length]
}

function getThemeColors(isDark: boolean) {
  return {
    nodeFill: isDark ? 'rgba(5,5,5,0.85)' : '#FFFFFF',
    nodeText: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(17,17,20,0.9)',
    edgeIdle: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(124,58,237,0.08)',
    gridStroke: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(124,58,237,0.04)',
    compactNodeFill: isDark ? 'rgba(5,5,5,0.9)' : '#FFFFFF',
    compactNodeText: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(17,17,20,0.9)',
    compactNodeTextDim: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(17,17,20,0.7)',
    orchestratorGlow: isDark
      ? '0 0 0 1px rgba(124,58,237,0.15), 0 0 40px rgba(124,58,237,0.10)'
      : '0 0 0 1px rgba(124,58,237,0.15), 0 0 40px rgba(124,58,237,0.10)',
  }
}

function EdgePath({
  edge, connected, showParticles, colors
}: {
  edge: GraphEdge; connected: boolean; showParticles: boolean; colors: ReturnType<typeof getThemeColors>
}) {
  const from = POSITIONS[edge.from]
  const to = POSITIONS[edge.to]
  const stagger = edgeStagger(edge.from, edge.to)
  const edgeColor = edge.state === 'flowing' ? 'rgba(124,58,237,0.35)' : colors.edgeIdle

  return (
    <>
      <path
        id={`edge-${edge.from}-${edge.to}`}
        d={`M${from.x},${from.y} L${to.x},${to.y}`}
        fill="none"
        stroke={edgeColor}
        strokeWidth={edge.state === 'flowing' ? 1.2 : 0.5}
        opacity={connected ? 0.6 : 0.2}
      />
      {showParticles && edge.state === 'flowing' && (
        <>
          <circle r="1.5" fill="rgba(124,58,237,0.9)">
            <animateMotion
              dur="2.5s"
              begin={`${stagger}s`}
              repeatCount="indefinite"
            >
              <mpath href={`#edge-${edge.from}-${edge.to}`} />
            </animateMotion>
          </circle>
          <circle r="1" fill="rgba(217,119,6,0.7)">
            <animateMotion
              dur="2.5s"
              begin={`${stagger + 1.25}s`}
              repeatCount="indefinite"
            >
              <mpath href={`#edge-${edge.from}-${edge.to}`} />
            </animateMotion>
          </circle>
        </>
      )}
    </>
  )
}

function NodeCircle({
  node, isActiveNode, onHover, showEffects, colors
}: {
  node: GraphNode; isActiveNode: boolean; onHover: (id: NodeId | null) => void; showEffects: boolean; colors: ReturnType<typeof getThemeColors>
}) {
  const pos = POSITIONS[node.id]
  const style = NODE_STATE_STYLES[node.state]
  const fill = NODE_FILLS[node.id]

  const isGlowing = showEffects && (node.state === 'active' || node.state === 'syncing')
  const glowRadius = pos.r + (node.state === 'active' ? 10 : 6)

  return (
    <g
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      className="cursor-pointer"
      opacity={!isActiveNode && node.state === 'idle' ? 0.45 : 1}
    >
      {isGlowing && (
        <circle
          cx={pos.x}
          cy={pos.y}
          r={glowRadius}
          fill="none"
          stroke={style.glowColor}
          strokeWidth={3}
          opacity={0.3}
          className={node.state === 'syncing' && showEffects ? 'animate-pulse' : ''}
          style={node.state === 'syncing' && showEffects ? { animationDuration: '1.5s' } : undefined}
        />
      )}
      <circle
        cx={pos.x}
        cy={pos.y}
        r={pos.r}
        fill={colors.nodeFill}
        stroke={fill}
        strokeWidth={style.strokeWidth}
      />
      <text
        x={pos.x}
        y={pos.y + 0.4}
        textAnchor="middle"
        dominantBaseline="central"
        fill={colors.nodeText}
        fontSize={node.id === 'orchestrator' ? 7 : 6}
        fontWeight="500"
        letterSpacing="0.05em"
        fontFamily="Geist Sans, system-ui, sans-serif"
        stroke={colors.nodeFill}
        strokeWidth={1.5}
        paintOrder="stroke"
      >
        {node.label}
      </text>
    </g>
  )
}

export function NodeGraph({
  className,
  sim: externalSim,
  compact,
}: {
  className?: string
  sim?: GraphSimulation
  compact?: boolean
}) {
  const prefersReducedMotion = useReducedMotion()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const showEffects = !prefersReducedMotion && !isMobile && !compact
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const colors = getThemeColors(isDark)

  const internalSim = useMemo(() => {
    if (isMobile) return undefined
    return new GraphSimulation()
  }, [isMobile])
  const sim = externalSim ?? internalSim
  const ownsSim = useRef(!externalSim)
  const [state, setState] = useState(() => sim?.getState() ?? { nodes: [], edges: [], activeNode: null as NodeId | null })
  const mountedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true
    const shouldDestroy = ownsSim.current && !isMobile
    const unsub = sim?.subscribe((s) => {
      if (mountedRef.current) setState(s)
    })
    return () => {
      mountedRef.current = false
      void unsub?.()
      if (shouldDestroy) sim?.destroy()
    }
  }, [sim, isMobile])

  const handleHover = useCallback((id: NodeId | null) => sim?.hoverNode(id), [sim])

  const activeEdges = state.activeNode ? getConnectedEdges(state.edges, state.activeNode) : []

  const staticNodes: GraphNode[] = useMemo(
    () =>
      (Object.keys(POSITIONS) as NodeId[]).map((id) => ({
        id,
        label: id.charAt(0).toUpperCase() + id.slice(1, 8),
        state: 'idle' as NodeState,
      })),
    [],
  )

  const displayNodes = (isMobile || compact) ? staticNodes : state.nodes

  if (compact || isMobile) {
    return (
      <div className={cn('relative', className)}>
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <rect width="100" height="100" fill="none" />
          <line x1="50" y1="25" x2="25" y2="60" stroke="rgba(124,58,237,0.25)" strokeWidth="0.8" />
          <line x1="50" y1="25" x2="75" y2="60" stroke="rgba(217,119,6,0.25)" strokeWidth="0.8" />
          <circle cx="50" cy="25" r="14" fill={colors.compactNodeFill} stroke="rgba(124,58,237,0.8)" strokeWidth="1.2" />
          <text x="50" y="25" textAnchor="middle" dominantBaseline="central" fill={colors.compactNodeText} fontSize={5.5} fontWeight="600" letterSpacing="0.05em" fontFamily="Geist Sans, system-ui, sans-serif">Orch</text>
          <circle cx="25" cy="60" r="11" fill={colors.compactNodeFill} stroke="rgba(124,58,237,0.6)" strokeWidth="0.8" />
          <text x="25" y="60" textAnchor="middle" dominantBaseline="central" fill={colors.compactNodeTextDim} fontSize={4.5} fontWeight="500" fontFamily="Geist Sans, system-ui, sans-serif">Platform</text>
          <circle cx="75" cy="60" r="11" fill={colors.compactNodeFill} stroke="rgba(217,119,6,0.6)" strokeWidth="0.8" />
          <text x="75" y="60" textAnchor="middle" dominantBaseline="central" fill={colors.compactNodeTextDim} fontSize={4.5} fontWeight="500" fontFamily="Geist Sans, system-ui, sans-serif">Pipeline</text>
        </svg>
        <p className="mt-2 text-center text-[10px] uppercase tracking-[0.2em] text-text-secondary/50">
          Operational system topology
        </p>
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <defs>
          <pattern id="graph-grid" width="16" height="16" patternUnits="userSpaceOnUse">
            <path
              d="M 16 0 L 0 0 0 16"
              fill="none"
              stroke={colors.gridStroke}
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#graph-grid)" />
        {state.edges.map((edge) => (
          <EdgePath
            key={`${edge.from}-${edge.to}`}
            edge={edge}
            connected={!!activeEdges.find((e) => e.from === edge.from && e.to === edge.to)}
            showParticles={showEffects}
            colors={colors}
          />
        ))}
        {displayNodes.map((node) => (
          <NodeCircle
            key={node.id}
            node={node}
            isActiveNode={state.activeNode === node.id}
            onHover={handleHover}
            showEffects={showEffects}
            colors={colors}
          />
        ))}
      </svg>
      <p className="mt-2 text-center text-[10px] uppercase tracking-[0.2em] text-text-secondary/50">
        Operational system topology
      </p>
    </div>
  )
}
