import { z } from 'zod'
import { SAFETY_RULES, geminiObject } from '@/lib/ai'
import { describeContext, guideContextSchema, simulateContext } from '@/lib/guide-context'
import { fallbackInsight } from '@/data/fallbacks'

const insightSchema = z.object({
  holding: z.string().describe('One sentence: what the user is mostly holding.'),
  risk: z.string().describe('One sentence: what that means for risk or bumpiness.'),
  consider: z.string().describe('One sentence: a learning experiment to try in the simulator, not advice.'),
})

export async function POST(request: Request) {
  const parsed = guideContextSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: 'Invalid request' }, { status: 400 })
  const context = parsed.data

  try {
    const output = await geminiObject({
      schema: insightSchema,
      system: `You write a 3-part portfolio insight for DiveFund, an educational simulator. Each part is one short sentence under 22 words.\n${SAFETY_RULES}`,
      prompt: describeContext(context),
    })
    return Response.json({ insight: output, fallback: false })
  } catch (error) {
    console.error('[guide] insight failed:', error)
    return Response.json({
      insight: fallbackInsight(context.allocation, simulateContext(context)),
      fallback: true,
    })
  }
}
