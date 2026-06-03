import type { GraphNode, GraphEdge, NodeId } from './types'

export function getActiveNode(
  nodes: GraphNode[],
  activeNode: NodeId | null,
): GraphNode | null {
  if (!activeNode) return null
  return nodes.find((n) => n.id === activeNode) ?? null
}

export function getConnectedEdges(
  edges: GraphEdge[],
  nodeId: NodeId,
): GraphEdge[] {
  return edges.filter((e) => e.from === nodeId || e.to === nodeId)
}

export function getAdjacentNodes(
  edges: GraphEdge[],
  nodeId: NodeId,
): NodeId[] {
  const adjacent = new Set<NodeId>()
  edges.forEach((e) => {
    if (e.from === nodeId) adjacent.add(e.to)
    if (e.to === nodeId) adjacent.add(e.from)
  })
  return Array.from(adjacent)
}
