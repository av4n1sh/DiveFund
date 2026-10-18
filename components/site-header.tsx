'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Flame, MoreHorizontal, RotateCcw, Sparkles } from 'lucide-react'
import { useGame } from '@/components/game-provider'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 rounded-md font-heading text-lg font-bold tracking-tight">
      <span
        aria-hidden="true"
        className="grid size-8 place-items-center rounded-full bg-primary text-sm font-black text-primary-foreground"
      >
        D
      </span>
      DiveFund
    </Link>
  )
}

export function SiteHeader({ showStats = true }: { showStats?: boolean }) {
  const { state, hydrated, setMode, reset } = useGame()
  const router = useRouter()

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Logo />
        <div className="flex items-center gap-2 sm:gap-4">
          {showStats && hydrated && (
            <div className="flex items-center gap-2">
              <span
                className="flex items-center gap-1 rounded-full bg-xp px-3 py-1 text-sm font-semibold text-xp-foreground tabular-nums"
                aria-label={`${state.xp} experience points`}
              >
                <Sparkles className="size-4" aria-hidden="true" />
                {state.xp} XP
              </span>
              <span
                className="hidden items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm font-medium tabular-nums sm:flex"
                aria-label={`${state.streak} month streak`}
              >
                <Flame className="size-4 text-xp" aria-hidden="true" />
                {state.streak}
              </span>
            </div>
          )}
          <label className="flex items-center gap-2 text-sm">
            <span className="hidden text-muted-foreground sm:inline">
              {state.mode === 'beginner' ? 'Beginner' : 'Advanced'}
            </span>
            <span className="sr-only">Advanced explanations</span>
            <Switch
              checked={state.mode === 'advanced'}
              onCheckedChange={(checked) => setMode(checked ? 'advanced' : 'beginner')}
            />
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="More options" />}>
              <MoreHorizontal className="size-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  reset()
                  router.push('/')
                }}
              >
                <RotateCcw className="size-4" />
                Reset progress
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
