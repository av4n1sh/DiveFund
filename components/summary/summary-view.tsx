'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { RotateCcw } from 'lucide-react'
import { useGame } from '@/components/game-provider'
import { Button, buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { postJson } from '@/hooks/use-guide-context'
import { FUND_BY_ID } from '@/lib/funds'
import { BADGES } from '@/lib/game'
import { formatMoney } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { FundId } from '@/lib/types'

export function SummaryView() {
  const { state, sim, hydrated, reset } = useGame()
  const router = useRouter()

  const allocation: Partial<Record<FundId, number>> = {}
  for (const [id, v] of Object.entries(state.allocation) as [FundId, number][]) if (v > 0) allocation[id] = v

  const body = {
    context: {
      level: Math.max(1, state.currentLevel),
      mode: state.mode,
      monthlyContribution: state.monthlyContribution,
      horizonYears: state.horizonYears,
      allocation,
    },
    levelsCompleted: state.passedQuizzes.length,
    badges: state.badges.map((b) => BADGES[b].name),
  }
  const { data } = useSWR<{ lessons: string[] }>(hydrated ? ['/api/guide/summary', body] : null, postJson, {
    revalidateOnFocus: false,
  })

  if (!hydrated) return <Skeleton className="h-96 rounded-3xl" />

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-primary">Back at the surface</p>
        <h1 className="text-balance font-heading text-4xl font-bold tracking-tight">
          {state.diver ? `${state.diver.name.split(' ')[0]}'s dive log` : 'Your dive log'}
        </h1>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="XP" value={String(state.xp)} />
        <Stat label="Depths cleared" value={`${state.passedQuizzes.length}/5`} />
        <Stat label="Practice locked in" value={formatMoney(state.totalLockedIn)} />
        <Stat label="Streak" value={`${state.streak}`} />
      </dl>

      <section aria-labelledby="lessons-heading" className="flex flex-col gap-3 rounded-3xl bg-card p-6">
        <h2 id="lessons-heading" className="font-heading text-xl font-semibold">
          What you learned
        </h2>
        {data ? (
          <ul className="flex flex-col gap-2">
            {data.lessons.map((l, i) => (
              <li key={i} className="text-pretty leading-relaxed">
                {l}
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        )}
      </section>

      <section aria-labelledby="mix-heading" className="flex flex-col gap-3 rounded-3xl bg-card p-6">
        <h2 id="mix-heading" className="font-heading text-xl font-semibold">
          Your final mix
        </h2>
        <ul className="flex flex-col gap-2">
          {(Object.entries(allocation) as [FundId, number][]).map(([id, v]) => (
            <li key={id} className="flex items-center gap-3">
              <span className="w-40 shrink-0 truncate text-sm">{FUND_BY_ID[id].name}</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                <span className="block h-full rounded-full bg-primary" style={{ width: `${v}%` }} />
              </span>
              <span className="w-10 text-right text-sm tabular-nums">{v}%</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">
          Projected {formatMoney(sim.endingValue)} after {state.horizonYears} years, with{' '}
          {formatMoney(sim.feeDrag)} lost to fees.
        </p>
      </section>

      <section aria-labelledby="badges-heading" className="flex flex-col gap-3 rounded-3xl bg-card p-6">
        <h2 id="badges-heading" className="font-heading text-xl font-semibold">
          Badges
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {(Object.keys(BADGES) as (keyof typeof BADGES)[]).map((id) => {
            const earned = state.badges.includes(id)
            return (
              <li key={id} className={cn('flex flex-col gap-1 rounded-2xl p-3', earned ? 'bg-xp text-xp-foreground' : 'bg-secondary opacity-60')}>
                <span className="font-semibold">{BADGES[id].name}</span>
                <span className={cn('text-sm', earned ? 'text-xp-foreground/80' : 'text-muted-foreground')}>
                  {BADGES[id].description}
                </span>
              </li>
            )
          })}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href={`/dive/${state.currentLevel}`} className={cn(buttonVariants({ size: 'lg' }), 'h-12 rounded-full px-6')}>
          Keep exploring
        </Link>
        <Button
          variant="secondary"
          size="lg"
          className="h-12 rounded-full px-6"
          onClick={() => {
            reset()
            router.push('/')
          }}
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Start a new dive
        </Button>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl bg-card p-4">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-heading text-2xl font-bold tabular-nums">{value}</dd>
    </div>
  )
}
