'use client'

import { useGame } from '@/components/game-provider'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Term } from '@/components/term'
import { FundRow } from '@/components/dive/fund-row'
import { unlockedFunds } from '@/lib/funds'
import { formatMoney } from '@/lib/format'
import { PRESETS } from '@/lib/presets'

function first(v: number | readonly number[]): number {
  return Array.isArray(v) ? v[0] : (v as number)
}

export function BuildCard() {
  const { state, setFundWeight, applyPreset, setMonthlyContribution, setHorizonYears } = useGame()
  const funds = unlockedFunds(state.currentLevel)
  const total = Object.values(state.allocation).reduce((a, b) => a + b, 0)

  return (
    <section aria-labelledby="build-heading" className="flex flex-col gap-6 rounded-3xl bg-card p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 id="build-heading" className="font-heading text-2xl font-bold">
            Build your mix
          </h2>
          <p className="text-sm text-muted-foreground">
            Sliders always add up to 100%. Moving one nudges the others.
          </p>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-sm font-semibold tabular-nums" aria-live="polite">
          Total {total}%
        </span>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Quick mixes">
        {PRESETS.map((p) => (
          <Button
            key={p.id}
            variant="secondary"
            className="h-auto flex-col items-start gap-0 rounded-2xl px-4 py-2 text-left"
            onClick={() => applyPreset(p.id)}
            disabled={funds.length < 2}
          >
            <span className="font-semibold">{p.label}</span>
            <span className="text-xs font-normal text-muted-foreground">{p.description}</span>
          </Button>
        ))}
      </div>

      <ul className="flex flex-col gap-3">
        {funds.map((fund) => (
          <FundRow
            key={fund.id}
            fund={fund}
            value={state.allocation[fund.id]}
            mode={state.mode}
            onChange={(v) => setFundWeight(fund.id, v)}
          />
        ))}
      </ul>

      <div className="grid gap-6 border-t border-border pt-6 sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <label htmlFor="monthly" className="text-sm font-medium">
              Monthly contribution
            </label>
            <span className="font-heading text-lg font-bold tabular-nums">{formatMoney(state.monthlyContribution)}</span>
          </div>
          <Slider
            id="monthly"
            aria-label="Monthly contribution"
            min={10}
            max={1000}
            step={5}
            value={[Math.min(1000, state.monthlyContribution)]}
            onValueChange={(v) => setMonthlyContribution(first(v))}
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <label htmlFor="horizon" className="text-sm font-medium">
              <Term termKey="timeHorizon">Time in the water</Term>
            </label>
            <span className="font-heading text-lg font-bold tabular-nums">{state.horizonYears} yrs</span>
          </div>
          <Slider
            id="horizon"
            aria-label="Years invested"
            min={5}
            max={40}
            step={1}
            value={[state.horizonYears]}
            onValueChange={(v) => setHorizonYears(first(v))}
          />
        </div>
      </div>
    </section>
  )
}
