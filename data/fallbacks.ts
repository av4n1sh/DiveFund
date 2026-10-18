import { FUND_BY_ID } from '@/lib/funds'
import { formatPercent } from '@/lib/format'
import type { FundId, Insight, QuizQuestion, SimulationResult } from '@/lib/types'

export const FALLBACK_QUIZZES: Record<number, QuizQuestion[]> = {
  1: [
    {
      question: 'What does buying one share of an ETF give you?',
      options: [
        'A small slice of many investments at once',
        'Ownership of one single company',
        'A guaranteed return every year',
        'A loan to the government',
      ],
      correctIndex: 0,
      explanation: 'An ETF is a basket: one purchase spreads your money across many holdings.',
    },
    {
      question: 'Why can owning hundreds of companies lower your risk?',
      options: [
        'Companies in a basket never lose money',
        'One company doing badly is only a tiny part of the basket',
        'The fund manager promises to cover losses',
        'It removes all fees',
      ],
      correctIndex: 1,
      explanation: 'When risk is spread out, no single sinking ship pulls the whole portfolio down.',
    },
    {
      question: 'What does an index fund try to do?',
      options: ['Beat the market every year', 'Copy a market list as closely as possible', 'Only buy tech companies', 'Avoid stocks completely'],
      correctIndex: 1,
      explanation: 'Index funds simply track a market instead of trying to outguess it.',
    },
  ],
  2: [
    {
      question: 'What is volatility?',
      options: ['How much a fund costs', 'How much a value bounces up and down', 'How many companies a fund owns', 'How long you hold an investment'],
      correctIndex: 1,
      explanation: 'Volatility describes the size of the ups and downs, not the long-run direction.',
    },
    {
      question: 'Compared with stocks, bonds usually…',
      options: ['Swing more and grow faster', 'Swing less and grow slower', 'Never change in value', 'Have no fees'],
      correctIndex: 1,
      explanation: 'Bonds tend to be calmer, which usually comes with lower expected growth.',
    },
    {
      question: 'What happens when you buy a bond?',
      options: ['You own part of a company', 'You lend money and earn interest', 'You pay a monthly subscription', 'You get insurance on stocks'],
      correctIndex: 1,
      explanation: 'A bond is a loan. The borrower pays interest and returns the money later.',
    },
  ],
  3: [
    {
      question: 'What is an expense ratio?',
      options: ['A yearly fee as a percent of your investment', 'The fund’s return last year', 'A one-time sign-up cost', 'The number of stocks in a fund'],
      correctIndex: 0,
      explanation: 'It is charged every year on what you have invested, whether the fund goes up or down.',
    },
    {
      question: 'Why can a 0.85% fee matter much more than a 0.03% fee over 30 years?',
      options: ['Fees compound over time, like returns do', 'Higher fees are only charged once', 'Low-fee funds are illegal', 'It doesn’t matter at all'],
      correctIndex: 0,
      explanation: 'Every dollar paid in fees also loses all the growth it would have earned later.',
    },
    {
      question: 'In the game, what does the shaded “fee drag” area show?',
      options: ['Money lost to taxes', 'The gap between zero fees and your real fees', 'Your total contributions', 'The fund’s guaranteed profit'],
      correctIndex: 1,
      explanation: 'Fee drag is what you’d have with zero fees minus what you actually end up with.',
    },
  ],
  4: [
    {
      question: 'What is the main difference between active and passive funds?',
      options: [
        'Active funds pick investments to try to beat the market, usually for higher fees',
        'Passive funds are always riskier',
        'Active funds are free',
        'Passive funds only own bonds',
      ],
      correctIndex: 0,
      explanation: 'Passive funds match the market cheaply; active funds pay managers to try to beat it.',
    },
    {
      question: 'In this game, Current Rider and Reef 500 assume the same gross return. Which ends with more money?',
      options: ['Current Rider, because it is managed', 'Reef 500, because its fee is much lower', 'They end up exactly the same', 'It depends on the color of the chart'],
      correctIndex: 1,
      explanation: 'With the same return before fees, the cheaper fund keeps more of the growth.',
    },
    {
      question: 'Why is a sector fund like Deep Trench Tech riskier?',
      options: ['It holds only one industry, so risk is concentrated', 'It has no companies in it', 'It only holds government bonds', 'It is guaranteed to fall'],
      correctIndex: 0,
      explanation: 'If that one industry has a bad year, the whole fund feels it.',
    },
  ],
  5: [
    {
      question: 'What does diversification mean?',
      options: ['Putting everything into the best fund', 'Spreading money across different kinds of investments', 'Selling whenever prices drop', 'Only investing in your home country'],
      correctIndex: 1,
      explanation: 'Different investments react differently, which can soften the bumps.',
    },
    {
      question: 'How does a longer time horizon affect risk?',
      options: ['It gives more time to recover from drops', 'It removes all risk', 'It makes fees disappear', 'It has no effect'],
      correctIndex: 0,
      explanation: 'Money you won’t need for decades can ride out more ups and downs.',
    },
    {
      question: 'Do past returns guarantee future returns?',
      options: ['Yes, always', 'Only for index funds', 'No, past results never guarantee future ones', 'Only in The Trench'],
      correctIndex: 2,
      explanation: 'Even this game uses assumptions. Real markets can do something different.',
    },
  ],
}

