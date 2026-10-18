import { z } from 'zod'
import { SAFETY_RULES, geminiObject } from '@/lib/ai'
import { describeContext, guideContextSchema } from '@/lib/guide-context'
import { getLevel } from '@/data/levels'
import { FALLBACK_QUIZZES } from '@/data/fallbacks'

const quizSchema = z.object({
  questions: z
    .array(
      z.object({
        question: z.string(),
        options: z.array(z.string()).length(4),
        correctIndex: z.number().int().min(0).max(3),
        explanation: z.string().describe('One sentence explaining the correct answer.'),
      }),
    )
    .length(3),
})

export async function POST(request: Request) {
  const parsed = guideContextSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: 'Invalid request' }, { status: 400 })
  const context = parsed.data
  const level = getLevel(context.level)

  try {
    const output = await geminiObject({
      schema: quizSchema,
      system: `You write a 3-question multiple-choice depth check for DiveFund. Questions test the lesson "${level?.conceptTitle}": ${level?.conceptBody.replace(/\{\{\w+:([^}]+)\}\}/g, '$1')}
At least one question should reference the user's own portfolio numbers. Exactly one option is correct; vary which position is correct. Keep options short.
${SAFETY_RULES}`,
      prompt: describeContext(context),
    })
    return Response.json({ questions: output.questions, fallback: false })
  } catch (error) {
    console.error('[guide] quiz failed:', error)
    return Response.json({ questions: FALLBACK_QUIZZES[context.level], fallback: true })
  }
}
