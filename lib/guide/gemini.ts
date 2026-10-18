import 'server-only'
import { geminiText, type GeminiTurn } from '@/lib/ai'
import { formatMoney, formatPercent } from '@/lib/format'
import type { GameState, GuideProvider } from '@/lib/guide/provider'
import type { ChatMessage } from '@/lib/guide/types'

function serializeGameState(gs: GameState): string {
  return JSON.stringify(
    {
      level: gs.levelName,
      concept: gs.conceptTitle,
      mode: gs.mode,
      allocation: gs.allocation.map((h) => ({
        fund: h.fundName,
        percent: h.percent,
        expenseRatio: formatPercent(h.expenseRatio),
      })),
      monthlyContribution: formatMoney(gs.monthlyContribution),
      horizonYears: gs.horizonYears,
      projectedEndingValue: formatMoney(gs.projectedEndingValue),
      totalFees: formatMoney(gs.totalFees),
      blendedExpenseRatio: formatPercent(gs.blendedExpenseRatio),
    },
    null,
    2,
  )
}

/** Gemini rejects back-to-back turns from the same role, so merge them. */
function toTurns(messages: ChatMessage[]): GeminiTurn[] {
  const out: GeminiTurn[] = []
  for (const m of messages) {
    const role = m.role === 'user' ? 'user' : 'model'
    const last = out.at(-1)
    if (last && last.role === role) last.text += `\n\n${m.text}`
    else out.push({ role, text: m.text })
  }
  return out
}

export const geminiProvider: GuideProvider = {
  async reply({ persona, gameState, messages, topics }) {
    const topicNote = topics?.length
      ? `\n\nTopics the user may be curious about at this level (stay on this ground):\n${topics.map((t) => `- ${t}`).join('\n')}`
      : ''
    return geminiText({
      system: persona + topicNote,
      turns: [
        { role: 'user', text: `Here is my current gameState:\n${serializeGameState(gameState)}` },
        { role: 'model', text: 'Got it. I’ll use those numbers when they help.' },
        ...toTurns(messages),
      ],
      timeoutMs: 15_000,
    })
  },
}
