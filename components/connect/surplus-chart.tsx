'use client'

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { formatMonth } from '@/lib/format'
import type { SurplusMonth } from '@/lib/types'

const config = {
  deposits: { label: 'Money in', color: 'var(--chart-1)' },
  spending: { label: 'Money out', color: 'var(--chart-3)' },
} satisfies ChartConfig

export function SurplusChart({ months }: { months: SurplusMonth[] }) {
  const data = months.map((m) => ({ ...m, label: formatMonth(m.month) }))
  return (
    <ChartContainer config={config} className="h-44 w-full" aria-label="Monthly money in versus money out">
      <BarChart data={data} margin={{ left: 0, right: 0, top: 8 }}>
        <CartesianGrid vertical={false} strokeOpacity={0.15} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="deposits" fill="var(--color-deposits)" radius={6} />
        <Bar dataKey="spending" fill="var(--color-spending)" radius={6} />
      </BarChart>
    </ChartContainer>
  )
}
