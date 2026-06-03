import type { GraphState } from '@/lib/graph/types'
import { GraphSimulation } from '@/lib/graph/simulation'

type Listener = () => void

interface SubscriberEntry<T> {
  selector: (state: GraphState) => T
  lastValue: T
  callback: (value: T) => void
}

export class SystemBus {
  private graph: GraphSimulation
  private unsubGraph: () => void
  private subscribers = new Set<SubscriberEntry<unknown>>()

  constructor(graph: GraphSimulation) {
    this.graph = graph
    this.unsubGraph = graph.subscribe((state) => {
      this.subscribers.forEach((entry) => {
        const newValue = entry.selector(state)
        if (newValue !== entry.lastValue) {
          entry.lastValue = newValue
          entry.callback(newValue)
        }
      })
    })
  }

  subscribe<T>(
    selector: (state: GraphState) => T,
    callback: (value: T) => void,
  ): () => void {
    const entry: SubscriberEntry<T> = {
      selector,
      lastValue: selector(this.graph.getState()),
      callback,
    }

    this.subscribers.add(entry as SubscriberEntry<unknown>)
    callback(entry.lastValue)

    return () => {
      this.subscribers.delete(entry as SubscriberEntry<unknown>)
    }
  }

  getSnapshot(): GraphState {
    return this.graph.getState()
  }

  destroy() {
    this.unsubGraph()
    this.subscribers.clear()
  }
}
