'use client'

import { Area, AreaChart, CartesianGrid, Line, XAxis, YAxis } from 'recharts'
import { useGame } from '@/components/game-provider'
import { Term } from '@/components/term'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { formatCompact, formatMoney, formatPercent } from '@/lib/format'

const config = {
  portfolio: { label: 'Your mix', color: 'var(--chart-1)' },
  noFees: { label: 'With zero fees', color: 'var(--chart-2)' },
  contributed: { label: 'You put in', color: 'var(--chart-3)' },
} satisfies ChartConfig

export function ProjectionPanel() {
  const { sim, state } = useGame()
  const advanced = state.mode === 'advanced'

  return (
    <section aria-labelledby="projection-heading" className="flex flex-col gap-4 rounded-3xl bg-card p-5">
      <div className="flex flex-col gap-1">
        <h2 id="projection-heading" className="text-sm font-medium text-muted-foreground">
          Projected after {state.horizonYears} years
        </h2>
        <p className="font-heading text-4xl font-bold tabular-nums tracking-tight" aria-live="polite">
          {formatMoney(sim.endingValue)}
        </p>
        <p className="text-sm text-muted-foreground">
          from {formatMoney(sim.totalContributed)} of your own money, using fixed assumed returns
        </p>
      </div>

      <ChartContainer config={config} className="h-52 w-full" aria-label="Projected portfolio growth by year">
        <AreaChart data={sim.series} margin={{ left: 0, right: 4, top: 8 }}>
          <defs>
            <linearGradient id="fillPortfolio" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-portfolio)" stopOpacity={0.5} />
              <stop offset="95%" stopColor="var(--color-portfolio)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeOpacity={0.12} />
          <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(y) => `Y${y}`} />
          <YAxis tickLine={false} axisLine={false} width={44} tickFormatter={(v) => formatCompact(v)} />
          <ChartTooltip content={<ChartTooltipContent labelFormatter={(_, p) => `Year ${p?.[0]?.payload?.year ?? ''}`} />} />
          <Area
            dataKey="contributed"
            type="monotone"
            stroke="var(--color-contributed)"
            strokeDasharray="4 4"
            fill="transparent"
            isAnimationActive={false}
          />
          <Area
            dataKey="portfolio"
            type="monotone"
            stroke="var(--color-portfolio)"
            strokeWidth={2.5}
            fill="url(#fillPortfolio)"
            isAnimationActive={false}
          />
          {advanced && (
            <Line dataKey="noFees" type="monotone" stroke="var(--color-noFees)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
          )}
        </AreaChart>
      </ChartContainer>

      <dl className="grid grid-cols-2 gap-2">
        <Tile label={<Term termKey="feeDrag">Lost to fees</Term>} value={formatMoney(sim.feeDrag)} />
        <Tile label={<Term termKey="blendedFee">Blended fee</Term>} value={formatPercent(sim.blendedExpense)} />
        <Tile label={<Term termKey="volatility">Swings</Term>} value={sim.blendedVolatility} />
        <Tile
          label={<Term termKey="diversification">Asset classes</Term>}
          value={String(Object.values(sim.categoryExposure).filter((w) => (w ?? 0) > 0).length)}
        />
        {advanced && (
          <>
            <Tile label="Blended return" value={`${formatPercent(sim.blendedReturn, 1)}/yr`} />
            <Tile label="Zero-fee value" value={formatMoney(sim.endingValueNoFees)} />
          </>
        )}
      </dl>
    </section>
  )
}

function Tile({ label, value }: { label: React.ReactNode; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl bg-secondary p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-heading text-lg font-bold tabular-nums">{value}</dd>
    </div>
  )
}
