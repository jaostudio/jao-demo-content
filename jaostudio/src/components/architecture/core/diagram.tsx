import type { ArchitectureData } from '@/types/architecture'
import { Node } from './node'
import { Edges } from './edges'

function computeViewBox(data: ArchitectureData): string {
  const margin = 20
  const minX = Math.min(...data.nodes.map((n) => n.x)) - margin
  const maxX = Math.max(...data.nodes.map((n) => n.x + 140)) + margin
  const minY = Math.min(...data.nodes.map((n) => n.y)) - margin
  const maxY = Math.max(...data.nodes.map((n) => n.y + 36)) + margin
  return `${minX} ${minY} ${maxX - minX} ${maxY - minY}`
}

interface DiagramProps {
  data: ArchitectureData
}

export function Diagram({ data }: DiagramProps) {
  const viewBox = computeViewBox(data)

  return (
    <div className="w-full">
      <svg
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto"
        style={{ maxHeight: 520 }}
        role="img"
        aria-label="System architecture diagram"
      >
        <Edges edges={data.edges} nodes={data.nodes} />
        {data.nodes.map((node) => (
          <Node key={node.id} node={node} />
        ))}
      </svg>
    </div>
  )
}
