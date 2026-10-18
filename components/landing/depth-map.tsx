import { LEVELS } from '@/data/levels'
import { FUND_BY_ID } from '@/lib/funds'

const TINTS = [
  'oklch(0.42 0.09 222)',
  'oklch(0.34 0.08 228)',
  'oklch(0.27 0.07 235)',
  'oklch(0.21 0.06 243)',
  'oklch(0.15 0.045 252)',
]

export function DepthMap() {
  return (
    <section aria-labelledby="depths-heading" className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16">
      <div className="flex flex-col gap-2">
        <h2 id="depths-heading" className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
          Five depths, five ideas
        </h2>
        <p className="max-w-xl leading-relaxed text-muted-foreground">
          The water gets darker as you go. So do the ideas, but never harder than one step at a time.
        </p>
      </div>
      <ol className="flex flex-col overflow-hidden rounded-3xl border border-border">
        {LEVELS.map((level, i) => (
          <li
            key={level.id}
            className="flex flex-col gap-2 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
            style={{ backgroundColor: TINTS[i] }}
          >
            <div className="flex items-baseline gap-4">
              <span className="w-16 shrink-0 font-mono text-sm text-muted-foreground tabular-nums">{level.depthLabel}</span>
              <div className="flex flex-col">
                <span className="font-heading text-xl font-semibold">{level.name}</span>
                <span className="text-muted-foreground">{level.conceptTitle}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pl-20 sm:pl-0">
              {level.unlocksFunds.map((id) => (
                <span key={id} className="rounded-full bg-foreground/10 px-3 py-1 text-sm">
                  {FUND_BY_ID[id].name}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
