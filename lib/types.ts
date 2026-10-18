export type Volatility = 'Low' | 'Medium' | 'High'

export type FundCategory = 'US Stocks' | 'Bonds' | 'International Stocks'

export type FundId =
  | 'reef500'
  | 'openocean'
  | 'kelpbonds'
  | 'tidepool'
  | 'farwaters'
  | 'deeptrench'
  | 'currentrider'
  | 'coralsmall'

export interface Fund {
  id: FundId
  name: string
  tagline: string
  assetClass: string
  category: FundCategory
  expenseRatio: number
  assumedAnnualReturn: number
  volatility: Volatility
  sectorWeights: Record<string, number>
  unlockLevel: number
  beginnerDescription: string
  advancedDescription: string
  newReason: string
}

/** Integer percentages (0-100) keyed by fund id. Always sums to 100. */
export type Allocation = Record<FundId, number>

/** Fractional weights (0-1) keyed by fund id. Must sum to 1. */
export type Weights = Partial<Record<FundId, number>>

export interface YearPoint {
  year: number
  portfolio: number
  noFees: number
  contributed: number
}

export interface SimulationInput {
  monthlyContribution: number
  horizonYears: number
  allocation: Weights
  funds: Fund[]
}

export interface SimulationResult {
  series: YearPoint[]
  endingValue: number
  endingValueNoFees: number
  feeDrag: number
  totalContributed: number
  blendedExpense: number
  blendedReturn: number
  blendedVolatility: Volatility
  assetClassExposure: Record<string, number>
  categoryExposure: Partial<Record<FundCategory, number>>
}

export type Mode = 'beginner' | 'advanced'

export type BadgeId =
  | 'first-dip'
  | 'diversified-diver'
  | 'fee-fighter'
  | 'steady-hands'
  | 'trench-explorer'
  | 'scholar-of-the-sea'

export interface Diver {
  customerId: string
  name: string
  accountId: string | null
  mocked: boolean
}

export interface GameState {
  version: 1
  mode: Mode
  diver: Diver | null
  monthlyContribution: number
  horizonYears: number
  allocation: Allocation
  currentLevel: number
  passedQuizzes: number[]
  lockInsByLevel: Record<number, number>
  xp: number
  streak: number
  totalLockedIn: number
  badges: BadgeId[]
  rewardFlags: { diversified: boolean; lowFee: boolean }
  completed: boolean
}

export interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface Insight {
  holding: string
  risk: string
  consider: string
}

export interface SurplusMonth {
  month: string
  deposits: number
  spending: number
}

export interface SurplusResult {
  accountId: string | null
  months: SurplusMonth[]
  averageDeposits: number
  averageSpending: number
  monthlySurplus: number
  mocked: boolean
}

export interface NessieCustomer {
  _id: string
  first_name: string
  last_name: string
}

/** Compact snapshot of game state sent to the AI routes. Stats are recomputed on the server. */
export interface GuideContext {
  level: number
  mode: Mode
  monthlyContribution: number
  horizonYears: number
  allocation: Partial<Record<FundId, number>>
}
