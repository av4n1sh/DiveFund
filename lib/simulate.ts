import type {
  FundCategory,
  SimulationInput,
  SimulationResult,
  Volatility,
  YearPoint,
} from '@/lib/types'

const VOLATILITY_SCORE: Record<Volatility, number> = { Low: 1, Medium: 2, High: 3 }

function scoreToVolatility(score: number): Volatility {
  if (score < 1.5) return 'Low'
  if (score < 2.5) return 'Medium'
  return 'High'
}

export function simulate({
  monthlyContribution,
  horizonYears,
  allocation,
  funds,
}: SimulationInput): SimulationResult {
  const entries = Object.entries(allocation).filter(([, w]) => (w ?? 0) > 0) as [string, number][]
  const totalWeight = entries.reduce((sum, [, w]) => sum + w, 0)
  if (Math.abs(totalWeight - 1) > 1e-6) {
    throw new Error(`Allocation weights must sum to 1 (got ${totalWeight.toFixed(4)})`)
  }

  const byId = new Map(funds.map((f) => [f.id, f]))
  let blendedReturn = 0
  let blendedExpense = 0
  let volatilityScore = 0
  const assetClassExposure: Record<string, number> = {}
  const categoryExposure: Partial<Record<FundCategory, number>> = {}

  for (const [id, weight] of entries) {
    const fund = byId.get(id as never)
    if (!fund) throw new Error(`Unknown fund: ${id}`)
    blendedReturn += weight * fund.assumedAnnualReturn
    blendedExpense += weight * fund.expenseRatio
    volatilityScore += weight * VOLATILITY_SCORE[fund.volatility]
    assetClassExposure[fund.assetClass] = (assetClassExposure[fund.assetClass] ?? 0) + weight
    categoryExposure[fund.category] = (categoryExposure[fund.category] ?? 0) + weight
  }

  const monthlyRate = Math.pow(1 + blendedReturn - blendedExpense, 1 / 12) - 1
  const monthlyRateNoFees = Math.pow(1 + blendedReturn, 1 / 12) - 1

  let value = 0
  let valueNoFees = 0
  const series: YearPoint[] = [{ year: 0, portfolio: 0, noFees: 0, contributed: 0 }]
  const months = Math.max(0, Math.round(horizonYears * 12))

  for (let m = 1; m <= months; m++) {
    value = value * (1 + monthlyRate) + monthlyContribution
    valueNoFees = valueNoFees * (1 + monthlyRateNoFees) + monthlyContribution
    if (m % 12 === 0) {
      series.push({
        year: m / 12,
        portfolio: value,
        noFees: valueNoFees,
        contributed: monthlyContribution * m,
      })
    }
  }

  return {
    series,
    endingValue: value,
    endingValueNoFees: valueNoFees,
    feeDrag: valueNoFees - value,
    totalContributed: monthlyContribution * months,
    blendedExpense,
    blendedReturn,
    blendedVolatility: scoreToVolatility(volatilityScore),
    assetClassExposure,
    categoryExposure,
  }
}
