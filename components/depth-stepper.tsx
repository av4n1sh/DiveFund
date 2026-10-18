'use client'

import Link from 'next/link'
import { Check, Lock } from 'lucide-react'
import { LEVELS } from '@/data/levels'
import { cn } from '@/lib/utils'

export function DepthStepper({
  viewing,
  currentLevel,
  passed,
}: {
  viewing: number
  currentLevel: number
  passed: number[]
}) {
  return (
    <nav aria-label="Dive depth">
      <ol className="relative flex items-stretch gap-1 overflow-x-auto pb-1">
        {LEVELS.map((level) => {
          const locked = level.id > currentLevel
          const done = passed.includes(level.id)
          const active = level.id === viewing
          const content = (
            <>
              <span
                className={cn(
                  'grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold',
                  active ? 'bg-primary-foreground text-primary' : done ? 'bg-primary text-primary-foreground' : 'bg-secondary',
                )}
              >
                {locked ? <Lock className="size-3" aria-hidden="true" /> : done ? <Check className="size-3.5" aria-hidden="true" /> : level.id}
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-semibold whitespace-nowrap">{level.name}</span>
                <span className={cn('text-xs', active ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
                  {level.depthLabel}
                </span>
              </span>
            </>
          )
          const base = 'flex min-w-max flex-1 items-center gap-2 rounded-xl px-3 py-2 transition-colors'
          return (
            <li key={level.id} className="flex flex-1">
              {locked ? (
                <span className={cn(base, 'opacity-50')} aria-disabled="true">
                  <span className="sr-only">Locked: </span>
                  {content}
                </span>
              ) : (
                <Link
                  href={`/dive/${level.id}`}
                  aria-current={active ? 'step' : undefined}
                  className={cn(base, active ? 'bg-primary text-primary-foreground' : 'bg-surface hover:bg-accent')}
                >
                  {content}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
