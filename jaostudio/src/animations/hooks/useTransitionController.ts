'use client'

import { useMemo } from 'react'
import { createTransitionContext } from '../core/orchestrator'
import type { TransitionContext } from '../core/types'

export function useTransitionController(): TransitionContext {
  return useMemo(() => createTransitionContext(), [])
}
