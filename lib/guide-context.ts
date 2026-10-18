import { z } from 'zod'
import { toWeights } from '@/lib/allocation'
import { FUND_BY_ID, FUND_IDS, unlockedFunds, FUNDS } from '@/lib/funds'
import { formatMoney, formatPercent } from '@/lib/format'
import { simulate } from '@/lib/simulate'
import { getLevel } from '@/data/levels'
import type { FundId, GuideContext } from '@/lib/types'

export const guideContextSchema = z.object({
  level: z.number().int().min(1).max(5),
  mode: z.enum(['beginner', 'advanced']),
  monthlyContribution: z.number().min(10).max(5000),
  horizonYears: z.number().int().min(5).max(40),
  allocation: z.partialRecord(z.enum(FUND_IDS), z.number().min(0).max(100)),
})

export function simulateContext(ctx: GuideContext) {
  return simulate({
    monthlyContribution: ctx.monthlyContribution,
    horizonYears: ctx.horizonYears,
    allocation: toWeights(ctx.allocation),
    funds: FUNDS,
  })
}

export function describeContext(ctx: GuideContext): string {
  const level = getLevel(ctx.level)
  const sim = simulateContext(ctx)
  const holdings = (Object.entries(ctx.allocation) as [FundId, number][])
    .filter(([, v]) => v > 0)
    .map(([id, v]) => {
      const f = FUND_BY_ID[id]
      return `- ${f.name}: ${v}% (${f.assetClass}, fee ${formatPercent(f.expenseRatio)}, assumed return ${formatPercent(f.assumedAnnualReturn, 0)}, volatility ${f.volatility})`
    })
    .join('\n')
  const unlocked = unlockedFunds(ctx.level)
    .map((f) => f.name)
    .join(', ')

  return `Current game state:
Depth: Level ${ctx.level} "${level?.name}" — lesson: ${level?.conceptTitle}
Explanation mode: ${ctx.mode === 'beginner' ? 'Beginner (very simple, analogies, no jargon)' : 'Advanced (use proper terms, still concise)'}
Monthly contribution: ${formatMoney(ctx.monthlyContribution)} for ${ctx.horizonYears} years
Unlocked funds: ${unlocked}
Allocation:
${holdings}
Simulated ending value: ${formatMoney(sim.endingValue)} (with zero fees: ${formatMoney(sim.endingValueNoFees)})
Fee drag: ${formatMoney(sim.feeDrag)} · Blended fee: ${formatPercent(sim.blendedExpense)} · Blended volatility: ${sim.blendedVolatility}
Total contributed: ${formatMoney(sim.totalContributed)}`
}
