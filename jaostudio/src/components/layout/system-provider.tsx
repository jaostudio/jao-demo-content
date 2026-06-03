'use client'

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { GraphSimulation } from '@/lib/graph/simulation'
import { SystemBus } from '@/lib/system/system-bus'
import type { GraphState, NodeId } from '@/lib/graph/types'

interface SystemContextValue {
  sim: GraphSimulation
  bus: SystemBus
}

const SystemContext = createContext<SystemContextValue | null>(null)

export function SystemProvider({ children }: { children: React.ReactNode }) {
  const simRef = useRef<GraphSimulation | null>(null)

  const { sim, bus } = useMemo(() => {
    if (!simRef.current) {
      simRef.current = new GraphSimulation()
    }
    const bus = new SystemBus(simRef.current)
    return { sim: simRef.current, bus }
  }, [])

  useEffect(() => {
    return () => {
      bus.destroy()
      sim.destroy()
    }
  }, [sim, bus])

  return (
    <SystemContext.Provider value={{ sim, bus }}>
      {children}
    </SystemContext.Provider>
  )
}

export function useSystem(): SystemContextValue {
  const ctx = useContext(SystemContext)
  if (!ctx) throw new Error('useSystem must be used within SystemProvider')
  return ctx
}

export function useActiveNode(): NodeId | null {
  const { bus } = useSystem()
  const [activeNode, setActiveNode] = useState<NodeId | null>(null)

  useEffect(() => {
    return bus.subscribe(
      (state: GraphState) => state.activeNode,
      setActiveNode,
    )
  }, [bus])

  return activeNode
}
