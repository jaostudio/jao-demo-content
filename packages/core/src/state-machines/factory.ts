type MachineConfig<S extends string, E extends string> = {
  initial: S
  states: Record<S, { on: Partial<Record<E, S>> }>
}

export function createMachine<S extends string, E extends string>(config: MachineConfig<S, E>) {
  let current: S = config.initial

  function transition(event: E): S | null {
    const next = config.states[current].on[event]
    if (!next) return null
    current = next
    return current
  }

  function can(event: E): boolean {
    return event in config.states[current].on
  }

  function state(): S {
    return current
  }

  function reset(): S {
    current = config.initial
    return current
  }

  function getValidTransitions(): E[] {
    return Object.keys(config.states[current].on) as E[]
  }

  return { state, transition, can, reset, getValidTransitions }
}

export type { MachineConfig }
