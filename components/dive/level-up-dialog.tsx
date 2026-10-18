'use client'

import Link from 'next/link'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { buttonVariants } from '@/components/ui/button'
import { getLevel, MAX_LEVEL } from '@/data/levels'
import { BADGES, type RewardEvents } from '@/lib/game'
import { cn } from '@/lib/utils'

export function LevelUpDialog({
  events,
  level,
  onClose,
}: {
  events: RewardEvents | null
  level: number
  onClose: () => void
}) {
  const next = events?.levelUnlocked ? getLevel(events.levelUnlocked) : null
  const finished = level >= MAX_LEVEL
  const open = Boolean(events && (next || finished))

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="flex flex-col items-center gap-4 rounded-3xl text-center">
        <span className="animate-pop rounded-full bg-xp px-4 py-1 font-heading text-lg font-bold text-xp-foreground">
          +{events?.xpGained ?? 0} XP
        </span>
        <DialogTitle className="text-balance font-heading text-3xl font-bold">
          {finished ? 'You reached the trench!' : `Depth ${next?.id} unlocked`}
        </DialogTitle>
        <DialogDescription className="text-pretty leading-relaxed">
          {finished
            ? 'Every lesson cleared. Surface to see what you learned.'
            : `Next up: ${next?.name} — ${next?.conceptTitle}.`}
        </DialogDescription>
        {events && events.newBadges.length > 0 && (
          <ul className="flex flex-wrap justify-center gap-2">
            {events.newBadges.map((id) => (
              <li key={id} className="rounded-full bg-secondary px-3 py-1 text-sm font-medium">
                {BADGES[id].name}
              </li>
            ))}
          </ul>
        )}
        <Link
          href={finished ? '/summary' : `/dive/${next?.id}`}
          onClick={onClose}
          className={cn(buttonVariants({ size: 'lg' }), 'h-12 w-full rounded-full text-base')}
        >
          {finished ? 'Surface' : 'Descend'}
        </Link>
      </DialogContent>
    </Dialog>
  )
}
