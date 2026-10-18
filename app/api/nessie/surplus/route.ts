import mockSurplus from '@/data/mock/surplus.json'
import {
  hasNessieKey,
  isSafeId,
  nessieFetch,
  type NessieAccount,
  type NessieTransaction,
} from '@/lib/nessie'
import type { SurplusMonth, SurplusResult } from '@/lib/types'

function mockResult(accountId: string | null = null): SurplusResult {
  return { ...(mockSurplus as SurplusResult), accountId, mocked: true }
}

function monthKey(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
}

function lastSixMonths(): string[] {
  const now = new Date()
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5 + i, 1))
    return monthKey(d)
  })
}

function bucket(transactions: NessieTransaction[], months: string[]): Record<string, number> {
  const totals: Record<string, number> = Object.fromEntries(months.map((m) => [m, 0]))
  for (const t of transactions) {
    const raw = t.transaction_date ?? t.purchase_date
    if (!raw || typeof t.amount !== 'number' || t.status === 'cancelled') continue
    const key = raw.slice(0, 7)
    if (key in totals) totals[key] += t.amount
  }
  return totals
}

export async function GET(request: Request) {
  const customerId = new URL(request.url).searchParams.get('customerId') ?? ''
  if (!hasNessieKey() || customerId.startsWith('mock-') || !isSafeId(customerId)) {
    return Response.json(mockResult())
  }

  try {
    const accounts = await nessieFetch<NessieAccount[]>(`/customers/${customerId}/accounts`)
    const account = accounts.find((a) => a.type === 'Checking') ?? accounts[0]
    if (!account) return Response.json(mockResult())

    const [deposits, purchases, withdrawals] = await Promise.all([
      nessieFetch<NessieTransaction[]>(`/accounts/${account._id}/deposits`).catch(() => []),
      nessieFetch<NessieTransaction[]>(`/accounts/${account._id}/purchases`).catch(() => []),
      nessieFetch<NessieTransaction[]>(`/accounts/${account._id}/withdrawals`).catch(() => []),
    ])

    const months = lastSixMonths()
    const dep = bucket(deposits, months)
    const spendPurchases = bucket(purchases, months)
    const spendWithdrawals = bucket(withdrawals, months)
    const series: SurplusMonth[] = months.map((m) => ({
      month: m,
      deposits: Math.round(dep[m]),
      spending: Math.round(spendPurchases[m] + spendWithdrawals[m]),
    }))

    const hasActivity = series.some((s) => s.deposits > 0 || s.spending > 0)
    if (!hasActivity) return Response.json(mockResult(account._id))

    const averageDeposits = Math.round(series.reduce((a, s) => a + s.deposits, 0) / series.length)
    const averageSpending = Math.round(series.reduce((a, s) => a + s.spending, 0) / series.length)
    const result: SurplusResult = {
      accountId: account._id,
      months: series,
      averageDeposits,
      averageSpending,
      monthlySurplus: Math.max(0, averageDeposits - averageSpending),
      mocked: false,
    }
    return Response.json(result)
  } catch (error) {
    console.error('[nessie] surplus failed:', error)
    return Response.json(mockResult())
  }
}
