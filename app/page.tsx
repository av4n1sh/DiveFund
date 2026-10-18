import { DepthScene } from '@/components/depth-scene'
import { Disclaimer } from '@/components/disclaimer'
import { SiteHeader } from '@/components/site-header'
import { LandingHero } from '@/components/landing/landing-hero'
import { HowItWorks } from '@/components/landing/how-it-works'
import { DepthMap } from '@/components/landing/depth-map'

export default function HomePage() {
  return (
    <>
      <DepthScene depth={1} />
      <SiteHeader showStats={false} />
      <main className="flex flex-col">
        <LandingHero />
        <HowItWorks />
        <DepthMap />
      </main>
      <footer className="mx-auto w-full max-w-6xl px-4 py-10">
        <Disclaimer />
      </footer>
    </>
  )
}
