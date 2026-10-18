import type { Mode } from '@/lib/types'

export interface ChatMessage {
  id: string
  role: 'user' | 'guide'
  text: string
  /** Guide messages created by contextual tips rather than an AI reply. */
  tip?: boolean
}

export interface GuideHolding {
  fundName: string
  percent: number
  /** Fraction, e.g. 0.0085 for 0.85%. */
  expenseRatio: number
}

/** Snapshot of the player's game sent with every guide request. */
export interface GuideGameState {
  level: number
  levelName: string
  conceptTitle: string
  allocation: GuideHolding[]
  monthlyContribution: number
  horizonYears: number
  projectedEndingValue: number
  totalFees: number
  /** Fraction, e.g. 0.0012 for 0.12%. */
  blendedExpenseRatio: number
  mode: Mode
}

export type GuideProviderName = 'gemini' | 'mock'
