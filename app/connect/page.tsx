import type { Metadata } from 'next'
import { DepthScene } from '@/components/depth-scene'
import { Disclaimer } from '@/components/disclaimer'
import { SiteHeader } from '@/components/site-header'
import { ConnectFlow } from '@/components/connect/connect-flow'

export const metadata: Metadata = { title: 'Connect a practice account — DiveFund' }

export default function ConnectPage() {
  return (
    <>
      <DepthScene depth={1} />
      <SiteHeader showStats={false} />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-balance font-heading text-4xl font-bold tracking-tight">Gear up</h1>
          <p className="text-pretty leading-relaxed text-muted-foreground">
            Pick a practice diver. We read their demo bank activity from Capital One&apos;s Nessie sandbox to find a
            realistic monthly amount to invest.
          </p>
        </div>
        <ConnectFlow />
        <Disclaimer />
      </main>
    </>
  )
}
