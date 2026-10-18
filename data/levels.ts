import type { FundId } from '@/lib/types'

export interface Level {
  id: number
  name: string
  depthLabel: string
  conceptTitle: string
  /** Supports inline glossary terms written as {{termKey:Display text}}. */
  conceptBody: string
  unlocksFunds: FundId[]
  xpReward: number
  suggestedQuestions: [string, string, string]
}

export const LEVELS: Level[] = [
  {
    id: 1,
    name: 'The Shallows',
    depthLabel: '0–10m',
    conceptTitle: 'What is an ETF?',
    conceptBody:
      'An {{etf:ETF}} is a basket of many investments that you buy as a single thing. Instead of picking one company, you own a small slice of hundreds at once. That spreads your risk: if one company sinks, it is only a tiny part of your basket. Many ETFs are {{index:index funds}}, which simply copy a whole market instead of trying to beat it.',
    unlocksFunds: ['reef500', 'openocean'],
    xpReward: 50,
    suggestedQuestions: [
      'What is an ETF in simple words?',
      'How is Reef 500 different from Open Ocean?',
      'Why does owning many companies lower risk?',
    ],
  },
  {
    id: 2,
    name: 'The Reef',
    depthLabel: '10–40m',
    conceptTitle: 'Risk and bonds',
    conceptBody:
      '{{volatility:Volatility}} is how much an investment’s value bounces up and down. Stocks can swing a lot in a single year. {{bond:Bonds}} are loans to governments or companies that pay you interest, and they usually move much less. Mixing the two can smooth out the ride, though calmer water usually means slower growth.',
    unlocksFunds: ['kelpbonds', 'tidepool'],
    xpReward: 50,
    suggestedQuestions: [
      'Why do bonds move less than stocks?',
      'What if I put 30% in Kelp Forest Bonds?',
      'Is low volatility always better?',
    ],
  },
  {
    id: 3,
    name: 'Kelp Forest',
    depthLabel: '40–100m',
    conceptTitle: 'Expense ratios',
    conceptBody:
      'Every fund charges a small yearly fee called an {{expenseRatio:expense ratio}}. A 0.03% fee and a 0.85% fee sound almost the same, but over decades the gap {{compound:compounds}} into a big difference. The fee is charged whether your fund goes up or down. Watch the shaded {{feeDrag:fee drag}} on your chart to see it grow.',
    unlocksFunds: ['farwaters'],
    xpReward: 50,
    suggestedQuestions: [
      'Why does 0.85% matter so much?',
      'What is an expense ratio?',
      'What if I went all-in on Reef 500?',
    ],
  },
  {
    id: 4,
    name: 'Open Ocean',
    depthLabel: '100–1000m',
    conceptTitle: 'Active vs passive',
    conceptBody:
      'An {{active:active fund}} pays a manager to pick investments and try to beat the market. A {{passive:passive}} index fund just matches the market for a much lower fee. Research has found that most active funds fall behind their index after fees over long periods. A {{sector:sector fund}} like Deep Trench Tech puts all your money in one industry, which concentrates risk.',
    unlocksFunds: ['deeptrench', 'currentrider'],
    xpReward: 50,
    suggestedQuestions: [
      'Compare Current Rider to Reef 500 for me',
      'What does an active manager actually do?',
      'Why is a sector fund riskier?',
    ],
  },
  {
    id: 5,
    name: 'The Trench',
    depthLabel: '1000m+',
    conceptTitle: 'Diversification and time',
    conceptBody:
      '{{diversification:Diversification}} means spreading money across different kinds of investments and different parts of the world, so one bad patch does not sink everything. Your {{timeHorizon:time horizon}} matters too: money you won’t need for decades has more time to recover from drops. And remember, past returns are never a guarantee of future ones.',
    unlocksFunds: ['coralsmall'],
    xpReward: 50,
    suggestedQuestions: [
      'How does time horizon change risk?',
      'What if I held this for 10 years instead of 30?',
      'Am I diversified enough to learn from?',
    ],
  },
]

export const MAX_LEVEL = LEVELS.length

export function getLevel(id: number): Level | undefined {
  return LEVELS.find((l) => l.id === id)
}
