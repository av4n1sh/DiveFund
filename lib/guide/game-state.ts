import { getLevel } from '@/data/levels'
import { FUND_BY_ID } from '@/lib/funds'
import type { GuideGameState } from '@/lib/guide/types'
import type { FundId, GameState, SimulationResult } from '@/lib/types'

export function buildGuideGameState(level: number, state: GameState, sim: SimulationResult): GuideGameState {
  const data = getLevel(level)
  const allocation = (Object.entries(state.allocation) as [FundId, number][])
    .filter(([, percent]) => percent > 0)
    .map(([id, percent]) => ({
      fundName: FUND_BY_ID[id].name,
      percent,
      expenseRatio: FUND_BY_ID[id].expenseRatio,
    }))
  return {
    level: data?.id ?? 1,
    levelName: data?.name ?? 'The Shallows',
    conceptTitle: data?.conceptTitle ?? '',
    allocation,
    monthlyContribution: state.monthlyContribution,
    horizonYears: state.horizonYears,
    projectedEndingValue: Math.round(sim.endingValue),
    totalFees: Math.round(sim.feeDrag),
    blendedExpenseRatio: sim.blendedExpense,
    mode: state.mode,
  }
}
