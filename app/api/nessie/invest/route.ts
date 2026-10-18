import { z } from 'zod'
import { hasNessieKey, isSafeId, nessieFetch } from '@/lib/nessie'

const bodySchema = z.object({
  accountId: z.string().nullable(),
  amount: z.number().positive().max(5000),
})

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return Response.json({ ok: false, error: 'Invalid request' }, { status: 400 })
  }
  const { accountId, amount } = parsed.data

  if (!hasNessieKey() || !accountId || !isSafeId(accountId)) {
    return Response.json({ ok: true, mocked: true })
  }

  try {
    await nessieFetch(`/accounts/${accountId}/withdrawals`, {
      method: 'POST',
      body: JSON.stringify({
        medium: 'balance',
        transaction_date: new Date().toISOString().slice(0, 10),
        amount: Math.round(amount * 100) / 100,
        description: 'DiveFund simulated investment',
      }),
    })
    return Response.json({ ok: true, mocked: false })
  } catch (error) {
    console.error('[nessie] invest failed:', error)
    return Response.json({ ok: true, mocked: true })
  }
}
