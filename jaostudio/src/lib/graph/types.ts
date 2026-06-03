export type NodeId =
  | 'orchestrator'
  | 'platform'
  | 'pipeline'
  | 'inference'
  | 'data'

export type NodeState = 'idle' | 'active' | 'processing' | 'syncing'

export type EdgeState = 'idle' | 'flowing'

export interface GraphNode {
  id: NodeId
  label: string
  state: NodeState
  metrics?: {
    uptime?: number
    load?: number
    throughput?: number
  }
}

export interface GraphEdge {
  from: NodeId
  to: NodeId
  state: EdgeState
  intensity: number
}

export interface GraphState {
  nodes: GraphNode[]
  edges: GraphEdge[]
  activeNode: NodeId | null
}
