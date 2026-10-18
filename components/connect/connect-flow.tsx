'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { ArrowRight, Check, Info } from 'lucide-react'
import { useGame } from '@/components/game-provider'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Slider } from '@/components/ui/slider'
import { SurplusChart } from '@/components/connect/surplus-chart'
import { formatMoney } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { NessieCustomer, SurplusResult } from '@/lib/types'

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error('Request failed')
    return r.json()
  })

function suggestedFromSurplus(surplus: number): number {
  return Math.min(1000, Math.max(25, Math.round((surplus * 0.25) / 5) * 5))
}

export function ConnectFlow() {
  const router = useRouter()
  const { setDiver } = useGame()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [contribution, setContribution] = useState<number | null>(null)

  const customers = useSWR<{ customers: NessieCustomer[]; mocked: boolean }>('/api/nessie/customers', fetcher)
  const surplus = useSWR<SurplusResult>(
    selectedId ? `/api/nessie/surplus?customerId=${encodeURIComponent(selectedId)}` : null,
    fetcher,
  )

  const selected = customers.data?.customers.find((c) => c._id === selectedId) ?? null
  const suggested = surplus.data ? suggestedFromSurplus(surplus.data.monthlySurplus) : 100
  const amount = contribution ?? suggested
  const mocked = customers.data?.mocked || surplus.data?.mocked

  function begin() {
    if (!selected) return
    setDiver(
      {
        customerId: selected._id,
        name: `${selected.first_name} ${selected.last_name}`,
        accountId: surplus.data?.accountId ?? null,
        mocked: Boolean(mocked),
      },
      amount,
    )
    router.push('/dive/1')
  }

  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="diver-heading" className="flex flex-col gap-3 rounded-3xl bg-card p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 id="diver-heading" className="font-heading text-lg font-semibold">
            1. Choose a diver
          </h2>
          {mocked && (
            <span className="flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
              <Info className="size-3" aria-hidden="true" />
              Demo data
            </span>
          )}
        </div>
        {customers.isLoading ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 rounded-2xl" />
            ))}
          </div>
        ) : customers.error ? (
          <p className="text-sm text-destructive">Could not load divers. Refresh to try again.</p>
        ) : (
          <div role="radiogroup" aria-label="Practice divers" className="grid gap-2 sm:grid-cols-2">
            {customers.data?.customers.map((c) => {
              const active = c._id === selectedId
              return (
                <button
                  key={c._id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => {
                    setSelectedId(c._id)
                    setContribution(null)
                  }}
                  className={cn(
                    'flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors',
                    active ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-secondary hover:bg-accent',
                  )}
                >
                  <span className="font-medium">
                    {c.first_name} {c.last_name}
                  </span>
                  {active && <Check className="size-4" aria-hidden="true" />}
                </button>
              )
            })}
          </div>
        )}
      </section>

      {selectedId && (
        <section aria-labelledby="surplus-heading" className="flex flex-col gap-5 rounded-3xl bg-card p-5 animate-pop">
          <h2 id="surplus-heading" className="font-heading text-lg font-semibold">
            2. Find your monthly air supply
          </h2>
          {surplus.isLoading || !surplus.data ? (
            <Skeleton className="h-48 rounded-2xl" />
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3 text-center">
                <Stat label="Avg. in" value={formatMoney(surplus.data.averageDeposits)} />
                <Stat label="Avg. out" value={formatMoney(surplus.data.averageSpending)} />
                <Stat label="Left over" value={formatMoney(surplus.data.monthlySurplus)} highlight />
              </div>
              <SurplusChart months={surplus.data.months} />
              <div className="flex flex-col gap-3 rounded-2xl bg-secondary p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <label htmlFor="contribution" className="font-medium">
                    Monthly amount to practice with
                  </label>
                  <span className="font-heading text-2xl font-bold tabular-nums">{formatMoney(amount)}</span>
                </div>
                <Slider
                  id="contribution"
                  min={25}
                  max={1000}
                  step={5}
                  value={[amount]}
                  onValueChange={(v) => setContribution(Array.isArray(v) ? v[0] : v)}
                  aria-label="Monthly contribution"
                />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  We suggest about a quarter of what&apos;s left over ({formatMoney(suggested)}), so there&apos;s still room
                  for surprises.
                </p>
              </div>
            </>
          )}
        </section>
      )}

      <Button
        size="lg"
        className="h-12 self-end rounded-full px-6 text-base"
        disabled={!selected || !surplus.data}
        onClick={begin}
      >
        Begin the dive
        <ArrowRight className="size-5" aria-hidden="true" />
      </Button>
    </div>
  )
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={cn('flex flex-col gap-1 rounded-2xl p-3', highlight ? 'bg-xp text-xp-foreground' : 'bg-secondary')}>
      <span className={cn('text-xs', highlight ? 'text-xp-foreground/80' : 'text-muted-foreground')}>{label}</span>
      <span className="font-heading text-lg font-bold tabular-nums">{value}</span>
    </div>
  )
}
