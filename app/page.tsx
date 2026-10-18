'use client'

import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import {
  ArrowDown,
  ArrowRight,
  Compass,
  Layers,
  ShieldCheck,
  Sparkles,
  Waves,
} from 'lucide-react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { DepthSection } from '@/components/DepthSection'
import { Disclaimer } from '@/components/disclaimer'
import { useGame } from '@/components/game-provider'
import { DiverPlungeLoader } from '@/components/landing/DiverPlungeLoader'
import type { SimpleMaritimeArtifactProps } from '@/components/landing/SimpleMaritimeArtifact'
import { SpatialTiltCard } from '@/components/landing/SpatialTiltCard'
import { useDepthTransition } from '@/components/route-transition'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { getLevel, LEVELS } from '@/data/levels'
import { FUND_BY_ID } from '@/lib/funds'

const OceanBiomeEnvironment = dynamic(
  () => import('@/components/landing/OceanBiomeEnvironment'),
  { ssr: false }
)

const SimpleMaritimeArtifact = dynamic(
  () =>
    import('@/components/landing/SimpleMaritimeArtifact').then((m) => m.SimpleMaritimeArtifact),
  {
    ssr: false,
    loading: () => (
      <div className="h-32 w-full animate-pulse rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-md" />
    ),
  }
)

const MARITIME_CREW: Array<
  SimpleMaritimeArtifactProps & { customerId: string; fullName: string }
> = [
  {
    customerId: 'mock-marina',
    fullName: 'Avanish Poudyal',
    name: 'Avanish Poudyal',
    role: 'Shallows Navigator',
    specialty:
      'Focuses on steady coastal index funds and consistent monthly contributions across calm waters.',
    depthZone: '0–40m • Sunlit Reef',
    artifact: 'helmet',
  },
  {
    customerId: 'mock-kai',
    fullName: 'Prajwal Shrestha',
    name: 'Prajwal Shrestha',
    role: 'Twilight Helmsman',
    specialty:
      'Balances treasury bond ballast with global equities to keep the vessel steady through market swells.',
    depthZone: '40–200m • Kelp Shelf',
    artifact: 'anchor',
  },
  {
    customerId: 'mock-pearl',
    fullName: 'Shemmy Taiwo',
    name: 'Shemmy Taiwo',
    role: 'Deep Sounding Lead',
    specialty:
      'Charts multi-decade horizons, trimming fee drag and orienting portfolios for the deepest waters.',
    depthZone: '200–1,000m+ • Open Trench',
    artifact: 'compass',
  },
]

const HERO_NOTES = [
  {
    icon: Compass,
    label: 'Charted Instruments',
    value: '8 Curated Funds',
    detail: 'From broad coastal index funds to deep-water bond and global equity reserves.',
  },
  {
    icon: Layers,
    label: 'Long Horizon',
    value: '30-Year Outlook',
    detail: 'See how compounding and annual fees shape your balance over decades.',
  },
  {
    icon: Sparkles,
    label: 'Expedition Guide',
    value: 'Atlas • Plain-Language Notes',
    detail: 'Clear explanations calibrated around your own monthly surplus and risk comfort.',
  },
]

