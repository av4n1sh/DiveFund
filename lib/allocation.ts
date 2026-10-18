import { FUND_IDS, FUND_BY_ID, unlockedFunds } from '@/lib/funds'
import type { Allocation, FundId, Weights } from '@/lib/types'

export function emptyAllocation(): Allocation {
  return Object.fromEntries(FUND_IDS.map((id) => [id, 0])) as Allocation
}

/** Distributes `target` across values as integers, preserving proportions (largest remainder method). */
export function largestRemainder(values: number[], target: number): number[] {
  const total = values.reduce((a, b) => a + b, 0)
  if (total <= 0 || values.length === 0) return values.map(() => 0)
  const scaled = values.map((v) => (v / total) * target)
  const floored = scaled.map(Math.floor)
  let remainder = target - floored.reduce((a, b) => a + b, 0)
  const order = scaled
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac)
  for (let k = 0; remainder > 0 && k < order.length; k++, remainder--) {
    floored[order[k].i] += 1
  }
  return floored
}

/** Sets one fund to `value`% and rescales the other unlocked funds so the total stays 100. */
export function rebalance(allocation: Allocation, level: number, changedId: FundId, value: number): Allocation {
  const unlocked = unlockedFunds(level).map((f) => f.id)
  const next = emptyAllocation()
  const clamped = Math.max(0, Math.min(100, Math.round(value)))
  const others = unlocked.filter((id) => id !== changedId)

  if (others.length === 0) {
    next[changedId] = 100
    return next
  }

  const remaining = 100 - clamped
  const otherValues = others.map((id) => allocation[id] ?? 0)
  const otherTotal = otherValues.reduce((a, b) => a + b, 0)
  const distributed =
    otherTotal > 0 ? largestRemainder(otherValues, remaining) : largestRemainder(others.map(() => 1), remaining)

  next[changedId] = clamped
  others.forEach((id, i) => {
    next[id] = distributed[i]
  })
  return next
}

/** Drops funds that are not unlocked yet and renormalizes to 100. */
export function sanitizeAllocation(allocation: Allocation, level: number): Allocation {
  const unlocked = unlockedFunds(level).map((f) => f.id)
  const values = unlocked.map((id) => Math.max(0, allocation[id] ?? 0))
  const ints = values.some((v) => v > 0) ? largestRemainder(values, 100) : largestRemainder(values.map(() => 1), 100)
  const next = emptyAllocation()
  unlocked.forEach((id, i) => {
    next[id] = ints[i]
  })
  return next
}

export function toWeights(allocation: Partial<Record<FundId, number>>): Weights {
  const entries = Object.entries(allocation).filter(([id, v]) => (v ?? 0) > 0 && id in FUND_BY_ID) as [
    FundId,
    number,
  ][]
  const total = entries.reduce((a, [, v]) => a + v, 0)
  if (total <= 0) return { reef500: 1 }
  return Object.fromEntries(entries.map(([id, v]) => [id, v / total])) as Weights
}

export function allocationKey(allocation: Allocation): string {
  return FUND_IDS.map((id) => allocation[id] ?? 0).join('-')
}
