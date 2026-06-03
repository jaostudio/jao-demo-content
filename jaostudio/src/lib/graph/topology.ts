import type { GraphNode, GraphEdge } from './types'

export const initialNodes: GraphNode[] = [
  { id: 'orchestrator', label: 'Orchestrator', state: 'idle' },
  { id: 'platform', label: 'Platform Layer', state: 'idle' },
  { id: 'pipeline', label: 'Pipeline Engine', state: 'idle' },
  { id: 'inference', label: 'Inference Engine', state: 'idle' },
  { id: 'data', label: 'Data Lake', state: 'idle' },
]

export const initialEdges: GraphEdge[] = [
  { from: 'orchestrator', to: 'platform', state: 'idle', intensity: 0 },
  { from: 'orchestrator', to: 'pipeline', state: 'idle', intensity: 0 },
  { from: 'platform', to: 'data', state: 'idle', intensity: 0 },
  { from: 'pipeline', to: 'inference', state: 'idle', intensity: 0 },
  { from: 'data', to: 'inference', state: 'idle', intensity: 0 },
]