export const FALLBACK_ANSWERS: { match: RegExp; answer: string }[] = [
  {
    match: /etf/i,
    answer:
      'An ETF is like a basket of many investments sold as one thing. Buy one share and you own a tiny slice of everything inside. In this simulator, Reef 500 is an example. This is learning only, not advice.',
  },
  {
    match: /bond|kelp|tidepool/i,
    answer:
      'Bonds are loans to governments or companies. They pay interest and usually move less than stocks, so they can smooth out a bumpy ride, but they tend to grow more slowly. Try a preset to see how they change your chart.',
  },
  {
    match: /fee|expense|0\.85|current rider/i,
    answer:
      'Fees are charged every year, so they compound. A 0.85% fee can quietly cost many times more than a 0.03% fee over 30 years. Watch the shaded fee-drag area on your chart grow when you add a pricier fund.',
  },
  {
    match: /active|passive|sector|tech/i,
    answer:
      'Active funds pay a manager to try to beat the market; passive index funds just match it for a lower fee. Sector funds hold one industry, which concentrates risk. In this game, try comparing them with the sliders.',
  },
  {
    match: /time|horizon|year|divers/i,
    answer:
      'Spreading money across different investments, and giving it more time, can help soften bad stretches. Try changing your time horizon slider to see how much the ending value moves.',
  },
]

export const FALLBACK_GENERAL_ANSWER =
  'The AI guide is offline right now, so here is a quick tip: try one change at a time, like a preset or a single slider, and watch how the chart and stat tiles respond. That is the fastest way to learn here.'

export function fallbackAnswer(question: string): string {
  return FALLBACK_ANSWERS.find((a) => a.match.test(question))?.answer ?? FALLBACK_GENERAL_ANSWER
}

export function fallbackInsight(allocation: Partial<Record<FundId, number>>, sim: SimulationResult): Insight {
  const top = (Object.entries(allocation) as [FundId, number][])
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])[0]
  const topFund = top ? FUND_BY_ID[top[0]] : undefined
  const bondShare = sim.categoryExposure.Bonds ?? 0

  return {
    holding: topFund
      ? `Your biggest slice is ${topFund.name} at ${top[1]}%, so it shapes most of your results.`
      : 'Your money is spread across your funds.',
    risk:
      sim.blendedVolatility === 'High'
        ? 'This mix has high volatility, so expect bigger ups and downs along the way.'
        : bondShare >= 0.2
          ? `About ${Math.round(bondShare * 100)}% is in bonds, which tends to calm the ride.`
          : `Overall volatility is ${sim.blendedVolatility.toLowerCase()} for this mix.`,
    consider:
      sim.blendedExpense > 0.002
        ? `Your blended fee is ${formatPercent(sim.blendedExpense)}. Try lowering it and watch the fee drag shrink.`
        : 'Try the Cautious and Bold presets to compare how risk changes your ending value.',
  }
}

export function fallbackSummary(levelsCompleted: number): string[] {
  const lessons = [
    'ETFs bundle many investments together, which spreads risk.',
    'Bonds usually move less than stocks but tend to grow more slowly.',
    'Small yearly fees compound into large differences over decades.',
    'Low-cost passive funds often keep more of the growth than pricier active ones.',
    'Diversification and a long time horizon can help ride out rough patches.',
  ]
  return lessons.slice(0, Math.max(3, Math.min(5, levelsCompleted)))
}
