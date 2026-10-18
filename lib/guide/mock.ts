import type { GuideProvider } from '@/lib/guide/provider'
import { scriptedReply } from '@/lib/guide/match'

export const mockProvider: GuideProvider = {
  async reply({ gameState, messages }) {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user')
    return scriptedReply(lastUser?.text ?? '', gameState.level)
  },
}
