'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Compass, Layers, Sparkles } from 'lucide-react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { useGame } from '@/components/game-provider'
import { HeroCanvas } from '@/components/landing/hero-canvas'
import { Button } from '@/components/ui/button'
import { getLevel } from '@/data/levels'

const HERO_PILLARS = [
  {
    icon: Compass,
    title: 'Zero-jargon navigation',
    detail: 'Interactive 3D & visual simulations built around your monthly surplus.',
  },
  {
    icon: Layers,
    title: 'Five progressive depths',
    detail: 'Master ETFs, risk vs. return, expense ratios, and global diversification.',
  },
  {
    icon: Sparkles,
    title: 'AI dive companion',
    detail: 'Personalized feedback that explains your exact portfolio numbers in plain words.',
  },
]

export function LandingHero() {
  const { state, hydrated } = useGame()
  const resuming = hydrated && state.diver !== null
  const level = getLevel(state.currentLevel)

  const sectionRef = useRef<HTMLElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setScrollProgress(Math.min(1, Math.max(0, latest * 1.4)))
  })

  // Scroll-driven motion values for left-side text elements fading/sliding in as the 3D mesh shifts right
  const headlineY = useTransform(scrollYProgress, [0, 0.5], [0, -16])
  const pillarsOpacity = useTransform(scrollYProgress, [0, 0.22], [0.15, 1])
  const pillarsX = useTransform(scrollYProgress, [0, 0.22], [-32, 0])

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto min-h-[88vh] w-full max-w-6xl overflow-hidden px-4 pt-12 pb-20 md:pt-20"
    >
      {/* Full-bleed interactive 3D Canvas layer that slides right on scroll */}
      <div className="pointer-events-auto relative order-first mb-8 h-[380px] w-full sm:h-[440px] md:absolute md:inset-0 md:z-0 md:mb-0 md:h-full">
        <HeroCanvas scrollProgress={scrollProgress} />
      </div>

      {/* Left-aligned content layer that fades & locks into focus as the 3D model slides right */}
      <div className="pointer-events-none relative z-10 grid items-center gap-10 md:grid-cols-12">
        <motion.div
          style={{ y: headlineY }}
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto flex flex-col gap-6 md:col-span-7"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-fit rounded-full border border-primary/25 bg-surface px-3.5 py-1 text-sm font-medium text-primary backdrop-blur-md">
              An ETF learning simulator
            </span>
            <span className="rounded-full bg-xp/15 px-3 py-1 font-mono text-xs font-medium text-xp">
              Interactive 3D • Drag or hover the fund core
            </span>
          </div>

          <h1 className="text-balance font-heading text-5xl font-extrabold leading-none tracking-tight md:text-7xl">
            Dive into investing.
          </h1>

          <p className="max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
            Start in the shallows with one simple fund. Each depth unlocks a new idea—like risk, fees, and going
            global—with a friendly AI guide who explains your own numbers.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              size="lg"
              className="h-12 rounded-full px-6 text-base shadow-lg shadow-primary/15"
              nativeButton={false}
              render={<Link href={resuming ? `/dive/${state.currentLevel}` : '/connect'} />}
            >
              {resuming ? `Resume at ${level?.name}` : 'Start your dive'}
              <ArrowRight className="size-5" aria-hidden="true" />
            </Button>
            {resuming && (
              <Button
                variant="ghost"
                size="lg"
                className="h-12 rounded-full border border-border bg-surface/60 backdrop-blur-sm"
                nativeButton={false}
                render={<Link href="/connect" />}
              >
                Change diver
              </Button>
            )}
          </div>

          {/* Scroll-revealed left column cards that fade in as the 3D object rotates and slides right */}
          <motion.div
            style={{ opacity: pillarsOpacity, x: pillarsX }}
            className="mt-4 grid gap-3 sm:grid-cols-3"
          >
            {HERO_PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: idx * 0.1 }}
                  className="flex flex-col gap-2 rounded-2xl border border-border bg-card/75 p-4 backdrop-blur-md"
                >
                  <div className="flex size-8 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Icon className="size-4" aria-hidden="true" />
                  </div>
                  <h2 className="font-heading text-sm font-semibold text-foreground">{pillar.title}</h2>
                  <p className="text-xs leading-relaxed text-muted-foreground">{pillar.detail}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
