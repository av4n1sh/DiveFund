import fundsData from '@/data/funds.json'
import type { Fund, FundId } from '@/lib/types'

export const FUNDS = fundsData as unknown as Fund[]

export const FUND_IDS = FUNDS.map((f) => f.id) as [FundId, ...FundId[]]

export const FUND_BY_ID = Object.fromEntries(FUNDS.map((f) => [f.id, f])) as Record<FundId, Fund>

export function unlockedFunds(level: number): Fund[] {
  return FUNDS.filter((f) => f.unlockLevel <= level)
}

export function fundsUnlockedAt(level: number): Fund[] {
  return FUNDS.filter((f) => f.unlockLevel === level)
}
