import { z } from 'zod'
import { guideReply } from '@/lib/guide'

export const maxDuration = 30

const messageSchema = z.object({
  id: z.string().max(64),
  role: z.enum(['user', 'guide']),
  text: z.string().min(1).max(1200),
  tip: z.boolean().optional(),
})

const gameStateSchema = z.object({
  level: z.number().int().min(1).max(10),
  levelName: z.string().max(60),
  conceptTitle: z.string().max(80),
  allocation: z
    .array(
      z.object({
        fundName: z.string().max(60),
        percent: z.number().min(0).max(100),
        expenseRatio: z.number().min(0).max(0.05),
      }),
    )
    .max(10),
  monthlyContribution: z.number().min(0).max(100_000),
  horizonYears: z.number().min(0).max(60),
  projectedEndingValue: z.number().min(0).max(1e10),
  totalFees: z.number().min(0).max(1e10),
  blendedExpenseRatio: z.number().min(0).max(0.05),
  mode: z.enum(['beginner', 'advanced']),
})

const bodySchema = z.object({
  messages: z.array(messageSchema).min(1).max(10),
  gameState: gameStateSchema,
})

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }
  const { messages, gameState } = parsed.data
  const result = await guideReply(gameState, messages)
  return Response.json(result)
}