export default function HomePage() {
  const { state, hydrated, setDiver } = useGame()
  const { navigateToDepth } = useDepthTransition()
  const resuming = hydrated && state.diver !== null
  const currentLevelObj = getLevel(state.currentLevel)

  // Explicit intro loading state: while true, renders only the loader; once false, unmounts loader completely
  const [showIntro, setShowIntro] = useState(true)
  const [selectedCrewId, setSelectedCrewId] = useState<string>('mock-marina')
  const [scrollProgress, setScrollProgress] = useState(0)

  const handleIntroComplete = useCallback(() => {
    document.body.style.overflow = 'unset'
    document.documentElement.style.overflow = 'unset'
    setShowIntro(false)
  }, [])

  useEffect(() => {
    if (!showIntro) {
      document.body.style.overflow = 'unset'
      document.documentElement.style.overflow = 'unset'
    }
  }, [showIntro])

  const { scrollYProgress } = useScroll()

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const clamped = Math.min(1, Math.max(0, latest))
    setScrollProgress(clamped)

    const depthTier = Math.min(5, Math.max(1, Math.ceil(clamped * 5) || 1))
    document.body.dataset.depth = String(depthTier)
    document.documentElement.dataset.depth = String(depthTier)
  })

  useEffect(() => {
    document.body.dataset.depth = '1'
    document.documentElement.dataset.depth = '1'
  }, [])

  const currentMeters = Math.round(scrollProgress * 2500)

  const handleSelectCrew = (member: (typeof MARITIME_CREW)[number]) => {
    setSelectedCrewId(member.customerId)
    setDiver(
      {
        customerId: member.customerId,
        name: member.fullName,
        accountId: null,
        mocked: true,
      },
      150
    )
    navigateToDepth('/dive/1')
  }

  // While showIntro is true, render only the viewport-locked 5.5-second plunge loader
  if (showIntro) {
    return <DiverPlungeLoader onComplete={handleIntroComplete} durationMs={5500} />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="relative min-h-screen overflow-x-clip text-slate-100"
    >
      {/* Living Deep-Sea WebGL Biome (Marine Snow, Swimming Fish Silhouettes, and Bioluminescent Abyssal Anglerfish) */}
      <OceanBiomeEnvironment scrollProgress={scrollProgress} />

      <SiteHeader showStats={false} />

      {/* Quiet Bathymetric Depth Indicator */}
      <div className="pointer-events-none fixed right-5 bottom-5 z-40 hidden items-center gap-2.5 rounded-full border border-slate-800/80 bg-slate-950/75 px-4 py-2 font-mono text-xs text-slate-300 backdrop-blur-md md:flex">
        <Waves className="size-3.5 text-sky-300" aria-hidden="true" />
        <span>{currentMeters.toLocaleString()}m</span>
        <span className="text-slate-600">•</span>
        <span className="text-slate-400">
          {currentMeters < 300
            ? 'Coastal Shallows'
            : currentMeters < 1200
              ? 'Twilight Water'
              : 'Abyssal Trench'}
        </span>
      </div>

      <main
        style={{ perspective: '1200px' }}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-28 px-4 pt-10 pb-28 perspective-[1200px] md:pt-16"
      >
        {/* =====================================================================
            SECTION 1: COASTAL SHALLOWS HERO
           ===================================================================== */}
        <section
          style={{ perspective: '1200px' }}
          className="relative flex min-h-[80vh] flex-col justify-center perspective-[1200px]"
        >
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-7">
              <SpatialTiltCard
                tiltIntensity={4}
                shiftIntensity={6}
                hoverTranslateZ={36}
                className="w-fit rounded-full border border-slate-800/80 bg-slate-900/75 px-4 py-1.5 backdrop-blur-md"
              >
                <span className="text-xs font-medium tracking-[0.18em] text-sky-200 uppercase">
                  DiveFund • Maritime Wealth Expedition
                </span>
              </SpatialTiltCard>

              <SpatialTiltCard
                tiltIntensity={5}
                shiftIntensity={8}
                hoverTranslateZ={42}
                className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-7 backdrop-blur-md sm:p-9"
              >
                <div className="flex flex-col gap-5">
                  <h1 className="text-balance font-heading text-5xl font-extrabold leading-[0.96] tracking-tight text-white sm:text-6xl md:text-7xl">
                    Learn to invest,{' '}
                    <span className="bg-gradient-to-r from-sky-200 via-cyan-200 to-amber-200 bg-clip-text text-transparent">
                      one depth at a time.
                    </span>
                  </h1>

                  <p className="max-w-xl text-pretty text-lg leading-relaxed text-slate-300">
                    Begin in the sunlit shallows with a single index fund. As you descend into deeper water, explore
                    bonds, global markets, and fee drag—with clear notes written around your own monthly savings.
                  </p>
                </div>
              </SpatialTiltCard>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <SpatialTiltCard
                  tiltIntensity={6}
                  shiftIntensity={8}
                  hoverTranslateZ={44}
                  className="rounded-full"
                >
                  <Button
                    size="lg"
                    onClick={() =>
                      navigateToDepth(resuming ? `/dive/${state.currentLevel}` : '/connect')
                    }
                    className="h-12 cursor-pointer rounded-full bg-sky-300 px-7 text-base font-semibold text-slate-950 hover:bg-sky-200"
                  >
                    {resuming ? `Resume at ${currentLevelObj?.name}` : 'Start your dive'}
                    <ArrowRight className="size-5" aria-hidden="true" />
                  </Button>
                </SpatialTiltCard>

                <SpatialTiltCard
                  tiltIntensity={5}
                  shiftIntensity={6}
                  hoverTranslateZ={36}
                  className="rounded-full"
                >
                  <a
                    href="#crew-heading"
                    className="inline-flex h-12 items-center gap-2 rounded-full border border-slate-800/80 bg-slate-900/70 px-6 text-sm font-medium text-slate-200 backdrop-blur-md transition-colors hover:border-sky-300/50 hover:text-white"
                  >
                    Meet the expedition crew
                    <ArrowDown className="size-4" aria-hidden="true" />
                  </a>
                </SpatialTiltCard>
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:col-span-5">
              {HERO_NOTES.map((note, idx) => {
                const Icon = note.icon
                return (
                  <SpatialTiltCard
                    key={note.label}
                    tiltIntensity={5}
                    shiftIntensity={8}
                    baseTranslateZ={idx * 8}
                    hoverTranslateZ={40}
                    className="rounded-2xl border border-slate-800/80 bg-slate-900/65 p-5 backdrop-blur-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-800/80 text-sky-300">
                        <Icon className="size-5" aria-hidden="true" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs tracking-wider text-sky-300/90 uppercase">
                            {note.label}
                          </span>
                          <span className="rounded-full bg-slate-800 px-2.5 py-0.5 font-heading text-xs font-semibold text-slate-200">
                            {note.value}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-400">{note.detail}</p>
                      </div>
                    </div>
                  </SpatialTiltCard>
                )
              })}
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 2: EXPEDITION CREW (Tactile Brass/Wood/Clay Artifacts)
           ===================================================================== */}
        <section aria-labelledby="crew-heading" className="relative flex flex-col gap-8 py-4">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs tracking-[0.22em] text-sky-300/80 uppercase">
              Practice Profiles • Choose a Diver
            </span>
            <h2
              id="crew-heading"
              className="font-heading text-3xl font-bold tracking-tight text-white md:text-4xl"
            >
              Select an expedition log
            </h2>
            <p className="max-w-2xl text-slate-400">
              Each profile is paired with a sample household budget and maritime instrument—a vintage diving helmet,
              an admiralty anchor, or a brass pocket compass. Select any log to begin at the shallows.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {MARITIME_CREW.map((member) => (
              <SimpleMaritimeArtifact
                key={member.customerId}
                name={member.name}
                role={member.role}
                specialty={member.specialty}
                depthZone={member.depthZone}
                artifact={member.artifact}
                selected={selectedCrewId === member.customerId}
                onSelect={() => handleSelectCrew(member)}
              />
            ))}
          </div>
        </section>

        {/* =====================================================================
            SECTION 3: HOW A DIVE WORKS (Un-cropped DepthSection Card Layout)
           ===================================================================== */}
        <DepthSection />

        {/* =====================================================================
            SECTION 4: FIVE DEPTHS, FIVE IDEAS (Kinetic Route Transitions)
           ===================================================================== */}
        <section aria-labelledby="depths-heading" className="relative flex flex-col gap-8 py-4">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs tracking-[0.22em] text-sky-300/80 uppercase">
              Bathymetric Chart • 0m to 1,000m+
            </span>
            <h2
              id="depths-heading"
              className="font-heading text-3xl font-bold tracking-tight text-white md:text-4xl"
            >
              Five depths, five ideas
            </h2>
            <p className="max-w-xl leading-relaxed text-slate-400">
              The water grows darker as you descend into the abyssal trench, where bioluminescent life illuminates the
              depths and each station introduces a new layer of portfolio craft.
            </p>
          </div>

          <ol className="flex flex-col gap-4">
            {LEVELS.map((level) => (
              <li key={level.id}>
                <SpatialTiltCard
                  tiltIntensity={4.5}
                  shiftIntensity={7}
                  hoverTranslateZ={38}
                  className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 backdrop-blur-md"
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => navigateToDepth(`/dive/${level.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        navigateToDepth(`/dive/${level.id}`)
                      }
                    }}
                    className="flex cursor-pointer flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="w-22 shrink-0 rounded-full border border-slate-700/80 bg-slate-900 px-3 py-1 text-center font-mono text-xs font-semibold text-sky-300 tabular-nums">
                        {level.depthLabel}
                      </span>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2.5">
                          <span className="font-heading text-xl font-bold text-white">{level.name}</span>
                          <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 font-mono text-xs font-semibold text-amber-300">
                            +{level.xpReward} XP
                          </span>
                        </div>
                        <span className="text-sm text-slate-400">{level.conceptTitle}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pl-24 sm:pl-0">
                      {level.unlocksFunds.map((id) => (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/90 px-3.5 py-1.5 text-xs font-medium text-slate-200"
                        >
                          <ShieldCheck className="size-3.5 text-sky-300" aria-hidden="true" />
                          {FUND_BY_ID[id].name}
                        </span>
                      ))}
                    </div>
                  </div>
                </SpatialTiltCard>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="relative z-10 mx-auto w-full max-w-6xl px-4 py-10">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4 backdrop-blur-md">
          <Disclaimer />
        </div>
      </footer>
    </motion.div>
  )
}
