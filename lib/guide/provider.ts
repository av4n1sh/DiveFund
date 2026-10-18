import type { ChatMessage, GuideGameState } from '@/lib/guide/types'

export type GameState = GuideGameState

export interface GuideProvider {
  reply(input: { persona: string; gameState: GameState; messages: ChatMessage[]; topics?: string[] }): Promise<string>
}
