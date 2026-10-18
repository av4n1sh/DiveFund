'use client'

import dynamic from 'next/dynamic'
import type { UnderwaterSceneProps } from '@/components/landing/UnderwaterScene'

const DynamicUnderwaterScene = dynamic(() => import('@/components/landing/UnderwaterScene'), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="h-full w-full bg-[radial-gradient(ellipse_at_top_left,oklch(0.45_0.11_200/0.35),transparent_60%),radial-gradient(ellipse_at_bottom,oklch(0.18_0.06_250),oklch(0.12_0.04_255))]"
    />
  ),
})

export function ImmersiveCanvas({ scrollProgress }: UnderwaterSceneProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[linear-gradient(180deg,oklch(0.32_0.08_224)_0%,oklch(0.21_0.065_238)_45%,oklch(0.13_0.045_252)_100%)]"
    >
      {/* Top-left cyan caustic glow & bottom royal-blue abyssal fill */}
      <div
        className="absolute -top-32 -left-32 h-[540px] w-[540px] rounded-full opacity-45 blur-3xl"
        style={{ background: 'radial-gradient(circle, oklch(0.84 0.14 192 / 0.55), transparent 70%)' }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[420px] opacity-65"
        style={{ background: 'linear-gradient(to top, oklch(0.14 0.07 258 / 0.9), transparent)' }}
      />

      <DynamicUnderwaterScene scrollProgress={scrollProgress} />
    </div>
  )
}

