'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Anchor, Loader2 } from 'lucide-react'
import { useGame } from '@/components/game-provider'
import { Button } from '@/components/ui/button'
import { BADGES } from '@/lib/game'
import { formatMoney } from '@/lib/format'

export function ActCard({ level }: { level: number }) {
  const { state, lockIn } = useGame()
  const [pending, setPending] = useState(false)
  const count = state.lockInsByLevel[level] ?? 0

  async function handleLockIn() {
    setPending(true)
    let mocked = true
    try {
      const res = await fetch('/api/nessie/invest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: state.diver?.accountId ?? null, amount: state.monthlyContribution }),
      })
      if (res.ok) mocked = Boolean((await res.json()).mocked)
    } catch {
      // Sandbox unreachable; the simulated lock-in still counts.
    }
    const events = lockIn(level)
    setPending(false)

    toast.success(`+${events.xpGained} XP · ${formatMoney(state.monthlyContribution)} locked in`, {
      description: mocked ? 'Recorded as a practice transfer.' : 'Recorded in the Nessie sandbox.',
    })
    for (const id of events.newBadges) {
      toast(`Badge earned: ${BADGES[id].name}`, { description: BADGES[id].description })
    }
  }

  return (
    <section aria-labelledby="act-heading" className="flex flex-col gap-3 rounded-3xl bg-card p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 id="act-heading" className="font-heading font-semibold">
          Lock in this month
        </h2>
        <span className="text-sm tabular-nums text-muted-foreground">
          {count} {count === 1 ? 'time' : 'times'} here
        </span>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Practice the habit: send {formatMoney(state.monthlyContribution)} from {state.diver?.name ?? 'your'}
        {"'s"} demo account into this mix. No real money moves.
      </p>
      <Button size="lg" className="h-12 rounded-full text-base" onClick={handleLockIn} disabled={pending}>
        {pending ? (
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
        ) : (
          <Anchor className="size-5" aria-hidden="true" />
        )}
        {pending ? 'Locking in…' : `Lock in ${formatMoney(state.monthlyContribution)}`}
      </Button>
    </section>
  )
}
