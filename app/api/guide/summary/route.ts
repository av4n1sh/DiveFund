import { z } from 'zod'
import { SAFETY_RULES, geminiObject } from '@/lib/ai'
import { describeContext, guideContextSchema } from '@/lib/guide-context'
import { fallbackSummary } from '@/data/fallbacks'

const bodySchema = z.object({
  context: guideContextSchema,
  levelsCompleted: z.number().int().min(0).max(5),
  badges: z.array(z.string().max(40)).max(10),
})

const summarySchema = z.object({
  lessons: z.array(z.string().describe('One sentence lesson, under 20 words.')).min(3).max(5),
})

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: 'Invalid request' }, { status: 400 })
  const { context, levelsCompleted, badges } = parsed.data

  try {
    const output = await geminiObject({
      schema: summarySchema,
      system: `Summarize what this diver learned in DiveFund as 3-5 personalized lessons, written as "You learned..." style sentences tied to their final portfolio.\n${SAFETY_RULES}`,
      prompt: `${describeContext(context)}\nLevels completed: ${levelsCompleted}\nBadges: ${badges.join(', ') || 'none'}`,
    })
    return Response.json({ lessons: output.lessons, fallback: false })
  } catch (error) {
    console.error('[guide] summary failed:', error)
    return Response.json({ lessons: fallbackSummary(levelsCompleted), fallback: true })
  }
}
