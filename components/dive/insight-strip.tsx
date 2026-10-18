'use client'

import useSWR from 'swr'
import { Sparkles } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { postJson, useDebounced, useGuideContext } from '@/hooks/use-guide-context'

interface InsightResponse {
  insight: { holding: string; risk: string; consider: string }
  fallback: boolean
}

export function InsightStrip({ level }: { level: number }) {
  const context = useDebounced(useGuideContext(level), 900)
  const { data, isLoading } = useSWR<InsightResponse>(['/api/guide/insight', context], postJson, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  })

  return (
    <section aria-labelledby="insight-heading" aria-live="polite" className="flex flex-col gap-3 rounded-3xl bg-card p-5">
      <h2 id="insight-heading" className="flex items-center gap-2 font-heading font-semibold">
        <Sparkles className="size-4 text-xp" aria-hidden="true" />
        {"Finn's read on your mix"}
      </h2>
      {!data && isLoading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      ) : data ? (
        <dl className={isLoading ? 'flex flex-col gap-2 opacity-60 transition-opacity' : 'flex flex-col gap-2 transition-opacity'}>
          <Row label="Holding" text={data.insight.holding} />
          <Row label="Risk" text={data.insight.risk} />
          <Row label="Try" text={data.insight.consider} />
        </dl>
      ) : (
        <p className="text-sm text-muted-foreground">Move a slider to get a read on your mix.</p>
      )}
    </section>
  )
}

function Row({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex gap-3 text-sm leading-relaxed">
      <dt className="w-16 shrink-0 font-semibold text-primary">{label}</dt>
      <dd className="text-pretty">{text}</dd>
    </div>
  )
}
