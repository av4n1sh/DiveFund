'use client'

import { Slider } from '@/components/ui/slider'
import { Term } from '@/components/term'
import { formatPercent } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Fund, Mode } from '@/lib/types'

const VOL_STYLE: Record<Fund['volatility'], string> = {
  Low: 'bg-chart-1/20 text-foreground',
  Medium: 'bg-xp/25 text-foreground',
  High: 'bg-destructive/25 text-foreground',
}

export function FundRow({
  fund,
  value,
  mode,
  onChange,
}: {
  fund: Fund
  value: number
  mode: Mode
  onChange: (value: number) => void
}) {
  const sliderId = `fund-${fund.id}`
  return (
    <li className={cn('flex flex-col gap-3 rounded-2xl p-4 transition-colors', value > 0 ? 'bg-accent' : 'bg-secondary')}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <label htmlFor={sliderId} className="font-heading text-lg font-semibold leading-tight">
            {fund.name}
          </label>
          <p className="text-sm text-muted-foreground">{fund.tagline}</p>
        </div>
        <span className="font-heading text-2xl font-bold tabular-nums">{value}%</span>
      </div>
      <Slider
        id={sliderId}
        aria-label={`${fund.name} allocation`}
        min={0}
        max={100}
        step={1}
        value={[value]}
        onValueChange={(v) => onChange(Array.isArray(v) ? v[0] : (v as number))}
      />
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-background/40 px-2 py-0.5">{fund.category}</span>
        <span className={cn('rounded-full px-2 py-0.5', VOL_STYLE[fund.volatility])}>
          <Term termKey="volatility">{fund.volatility} swings</Term>
        </span>
        <span className="rounded-full bg-background/40 px-2 py-0.5 tabular-nums">
          <Term termKey="expenseRatio">Fee</Term> {formatPercent(fund.expenseRatio)}
        </span>
        {mode === 'advanced' && (
          <span className="rounded-full bg-background/40 px-2 py-0.5 tabular-nums">
            Assumed {formatPercent(fund.assumedAnnualReturn, 1)}/yr
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {mode === 'advanced' ? fund.advancedDescription : fund.beginnerDescription}
      </p>
    </li>
  )
}
