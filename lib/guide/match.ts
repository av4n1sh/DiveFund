import { chipsForLevel, GUIDE_ENTRIES, HELP_ENTRY_ID, levelEntries, type GuideEntry } from '@/data/guideAnswers'
import { getLevel } from '@/data/levels'

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9%\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Whole-word (or whole-phrase) match, tolerating a plural "s"/"es" or a trailing "%". */
function keywordPattern(keyword: string): RegExp {
  return new RegExp(`(?:^| )${escapeRegExp(keyword)}(?:s|es|%)?(?= |$)`)
}

const PREPARED = GUIDE_ENTRIES.map((entry) => ({
  entry,
  question: normalize(entry.question),
  keywords: entry.keywords
    .map(normalize)
    .filter(Boolean)
    .map((kw) => ({ kw, pattern: keywordPattern(kw) })),
}))

const includesLevel = (entry: GuideEntry, level: number) => entry.levels === 'all' || entry.levels.includes(level)

export function matchEntry(message: string, level: number): GuideEntry | null {
  const msg = normalize(message)
  if (!msg) return null

  let best: { entry: GuideEntry; score: number; length: number } | null = null
  for (const { entry, question, keywords } of PREPARED) {
    const hits = keywords.filter(({ pattern }) => pattern.test(msg))
    const score = hits.length + (msg.includes(question) ? 1 : 0)
    if (score < 1) continue
    const length = hits.reduce((n, h) => n + h.kw.length, 0)
    if (!best || beats({ entry, score, length }, best, level)) best = { entry, score, length }
  }
  return best?.entry ?? null
}

function beats(
  a: { entry: GuideEntry; score: number; length: number },
  b: { entry: GuideEntry; score: number; length: number },
  level: number,
): boolean {
  if (a.score !== b.score) return a.score > b.score
  const aLevel = includesLevel(a.entry, level)
  const bLevel = includesLevel(b.entry, level)
  if (aLevel !== bLevel) return aLevel
  // A generic "help" word should never outrank a real topic on a tie.
  const aHelp = a.entry.id === HELP_ENTRY_ID
  const bHelp = b.entry.id === HELP_ENTRY_ID
  if (aHelp !== bHelp) return bHelp
  return a.length > b.length
}

export function isHelpRequest(message: string, level: number): boolean {
  return matchEntry(message, level)?.id === HELP_ENTRY_ID
}

const quoteList = (items: string[]) => {
  const quoted = items.map((q) => `“${q}”`)
  if (quoted.length <= 1) return quoted.join('')
  return `${quoted.slice(0, -1).join(', ')}, or ${quoted.at(-1)}`
}

export function helpAnswer(level: number): string {
  const levelName = getLevel(level)?.name ?? 'The Shallows'
  const starters = levelEntries(level)
    .slice(0, 3)
    .map((e) => e.question)
  return `I can explain the basics as you dive: what ETFs and index funds are, how bonds and risk work, what fees do to your money over time, active vs passive investing, and why spreading your money around matters. I can also talk about what's in your portfolio right now and what the chart is showing. You're at ${levelName}, so a good place to start is: ${quoteList(starters)}. I can't tell you what to do with real money, this is a learning game.`
}

const GREETING_WORDS = new Set(['hi', 'hello', 'hey', 'hiya', 'howdy', 'yo'])
const THANKS_WORDS = new Set(['thanks', 'thank', 'thx', 'ty', 'cheers'])

const bullets = (items: string[]) => items.map((q) => `• ${q}`).join('\n')

function suggestions(level: number, count: number): string[] {
  const own = levelEntries(level).map((e) => e.question)
  const general = chipsForLevel(level).filter((q) => !own.includes(q))
  return [...own, ...general].slice(0, count)
}

/** Full offline reply: best keyword match, else a greeting, else suggestions. */
export function scriptedReply(message: string, level: number): string {
  const entry = matchEntry(message, level)
  if (entry) return entry.id === HELP_ENTRY_ID ? helpAnswer(level) : entry.answer

  const words = normalize(message).split(' ')
  if (words.some((w) => THANKS_WORDS.has(w))) {
    return `Anytime! Glad to dive with you. You could also ask:\n${bullets(chipsForLevel(level).slice(0, 4))}`
  }
  if (words.some((w) => GREETING_WORDS.has(w))) {
    return `Hi there! Ready when you are. Try one of these:\n${bullets(chipsForLevel(level).slice(0, 4))}`
  }
  return `I'm not sure about that one yet. Here are some things I can explain:\n${bullets(suggestions(level, 4))}`
}
