'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Flame, MoreHorizontal, RotateCcw, Sparkles } from 'lucide-react'
import { AudioToggle } from '@/components/audio/AudioSystem'
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
    <Link
      href="/"
      className="group flex items-center gap-3 rounded-lg font-heading text-lg font-extrabold tracking-wider text-slate-100 transition-all hover:text-cyan-300"
    >
      {/* <!-- INSERT USER LOGO HERE --> */}
      <span
        aria-hidden="true"
        className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full border border-cyan-400/50 bg-slate-900/90 shadow-[0_0_24px_-2px_rgba(34,211,238,0.45)] transition-transform duration-300 group-hover:scale-105 group-hover:border-cyan-300"
      >
        <Image
          src="/images/divefund-logo.png"
          alt="DiveFund Logo"
          width={40}
          height={40}
          className="size-full object-cover"
          priority
        />
      </span>
      <span className="bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
        DiveFund
      </span>
    </Link>
  )
}

export function SiteHeader({ showStats = true }: { showStats?: boolean }) {
  const { state, hydrated, setMode, reset } = useGame()
  const router = useRouter()

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/65 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.7)] backdrop-blur-md">
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
                className="hidden items-center gap-1 rounded-full border border-slate-800/80 bg-slate-900/80 px-3 py-1 text-sm font-medium tabular-nums sm:flex"
                aria-label={`${state.streak} month streak`}
              >
                <Flame className="size-4 text-xp" aria-hidden="true" />
                {state.streak}
              </span>
            </div>
          )}
          <AudioToggle />
          <label className="flex items-center gap-2 text-sm">
            <span className="hidden text-slate-400 sm:inline">
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
