import { emptyAllocation, largestRemainder } from '@/lib/allocation'
import { unlockedFunds } from '@/lib/funds'
import type { Allocation, Fund } from '@/lib/types'

export type PresetId = 'cautious' | 'balanced' | 'bold'

export const PRESETS: { id: PresetId; label: string; description: string }[] = [
  { id: 'cautious', label: 'Cautious', description: 'Mostly bonds, a little stock' },
  { id: 'balanced', label: 'Balanced', description: 'About 60% stocks, 40% bonds' },
  { id: 'bold', label: 'Bold', description: 'All stocks, more swings' },
]

const STOCK_SHARE: Record<PresetId, number> = { cautious: 0.3, balanced: 0.6, bold: 1 }

function stockWeight(fund: Fund, preset: PresetId): number {
  if (fund.id === 'currentrider') return 0
  if (preset === 'bold' && fund.volatility === 'High') return 2
  return 1
}

export function buildPreset(preset: PresetId, level: number): Allocation {
  const funds = unlockedFunds(level)
  const stocks = funds.filter((f) => f.category !== 'Bonds')
  const bonds = funds.filter((f) => f.category === 'Bonds')
  const stockShare = bonds.length === 0 ? 1 : STOCK_SHARE[preset]

  const raw = funds.map((f) => {
    if (f.category === 'Bonds') return (1 - stockShare) / bonds.length
    const weights = stocks.map((s) => stockWeight(s, preset))
    const total = weights.reduce((a, b) => a + b, 0) || 1
    return (stockShare * stockWeight(f, preset)) / total
  })

  const ints = largestRemainder(raw, 100)
  const next = emptyAllocation()
  funds.forEach((f, i) => {
    next[f.id] = ints[i]
  })
  return next
}
