'use client'

import dynamic from 'next/dynamic'
import type { HeroSceneProps } from '@/components/landing/hero-scene'

const DynamicHeroScene = dynamic(() => import('@/components/landing/hero-scene'), {
  ssr: false,
  loading: () => (
    <div
      aria-label="Loading 3D scene"
      className="flex h-full w-full items-center justify-center rounded-4xl border border-border bg-surface/40 backdrop-blur-sm"
    >
      <div className="size-24 animate-pulse rounded-full bg-primary/15 ring-1 ring-primary/30" />
    </div>
  ),
})

export function HeroCanvas({ scrollProgress = 0 }: HeroSceneProps) {
  return (
    <div className="relative h-full w-full">
      <DynamicHeroScene scrollProgress={scrollProgress} />
    </div>
  )
}

