export type ArchNodeType = 'client' | 'edge' | 'api' | 'db' | 'external' | 'cache' | 'auth' | 'static' | 'validation'

export interface ArchitectureNode {
  id: string
  label: string
  type: ArchNodeType
  x: number
  y: number
}

export interface ArchitectureEdge {
  from: string
  to: string
  label?: string
}

export interface ArchitectureData {
  nodes: ArchitectureNode[]
  edges: ArchitectureEdge[]
}
