'use client'

import { useEffect, useMemo, useState } from 'react'
import { useGame } from '@/components/game-provider'
import type { FundId, GuideContext } from '@/lib/types'

export function useGuideContext(level: number): GuideContext {
  const { state } = useGame()
  return useMemo(() => {
    const allocation: Partial<Record<FundId, number>> = {}
    for (const [id, v] of Object.entries(state.allocation) as [FundId, number][]) {
      if (v > 0) allocation[id] = v
    }
    return {
      level,
      mode: state.mode,
      monthlyContribution: state.monthlyContribution,
      horizonYears: state.horizonYears,
      allocation,
    }
  }, [level, state.mode, state.monthlyContribution, state.horizonYears, state.allocation])
}

export function useDebounced<T>(value: T, delay = 700): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

export async function postJson<T>([url, body]: [string, unknown]): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}
