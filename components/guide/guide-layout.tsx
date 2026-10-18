'use client'

import { useEffect } from 'react'
import { useGame } from '@/components/game-provider'
import { useGuide } from '@/components/guide/guide-provider'
import { GuidePanel } from '@/components/guide/guide-panel'
import { cn } from '@/lib/utils'

/** Reserves room for the docked guide on desktop so it never covers the page. */
export function GuideLayout({ level, children }: { level?: number; children: React.ReactNode }) {
  const { state, hydrated } = useGame()
  const { open, setLevel, width } = useGuide()
  const activeLevel = level ?? state.currentLevel
  const enabled = hydrated && Boolean(state.diver)

  useEffect(() => {
    setLevel(activeLevel)
  }, [activeLevel, setLevel])

  return (
    <div style={{ '--guide-w': `${width}px` } as React.CSSProperties}>
      <div className={cn('transition-[padding] duration-200', enabled && open && 'lg:pr-(--guide-w)')}>{children}</div>
      {enabled && <GuidePanel />}
    </div>
  )
}

export function OpenGuideLink() {
  const { setOpen } = useGuide()
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="self-start rounded-md text-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
    >
      Chat with the Guide
    </button>
  )
}
