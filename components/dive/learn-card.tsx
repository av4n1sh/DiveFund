import { RichText } from '@/components/term'
import { OpenGuideLink } from '@/components/guide/guide-layout'
import { getLevel } from '@/data/levels'
import { FUND_BY_ID } from '@/lib/funds'

export function LearnCard({ level }: { level: number }) {
  const data = getLevel(level)
  if (!data) return null
  return (
    <section aria-labelledby="learn-heading" className="flex flex-col gap-4 rounded-3xl bg-card p-6">
      <p className="text-sm font-medium text-primary">
        Depth {data.id} · {data.name}
      </p>
      <h1 id="learn-heading" className="text-balance font-heading text-3xl font-bold tracking-tight md:text-4xl">
        {data.conceptTitle}
      </h1>
      <p className="text-pretty text-lg leading-relaxed">
        <RichText text={data.conceptBody} />
      </p>
      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <p className="text-sm font-medium text-muted-foreground">Unlocked at this depth</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {data.unlocksFunds.map((id) => {
            const fund = FUND_BY_ID[id]
            return (
              <li key={id} className="flex flex-col gap-1 rounded-2xl bg-secondary p-3">
                <span className="font-heading font-semibold">{fund.name}</span>
                <span className="text-sm leading-relaxed text-muted-foreground">{fund.newReason}</span>
              </li>
            )
          })}
        </ul>
      </div>
      <OpenGuideLink />
    </section>
  )
}
