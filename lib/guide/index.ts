import 'server-only'
import { GUIDE_PERSONA } from '@/data/guidePersona'
import { levelEntries } from '@/data/guideAnswers'
import { geminiConfigured } from '@/lib/ai'
import { geminiProvider } from '@/lib/guide/gemini'
import { helpAnswer, isHelpRequest } from '@/lib/guide/match'
import { mockProvider } from '@/lib/guide/mock'
import type { ChatMessage, GuideGameState, GuideProviderName } from '@/lib/guide/types'

/** Without GEMINI_API_KEY, the scripted mock answers keep the guide usable offline. */
const geminiAvailable = geminiConfigured()

let announced = false
function announce() {
  if (announced) return
  announced = true
  console.log(`[guide] Active provider: ${geminiAvailable ? 'gemini' : 'mock'}`)
}

export async function guideReply(
  gameState: GuideGameState,
  messages: ChatMessage[],
): Promise<{ reply: string; provider: GuideProviderName }> {
  announce()
  const level = gameState.level
  const input = {
    persona: GUIDE_PERSONA,
    gameState,
    messages,
    topics: levelEntries(level).map((e) => e.question),
  }
  if (geminiAvailable) {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user')
    // Keep the capability description identical in both modes.
    if (lastUser && isHelpRequest(lastUser.text, level)) {
      return { reply: helpAnswer(level), provider: 'gemini' }
    }
    try {
      return { reply: await geminiProvider.reply(input), provider: 'gemini' }
    } catch (error) {
      console.error('[guide] Gemini failed, using mock:', error instanceof Error ? error.message : error)
    }
  }
  return { reply: await mockProvider.reply(input), provider: 'mock' }
}
