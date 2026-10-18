'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGame } from '@/components/game-provider'
import { DepthScene } from '@/components/depth-scene'
import { DepthStepper } from '@/components/depth-stepper'
import { Disclaimer } from '@/components/disclaimer'
import { SiteHeader } from '@/components/site-header'
import { Skeleton } from '@/components/ui/skeleton'
import { LearnCard } from '@/components/dive/learn-card'
import { BuildCard } from '@/components/dive/build-card'
import { ProjectionPanel } from '@/components/dive/projection-panel'
import { InsightStrip } from '@/components/dive/insight-strip'
import { ActCard } from '@/components/dive/act-card'
import { QuizCard } from '@/components/dive/quiz-card'
import { GuideLayout } from '@/components/guide/guide-layout'

export function DiveScreen({ level }: { level: number }) {
  const { state, hydrated } = useGame()
  const router = useRouter()

  const blocked = hydrated && (!state.diver || level > state.currentLevel)

  useEffect(() => {
    if (!hydrated) return
    if (!state.diver) router.replace('/connect')
    else if (level > state.currentLevel) router.replace(`/dive/${state.currentLevel}`)
  }, [hydrated, state.diver, state.currentLevel, level, router])

  return (
    <GuideLayout level={level}>
      <DepthScene depth={level} />
      <SiteHeader />
      <main className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-6 px-4 py-6">
        {!hydrated || blocked ? (
          <div className="flex flex-col gap-4" aria-busy="true">
            <Skeleton className="h-14 rounded-xl" />
            <div className="grid gap-6 lg:grid-cols-5">
              <Skeleton className="h-96 rounded-3xl lg:col-span-3" />
              <Skeleton className="h-96 rounded-3xl lg:col-span-2" />
            </div>
          </div>
        ) : (
          <>
            <DepthStepper viewing={level} currentLevel={state.currentLevel} passed={state.passedQuizzes} />
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
              <div className="flex min-w-0 flex-col gap-6 lg:col-span-3">
                <LearnCard level={level} />
                <BuildCard />
              </div>
              <div className="flex min-w-0 flex-col gap-6 lg:sticky lg:top-20 lg:col-span-2">
                <ProjectionPanel />
                <InsightStrip level={level} />
                <ActCard level={level} />
                <QuizCard level={level} />
              </div>
            </div>
          </>
        )}
        <Disclaimer className="pt-6" />
      </main>
    </GuideLayout>
  )
}
