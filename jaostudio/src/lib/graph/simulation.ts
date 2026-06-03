import type { GraphNode, GraphEdge, NodeId, GraphState } from './types'
import { initialNodes, initialEdges } from './topology'

type Listener = (state: GraphState) => void

export class GraphSimulation {
  private state: GraphState
  private listeners = new Set<Listener>()
  private intervals = new Set<ReturnType<typeof setInterval>>()
  private timeouts = new Set<ReturnType<typeof setTimeout>>()

  constructor() {
    this.state = {
      nodes: initialNodes.map((n) => ({ ...n })),
      edges: initialEdges.map((e) => ({ ...e })),
      activeNode: null,
    }
    this.startAmbientDrift()
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn)
    fn(this.state)
    return () => this.listeners.delete(fn)
  }

  getState(): GraphState {
    return this.state
  }

  private emit() {
    this.listeners.forEach((fn) => fn(this.state))
  }

  private batch(update: Partial<GraphState>) {
    this.state = { ...this.state, ...update }
    this.emit()
  }

  hoverNode(id: NodeId | null) {
    this.timeouts.forEach(clearTimeout)
    this.timeouts.clear()

    if (!id) {
      this.batch({
        activeNode: null,
        nodes: this.state.nodes.map((n) => ({ ...n, state: 'idle' as const })),
        edges: this.state.edges.map((e) => ({
          ...e,
          state: 'idle' as const,
          intensity: 0,
        })),
      })
      return
    }

    const updatedNodes = this.state.nodes.map((n) => ({
      ...n,
      state: n.id === id ? 'active' as const : n.state,
    }))

    this.batch({
      activeNode: id,
      nodes: updatedNodes,
    })

    this.propagate(id)
  }

  private propagate(id: NodeId) {
    const adjacency = this.getAdjacency(id)

    adjacency.forEach((nodeId, index) => {
      const timer = setTimeout(() => {
        this.timeouts.delete(timer)
        this.state.nodes = this.state.nodes.map((n) =>
          n.id === nodeId ? { ...n, state: 'syncing' as const } : n,
        )

        this.state.edges = this.state.edges.map((e) => {
          if (e.from === id && e.to === nodeId) {
            return { ...e, state: 'flowing' as const, intensity: 1 }
          }
          if (e.from === nodeId && e.to === id) {
            return { ...e, state: 'flowing' as const, intensity: 0.6 }
          }
          return e
        })

        this.emit()
      }, index * 120)

      this.timeouts.add(timer)
    })

    const resolveTimer = setTimeout(() => {
      this.timeouts.delete(resolveTimer)
      this.state.nodes = this.state.nodes.map((n) =>
        n.state === 'syncing' ? { ...n, state: 'active' as const } : n,
      )
      this.emit()
    }, adjacency.length * 120 + 200)

    this.timeouts.add(resolveTimer)
  }

  private getAdjacency(id: NodeId): NodeId[] {
    return this.state.edges
      .filter((e) => e.from === id)
      .map((e) => e.to)
  }

  private startAmbientDrift() {
    const timer = setInterval(() => {
      this.state.edges = this.state.edges.map((e) => ({
        ...e,
        intensity: Math.max(
          0,
          Math.min(1, e.intensity + (Math.random() - 0.5) * 0.12),
        ),
      }))

      this.emit()
    }, 3000)

    this.intervals.add(timer)
  }

  destroy() {
    this.intervals.forEach(clearInterval)
    this.timeouts.forEach(clearTimeout)
    this.intervals.clear()
    this.timeouts.clear()
    this.listeners.clear()
  }
}
