'use client'

import Image from 'next/image'
import { SpatialTiltCard } from '@/components/landing/SpatialTiltCard'

export interface ExpeditionStep {
  step: string
  depth: string
  image: string
  title: string
  body: string
}

export const EXPEDITION_STEPS: ExpeditionStep[] = [
  {
    step: '01',
    depth: '0–10m • Surface Reading',
    image: '/images/step-connect.png',
    title: 'Connect a practice account',
    body: 'We review a sample bank ledger to see what you can comfortably set aside each month. No real money ever moves.',
  },
  {
    step: '02',
    depth: '10–100m • Water Column',
    image: '/images/step-learn.png',
    title: 'Learn one concept per depth',
    body: 'Each depth introduces a single principle—index baskets, bond ballast, expense ratios—tested on your own numbers.',
  },
  {
    step: '03',
    depth: '100–1,000m+ • Deep Sounding',
    image: '/images/step-dive.png',
    title: 'Pass the depth check',
    body: 'Complete a short check tailored to your allocation choices to unlock deeper funds and continue your descent.',
  },
]

export function DepthSection() {
  return (
    <section aria-labelledby="how-heading" className="relative flex flex-col gap-8 py-4">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs tracking-[0.22em] text-sky-300/80 uppercase">
          Sounding Protocol • Three Steps
        </span>
        <h2
          id="how-heading"
          className="font-heading text-3xl font-bold tracking-tight text-white md:text-4xl"
        >
          How a DiveFund dive works
        </h2>
      </div>

      <ol className="grid gap-6 md:grid-cols-3">
        {EXPEDITION_STEPS.map((step) => (
          <li key={step.title} className="flex">
            <SpatialTiltCard
              tiltIntensity={6}
              shiftIntensity={8}
              hoverTranslateZ={42}
              className="flex h-full w-full flex-col gap-4 rounded-3xl border border-slate-800/80 bg-slate-900/65 p-5 backdrop-blur-md"
            >
              {/* Un-cropped containment wrapper ensuring full visual proportions on all viewports */}
              <div className="relative flex w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/80 p-3">
                <Image
                  src={step.image}
                  alt={step.title}
                  width={640}
                  height={360}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="w-full h-auto object-contain max-h-[400px] aspect-video rounded-xl"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/90 px-3 py-1 font-mono text-xs text-sky-200 backdrop-blur-md">
                  <span>{step.step}</span>
                  <span className="text-slate-600">•</span>
                  <span>{step.depth}</span>
                </div>
              </div>
              <h3 className="font-heading text-xl font-bold text-white">{step.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{step.body}</p>
            </SpatialTiltCard>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default DepthSection

