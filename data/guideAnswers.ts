export interface GuideEntry {
  id: string
  /** Display text, also used for suggestion chips. */
  question: string
  /** Lowercase words or short phrases that signal this question. */
  keywords: string[]
  /** Under 90 words, beginner-friendly. Ignored for the help entry, which is built per level. */
  answer: string
  /** Levels that may show this as a chip; "all" for general questions. */
  levels: number[] | 'all'
}

export const HELP_ENTRY_ID = 'help'

export const GUIDE_ENTRIES: GuideEntry[] = [
  // General
  {
    id: HELP_ENTRY_ID,
    question: 'What can you help me with?',
    keywords: ['help', 'what can you do', 'how do you work', 'what do you know'],
    answer: '',
    levels: 'all',
  },
  {
    id: 'investing',
    question: 'What is investing?',
    keywords: ['investing', 'invest', 'what is investing', 'why invest'],
    answer:
      'Investing means putting money into things like companies or loans that can grow over time. Saving keeps your money safe but still. Investing lets it swim, with some waves along the way. The goal is usually to grow your money faster than prices rise, over many years. DiveFund lets you practise that with fictional funds.',
    levels: 'all',
  },
  {
    id: 'real-money',
    question: 'Is this real money?',
    keywords: ['real money', 'real', 'actually invest', 'fake', 'simulation'],
    answer:
      'No. DiveFund is a learning game. The funds are fictional, the returns are illustrative assumptions, and nothing you do here buys or sells anything. Your surplus number is only used to make the practice feel personal. Experiment freely: there is no way to lose real money in this ocean.',
    levels: 'all',
  },
  {
    id: 'teach',
    question: 'What does this game teach?',
    keywords: ['teach', 'learn', 'point of', 'purpose'],
    answer:
      'Each depth covers one idea: ETFs at The Shallows, risk and bonds at The Reef, fees in the Kelp Forest, active vs passive in the Open Ocean, and diversification in The Trench. You read a short lesson, build a mix with the sliders, watch the projection change, then pass a quick check to dive deeper.',
    levels: 'all',
  },
  {
    id: 'time',
    question: 'Why does time matter so much?',
    keywords: ['time', 'years', 'long term', 'horizon', 'compound', 'compounding'],
    answer:
      'Time lets compounding work: your growth starts earning growth of its own. Early years feel slow, then the curve bends upward. Time also gives dips a chance to recover. Try dragging the horizon slider from 10 to 30 years and watch how much the ending value changes from the same monthly amount.',
    levels: 'all',
  },
  {
    id: 'portfolio',
    question: 'What is a portfolio?',
    keywords: ['portfolio', 'mix', 'what am i holding'],
    answer:
      'Your portfolio is everything you hold, all together. In DiveFund it’s the funds you’ve set with the sliders and the percent going to each. The projection panel shows your portfolio’s blended fee, risk label, and where it might end up over your horizon.',
    levels: 'all',
  },
  {
    id: 'chart',
    question: 'What is the chart showing?',
    keywords: ['chart', 'graph', 'line', 'lines', 'projection', 'curve'],
    answer:
      'The chart projects your balance over your horizon. One line is what you contributed, the other is what it might grow to using each fund’s assumed return minus fees. The space between them is growth. It’s a smooth average, so real markets would wobble far more along the way.',
    levels: 'all',
  },
  {
    id: 'modes',
    question: 'What do Beginner and Advanced mode change?',
    keywords: ['beginner', 'advanced', 'mode', 'modes'],
    answer:
      'Beginner mode keeps language simple and hides some numbers. Advanced mode shows more detail, like exact fees and category exposure. The funds and math are the same either way. Switch anytime from the header and see which view helps you learn.',
    levels: 'all',
  },
  {
    id: 'market-drop',
    question: 'What happens when the market drops?',
    keywords: ['crash', 'drop', 'drops', 'market drops', 'go down', 'lose money', 'losing'],
    answer:
      'Funds holding stocks fall when the market falls, sometimes a lot. Historically markets have recovered over long periods, but there’s no guarantee and it can take years. Bonds and a spread-out mix usually soften the dip. This simulation shows smooth averages, so picture real waves on top of the line.',
    levels: 'all',
  },
  {
    id: 'monthly-amount',
    question: 'How much should I put in each month?',
    keywords: ['how much', 'monthly', 'each month', 'per month', 'contribution', 'contribute'],
    answer:
      'I can’t pick a real number for you, but here’s the trade-off: more each month means a bigger ending value, while leaving room for bills and an emergency cushion matters too. Try the monthly slider at a few amounts and compare. Consistency over many years often matters more than size.',
    levels: 'all',
  },

  // Level 1: ETF basics
  {
    id: 'etf',
    question: 'What is an ETF?',
    keywords: ['etf', 'etfs', 'exchange traded', 'what is an etf', 'fund'],
    answer:
      'An ETF, or exchange-traded fund, is one basket holding many investments at once. Buy one share and you own a small slice of everything inside. It’s like catching a whole school of fish in one net. Reef 500 Index is a fictional ETF holding 500 large companies.',
    levels: [1],
  },
  {
    id: 'index',
    question: 'What is an index?',
    keywords: ['index', 's&p', 'market', 'track the market'],
    answer:
      'An index is a list of investments picked by simple rules, like “the 500 biggest US companies.” An index fund copies that list instead of trying to pick winners. With nobody making expensive picks, fees stay low. Reef 500 Index and Open Ocean Total Market are fictional index funds.',
    levels: [1],
  },
  {
    id: 'one-stock',
    question: 'Why not just buy one stock?',
    keywords: ['one stock', 'single stock', 'pick stocks', 'apple', 'tesla'],
    answer:
      'One stock ties your money to one company. If it stumbles, your whole investment feels it. A fund spreads your money across many companies, so one bad day matters much less. That spreading is diversification. Some people still own single stocks, but usually alongside a broad base.',
    levels: [1],
  },
  {
    id: 'reef-500',
    question: 'What is Reef 500?',
    keywords: ['reef 500', 'reef', 'biggest companies'],
    answer:
      'Reef 500 Index is a fictional fund that tracks 500 large US companies, similar to real S&P 500 funds. It charges just 0.03% a year and carries a Medium risk label. It’s the starting fund in The Shallows: broad, cheap, and a good base to build from.',
    levels: [1],
  },
  {
    id: 'stock',
    question: 'What is a stock?',
    keywords: ['stock', 'share', 'own a company', 'equity'],
    answer:
      'A stock, or share, is a tiny piece of ownership in a company. If the company grows, your share can rise in value. If it struggles, it can fall. Stock funds bundle many shares together so you’re not riding on just one company.',
    levels: [1],
  },
  {
    id: 'similar-funds',
    question: 'Why do my two funds look so similar?',
    keywords: ['similar', 'same', 'look alike', 'open ocean total market', 'total market'],
    answer:
      'Reef 500 Index holds big US companies and Open Ocean Total Market holds nearly every US company. Big companies make up most of both, so they move a lot alike. Holding both isn’t as diversified as it sounds. Deeper levels unlock bonds and international funds that behave differently.',
    levels: [1],
  },

  // Level 2: Risk and bonds
  {
    id: 'bond',
    question: 'What is a bond?',
    keywords: ['bond', 'kelp', 'lend', 'loan'],
    answer:
      'A bond is a loan you make to a government or company. They pay you interest and return the money later. Bonds usually grow slower than stocks but wobble much less. Kelp Forest Bond Fund and Tidepool Treasury Fund are fictional bond funds you just unlocked.',
    levels: [2],
  },
  {
    id: 'risk',
    question: 'What does risk mean here?',
    keywords: ['risk', 'risky', 'safe', 'volatility', 'volatile', 'swings'],
    answer:
      'Here, risk means how much a fund’s value tends to bounce around, called volatility. Higher risk can mean bigger growth over time, but also deeper dips along the way. Each fund has a Low, Medium, or High label, and your mix gets a blended one based on your slider weights.',
    levels: [2],
  },
  {
    id: 'slower-growth',
    question: 'Why would I want something that grows slower?',
    keywords: ['slower', 'slow', 'less return', 'boring', 'why bonds'],
    answer:
      'Because calm has value. Bonds act like a keel: they steady the boat when stocks get choppy. A smoother ride makes it easier to stay invested instead of panicking in a dip, and it matters more as you get close to needing the money. Slide some weight into bonds and watch your risk label shift.',
    levels: [2],
  },
  {
    id: 'risk-labels',
    question: 'What does Low / Medium / High mean on the funds?',
    keywords: ['low medium high', 'risk label', 'label', 'pill', 'badge'],
    answer:
      'Those labels are a quick guide to how bumpy each fund tends to be. Low funds, like the bond funds, move gently. Medium funds, like broad stock indexes, swing more. High funds, like Deep Trench Tech or Coral Small Cap, can rise and fall sharply. They describe the ride, not which fund is better.',
    levels: [2],
  },
  {
    id: 'treasury',
    question: 'What is the Tidepool Treasury Fund?',
    keywords: ['treasury', 'treasuries', 'tidepool', 'government'],
    answer:
      'Tidepool Treasury Fund is a fictional fund holding loans to the US government, called Treasuries. Governments are considered very likely to pay back, so these are among the calmest investments. The trade-off is a lower assumed return. It’s a gentle tidepool beside the open sea.',
    levels: [2],
  },

  // Level 3: Fees
  {
    id: 'expense-ratio',
    question: 'What is an expense ratio?',
    keywords: ['expense ratio', 'fee', 'cost', 'percentage'],
    answer:
      'An expense ratio is the yearly fee a fund charges, as a percent of what you have invested. A 0.10% ratio means $1 a year for every $1,000. It’s taken quietly from the fund, so you never see a bill. That’s exactly why it’s easy to overlook.',
    levels: [3],
  },
  {
    id: 'fee-matters',
    question: 'Why does 0.85% matter so much?',
    keywords: ['0.85', 'matter', 'small fee', 'big deal', 'add up'],
    answer:
      'It sounds tiny, but it’s charged every year on your whole balance, including past growth. Over decades that compounds into real money. Compare a 0.03% fund with a 0.85% one on the same mix and look at the fee drag number. Small currents, over a long swim, move you far.',
    levels: [3],
  },
  {
    id: 'who-gets-fee',
    question: 'Who gets the fee?',
    keywords: ['who gets', 'where does the fee go', 'pays', 'charged'],
    answer:
      'The company running the fund. Fees pay for managers, research, trading, and operations, plus some profit. Index funds need less of all that, so they can charge less. Active funds pay people to pick investments, which costs more and shows up in a higher expense ratio.',
    levels: [3],
  },
  {
    id: 'fee-drag',
    question: 'What is fee drag?',
    keywords: ['fee drag', 'drag', 'gap', 'shaded', 'two lines'],
    answer:
      'Fee drag is how much less you end up with because of fees, compared with the same mix at zero cost. On the chart it’s the shaded gap between the two lines. It grows over time because fees are a percent of a balance that keeps getting bigger.',
    levels: [3],
  },
  {
    id: 'blended-fee',
    question: 'What is my blended expense ratio?',
    keywords: ['blended', 'average fee', 'overall fee', 'total fee'],
    answer:
      'It’s the average fee across your whole mix, weighted by how much you hold of each fund. If 90% sits in a 0.03% fund and 10% in a 0.85% fund, the blend lands near 0.11%. You’ll find yours in the projection panel. Move a slider and watch it change.',
    levels: [3],
  },
  {
    id: 'international',
    question: 'Why invest in other countries?',
    keywords: ['international', 'other countries', 'far waters', 'global', 'abroad'],
    answer:
      'Different countries’ markets don’t always move together. When US stocks have a rough stretch, others may hold up, and the reverse. Far Waters International is a fictional fund holding companies outside the US. Adding some spreads your net across more of the ocean.',
    levels: [3, 5],
  },

  // Level 4: Active vs passive
  {
    id: 'active-passive',
    question: 'What does active vs passive mean?',
    keywords: ['active', 'passive', 'manager', 'captain', 'beat the market'],
    answer:
      'A passive fund copies an index and rarely trades. An active fund has managers, like a captain steering, who pick investments to try to beat the index. That work costs more. The big question is whether their picks beat the market by more than the extra fee. Over long periods, most don’t.',
    levels: [4],
  },
  {
    id: 'current-rider',
    question: 'Why is Current Rider so expensive?',
    keywords: ['current rider', 'expensive', 'active fund'],
    answer:
      'Current Rider Active Growth is a fictional active fund, so it pays a team to research and trade. That shows up as a 0.85% expense ratio, versus 0.03% for Reef 500 Index. Here they share the same assumed return, so the fee difference lands directly in your results.',
    levels: [4],
  },
  {
    id: 'tech-fund',
    question: 'Is a tech fund a good idea?',
    keywords: ['tech', 'deep trench', 'sector', 'one industry', 'concentrated'],
    answer:
      'I can’t say what’s right for you, but here’s the trade-off. Deep Trench Tech holds only tech companies. When tech booms, it can soar. When tech slumps, nothing else cushions the fall. That’s concentration risk, and why it carries a High label. Try a small slice versus a big one and compare.',
    levels: [4],
  },
  {
    id: 'index-cheap',
    question: 'Why are index funds so cheap?',
    keywords: ['cheap', 'low fee', 'low cost', 'inexpensive'],
    answer:
      'They follow a fixed list, so there’s no expensive team picking investments, and they trade less often. Lower costs mean lower fees for you. That’s why the fictional index funds here charge a few hundredths of a percent, while the active one charges 0.85%.',
    levels: [4],
  },

  // Level 5: Diversification
  {
    id: 'diversification',
    question: 'What is diversification?',
    keywords: ['diversify', 'diversified', 'diversification', 'diversifying', 'spread', 'eggs', 'basket'],
    answer:
      'Diversification means owning things that don’t all move together, like US stocks, international stocks, and bonds. When one dips, another may hold steady. It’s not just owning lots of funds; it’s owning different kinds. Your category mix in the projection panel shows how spread out you are.',
    levels: [5],
  },
  {
    id: 'small-cap',
    question: 'What is a small cap?',
    keywords: ['small cap', 'coral', 'small companies', 'tiny'],
    answer:
      '“Cap” is short for market capitalization, a company’s total value. Small-cap funds hold smaller companies. They can grow faster but tend to swing more. Coral Small Cap is a fictional example with a High label, so it adds both potential and bumpiness to your mix.',
    levels: [5],
  },
  {
    id: 'more-funds',
    question: 'Does owning more funds mean more diversified?',
    keywords: ['more funds', 'many funds', 'how many funds', 'too many'],
    answer:
      'Not always. Five funds that all hold big US companies are like five nets in the same patch of water. True diversification comes from owning different kinds of investments. Check your category exposure: if one category dominates, adding more of the same won’t help much.',
    levels: [5],
  },
  {
    id: 'rebalancing',
    question: 'What is rebalancing?',
    keywords: ['rebalance', 'rebalancing', 'drift', 'reset my mix'],
    answer:
      'Over time, faster-growing funds take up a bigger share of your portfolio, so your mix drifts. Rebalancing means nudging it back to your target percentages, often once a year. It keeps your risk level where you meant it to be instead of letting the current carry you.',
    levels: [5],
  },
  {
    id: 'start-later',
    question: 'What if I start 5 years later?',
    keywords: ['start later', 'wait', 'waiting', 'later', 'start now', 'early'],
    answer:
      'Starting later means fewer years for compounding, and the years you skip are the ones that would have grown longest. Try shortening your horizon by five years and compare the ending value. The gap is usually bigger than the five years of deposits you missed.',
    levels: [5],
  },
]

export const GUIDE_GREETINGS: Record<number, string> = {
  1: 'Welcome to The Shallows! Ask me anything about what an ETF actually is.',
  2: 'The Reef is where risk shows up. Curious how bonds calm the water?',
  3: 'Kelp Forest time: let’s untangle how tiny fees grow over the years.',
  4: 'Open Ocean! Ask me how active and passive funds really differ.',
  5: 'You made it to The Trench. Let’s talk diversification and time.',
}

const HELP_ENTRY = GUIDE_ENTRIES.find((e) => e.id === HELP_ENTRY_ID)!
const GENERAL_EXTRA = GUIDE_ENTRIES.find((e) => e.id === 'investing')!

/** Entries specific to a level, in the order listed. */
export function levelEntries(level: number): GuideEntry[] {
  return GUIDE_ENTRIES.filter((e) => e.levels !== 'all' && e.levels.includes(level))
}

/** Chip order: the help question, the level’s questions, then one more general question. */
export function chipsForLevel(level: number): string[] {
  return [HELP_ENTRY.question, ...levelEntries(level).map((e) => e.question), GENERAL_EXTRA.question]
}
