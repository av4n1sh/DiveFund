import type { Metadata } from 'next'
import { DepthScene } from '@/components/depth-scene'
import { Disclaimer } from '@/components/disclaimer'
import { SiteHeader } from '@/components/site-header'
import { SummaryView } from '@/components/summary/summary-view'
import { GuideLayout } from '@/components/guide/guide-layout'

export const metadata: Metadata = { title: 'Your dive log — DiveFund' }

export default function SummaryPage() {
  return (
    <GuideLayout>
      <DepthScene depth={1} />
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10">
        <SummaryView />
        <Disclaimer />
      </main>
    </GuideLayout>
  )
}
