'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useGame } from '@/components/game-provider'
import { Button } from '@/components/ui/button'
import { getLevel } from '@/data/levels'

export function LandingHero() {
  const { state, hydrated } = useGame()
  const resuming = hydrated && state.diver !== null
  const level = getLevel(state.currentLevel)

  return (
    <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 pt-12 pb-16 md:grid-cols-2 md:pt-20">
      <div className="flex flex-col gap-6">
        <p className="w-fit rounded-full bg-surface px-3 py-1 text-sm font-medium text-primary">
          An ETF learning simulator
        </p>
        <h1 className="text-balance font-heading text-5xl font-extrabold leading-none tracking-tight md:text-7xl">
          Dive into investing.
        </h1>
        <p className="max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
          Start in the shallows with one simple fund. Each depth unlocks a new idea, like risk, fees, and going global,
          with a friendly AI guide who explains your own numbers.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="lg"
            className="h-12 rounded-full px-6 text-base"
            nativeButton={false}
            render={<Link href={resuming ? `/dive/${state.currentLevel}` : '/connect'} />}
          >
            {resuming ? `Resume at ${level?.name}` : 'Start your dive'}
            <ArrowRight className="size-5" aria-hidden="true" />
          </Button>
          {resuming && (
            <Button variant="ghost" size="lg" className="h-12 rounded-full" nativeButton={false} render={<Link href="/connect" />}>
              Change diver
            </Button>
          )}
        </div>
      </div>
      <div className="relative">
        <Image
          src="/images/hero-dive.png"
          alt="A diver descending through layers of ocean, from bright shallows to the deep blue"
          width={1024}
          height={1024}
          priority
          className="aspect-square w-full rounded-4xl object-cover"
        />
      </div>
    </section>
  )
}
