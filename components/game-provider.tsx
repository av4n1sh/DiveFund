'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { rebalance } from '@/lib/allocation'
import { FUNDS } from '@/lib/funds'
import { applyLockIn, applyQuizPass, createInitialState, migrateState, STORAGE_KEY, type RewardEvents } from '@/lib/game'
import { buildPreset, type PresetId } from '@/lib/presets'
import { simulate } from '@/lib/simulate'
import { toWeights } from '@/lib/allocation'
import type { Diver, FundId, GameState, Mode, SimulationResult } from '@/lib/types'

interface GameContextValue {
  state: GameState
  hydrated: boolean
  sim: SimulationResult
  setMode: (mode: Mode) => void
  setDiver: (diver: Diver, monthlyContribution: number) => void
  setMonthlyContribution: (value: number) => void
  setHorizonYears: (value: number) => void
  setFundWeight: (id: FundId, value: number) => void
  applyPreset: (preset: PresetId) => void
  lockIn: (level: number) => RewardEvents
  passQuiz: (level: number) => RewardEvents
  reset: () => void
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(createInitialState)
  const [hydrated, setHydrated] = useState(false)
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) setState(migrateState(JSON.parse(raw)))
    } catch {
      // Corrupt or blocked storage: start fresh.
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Storage full or disabled; progress just won't persist.
    }
  }, [state, hydrated])

  const sim = useMemo(
    () =>
      simulate({
        monthlyContribution: state.monthlyContribution,
        horizonYears: state.horizonYears,
        allocation: toWeights(state.allocation),
        funds: FUNDS,
      }),
    [state.monthlyContribution, state.horizonYears, state.allocation],
  )
  const simRef = useRef(sim)
  simRef.current = sim

  const update = useCallback((fn: (s: GameState) => GameState) => setState((s) => fn(s)), [])

  const lockIn = useCallback((level: number) => {
    const result = applyLockIn(stateRef.current, level, simRef.current)
    stateRef.current = result.state
    setState(result.state)
    return result.events
  }, [])

  const passQuiz = useCallback((level: number) => {
    const result = applyQuizPass(stateRef.current, level)
    stateRef.current = result.state
    setState(result.state)
    return result.events
  }, [])

  const value = useMemo<GameContextValue>(
    () => ({
      state,
      hydrated,
      sim,
      setMode: (mode) => update((s) => ({ ...s, mode })),
      setDiver: (diver, monthlyContribution) =>
        update((s) => ({ ...s, diver, monthlyContribution: clampContribution(monthlyContribution) })),
      setMonthlyContribution: (value) => update((s) => ({ ...s, monthlyContribution: clampContribution(value) })),
      setHorizonYears: (value) => update((s) => ({ ...s, horizonYears: Math.min(40, Math.max(5, Math.round(value))) })),
      setFundWeight: (id, value) =>
        update((s) => ({ ...s, allocation: rebalance(s.allocation, s.currentLevel, id, value) })),
      applyPreset: (preset) => update((s) => ({ ...s, allocation: buildPreset(preset, s.currentLevel) })),
      lockIn,
      passQuiz,
      reset: () => {
        const fresh = createInitialState()
        stateRef.current = fresh
        setState(fresh)
      },
    }),
    [state, hydrated, sim, update, lockIn, passQuiz],
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

function clampContribution(value: number): number {
  if (!Number.isFinite(value)) return 100
  return Math.min(5000, Math.max(10, Math.round(value)))
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside GameProvider')
  return ctx
}
