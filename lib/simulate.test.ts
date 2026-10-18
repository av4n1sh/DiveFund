import { describe, expect, it } from 'vitest'
import { FUNDS } from '@/lib/funds'
import { simulate } from '@/lib/simulate'

const base = { monthlyContribution: 400, horizonYears: 30, funds: FUNDS }

describe('simulate', () => {
  it('has zero fee drag when every expense ratio is zero', () => {
    const freeFunds = FUNDS.map((f) => ({ ...f, expenseRatio: 0 }))
    const result = simulate({ ...base, funds: freeFunds, allocation: { reef500: 0.5, kelpbonds: 0.5 } })
    expect(result.feeDrag).toBeCloseTo(0, 6)
    expect(result.endingValue).toBeCloseTo(result.endingValueNoFees, 6)
  })

  it('produces a lower ending value with a higher expense ratio', () => {
    const cheap = simulate({ ...base, allocation: { reef500: 1 } })
    const pricey = simulate({ ...base, allocation: { currentrider: 1 } })
    expect(pricey.endingValue).toBeLessThan(cheap.endingValue)
    expect(pricey.feeDrag).toBeGreaterThan(cheap.feeDrag * 10)
  })

  it('throws when weights do not sum to 1', () => {
    expect(() => simulate({ ...base, allocation: { reef500: 0.6, kelpbonds: 0.3 } })).toThrow()
  })

  it('tracks contributions and yearly points', () => {
    const result = simulate({ ...base, horizonYears: 10, allocation: { tidepool: 1 } })
    expect(result.series).toHaveLength(11)
    expect(result.totalContributed).toBe(400 * 120)
  })
})
