import type { ArchitectureEdge, ArchitectureNode } from '@/types/architecture'
import { NODE_WIDTH, NODE_HEIGHT } from './node'

function nodeBottomCenter(n: ArchitectureNode) {
  return { x: n.x + NODE_WIDTH / 2, y: n.y + NODE_HEIGHT }
}

function nodeTopCenter(n: ArchitectureNode) {
  return { x: n.x + NODE_WIDTH / 2, y: n.y }
}

function buildPath(from: ArchitectureNode, to: ArchitectureNode): string {
  const f = nodeBottomCenter(from)
  const t = nodeTopCenter(to)

  if (f.x === t.x) {
    return `M ${f.x} ${f.y} L ${t.x} ${t.y}`
  }

  const midY = (f.y + t.y) / 2
  return `M ${f.x} ${f.y} L ${f.x} ${midY} L ${t.x} ${midY} L ${t.x} ${t.y}`
}

function buildBranchPath(
  sources: ArchitectureNode[],
  targets: ArchitectureNode[],
): string[] {
  const paths: string[] = []

  if (sources.length === 1 && targets.length === 1) {
    paths.push(buildPath(sources[0], targets[0]))
    return paths
  }

  if (sources.length === 1 && targets.length > 1) {
    const src = nodeBottomCenter(sources[0])
    const targetTops = targets.map((t) => nodeTopCenter(t))
    const minY = Math.min(...targetTops.map((t) => t.y))
    const branchY = src.y + (minY - src.y) * 0.5
    const leftX = Math.min(...targetTops.map((t) => t.x))
    const rightX = Math.max(...targetTops.map((t) => t.x))

    paths.push(`M ${src.x} ${src.y} L ${src.x} ${branchY}`)
    paths.push(`M ${leftX} ${branchY} L ${rightX} ${branchY}`)

    for (const t of targetTops) {
      paths.push(`M ${t.x} ${branchY} L ${t.x} ${t.y}`)
    }

    return paths
  }

  if (sources.length > 1 && targets.length === 1) {
    const tgt = nodeTopCenter(targets[0])
    const sourceBottoms = sources.map((s) => nodeBottomCenter(s))
    const maxY = Math.max(...sourceBottoms.map((s) => s.y))
    const mergeY = maxY + (tgt.y - maxY) * 0.5
    const leftX = Math.min(...sourceBottoms.map((s) => s.x))
    const rightX = Math.max(...sourceBottoms.map((s) => s.x))

    for (const s of sourceBottoms) {
      paths.push(`M ${s.x} ${s.y} L ${s.x} ${mergeY}`)
    }
    paths.push(`M ${leftX} ${mergeY} L ${rightX} ${mergeY}`)
    paths.push(`M ${tgt.x} ${mergeY} L ${tgt.x} ${tgt.y}`)

    return paths
  }

  for (const s of sources) {
    for (const t of targets) {
      paths.push(buildPath(s, t))
    }
  }

  return paths
}

export function Edges({
  edges,
  nodes,
}: {
  edges: ArchitectureEdge[]
  nodes: ArchitectureNode[]
}) {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]))
  const pathStrings: string[] = []

  const outgoing = new Map<string, ArchitectureEdge[]>()
  const incoming = new Map<string, ArchitectureEdge[]>()

  for (const edge of edges) {
    const out = outgoing.get(edge.from) ?? []
    out.push(edge)
    outgoing.set(edge.from, out)

    const inc = incoming.get(edge.to) ?? []
    inc.push(edge)
    incoming.set(edge.to, inc)
  }

  const handled = new Set<string>()

  for (const [fromId, fromEdges] of outgoing) {
    if (fromEdges.length > 1) {
      const source = nodeMap.get(fromId)
      if (!source) continue
      const targets = fromEdges
        .map((e) => nodeMap.get(e.to))
        .filter((n): n is ArchitectureNode => !!n)
      for (const path of buildBranchPath([source], targets)) {
        pathStrings.push(path)
      }
      for (const e of fromEdges) handled.add(`${e.from}→${e.to}`)
    }
  }

  for (const [toId, toEdges] of incoming) {
    if (toEdges.length > 1) {
      const unhandled = toEdges.filter((e) => !handled.has(`${e.from}→${e.to}`))
      if (unhandled.length > 0) {
        const target = nodeMap.get(toId)
        if (!target) continue
        const sources = unhandled
          .map((e) => nodeMap.get(e.from))
          .filter((n): n is ArchitectureNode => !!n)
        for (const path of buildBranchPath(sources, [target])) {
          pathStrings.push(path)
        }
        for (const e of unhandled) handled.add(`${e.from}→${e.to}`)
      }
    }
  }

  for (const edge of edges) {
    if (handled.has(`${edge.from}→${edge.to}`)) continue
    const source = nodeMap.get(edge.from)
    const target = nodeMap.get(edge.to)
    if (!source || !target) continue
    pathStrings.push(buildPath(source, target))
  }

  return (
    <g>
      {pathStrings.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="var(--border)"
          strokeWidth={1}
        />
      ))}
    </g>
  )
}
