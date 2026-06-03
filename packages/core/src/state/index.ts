'use client'

import { createContext, useContext, useCallback, useRef, useEffect, type ReactNode } from 'react'

type Listener = () => void

interface Store<T> {
  getState: () => T
  setState: (partial: Partial<T> | ((prev: T) => Partial<T>)) => void
  subscribe: (listener: Listener) => () => void
}

export function createStore<T>(initial: T): Store<T> {
  let state = initial
  const listeners = new Set<Listener>()

  return {
    getState: () => state,
    setState: (partial) => {
      const next = typeof partial === 'function' ? partial(state) : partial
      state = { ...state, ...next }
      listeners.forEach((l) => l())
    },
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

export function createContextHook<T>() {
  const Ctx = createContext<T | undefined>(undefined)

  function Provider({ value, children }: { value: T; children: ReactNode }) {
    return <Ctx.Provider value={value}>{children}</Ctx.Provider>
  }

  function useCtx(): T {
    const ctx = useContext(Ctx)
    if (!ctx) throw new Error('Context provider not found')
    return ctx
  }

  return { Provider, useCtx, Ctx }
}

export function useAutoSave<T>(data: T, save: (data: T) => void, deps: unknown[] = []) {
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    save(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export function useAutoSaveCallback<T>(
  data: T,
  save: (data: T) => void,
  deps: unknown[] = [],
) {
  const fn = useCallback(() => {
    save(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return fn
}
