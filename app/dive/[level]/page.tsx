import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DiveScreen } from '@/components/dive/dive-screen'
import { DIVE_GUIDE_NAME } from '@/data/guidePersona'
import { getLevel } from '@/data/levels'

export const PRIMARY_DIVE_GUIDE = DIVE_GUIDE_NAME // "Atlas"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ level: string }>
}): Promise<Metadata> {
  const { level } = await params
  const data = getLevel(Number(level))
  return {
    title: data
      ? `${data.name}: ${data.conceptTitle} (Guide: ${PRIMARY_DIVE_GUIDE}) — DiveFund`
      : 'DiveFund',
  }
}

export default async function DivePage({
  params,
}: {
  params: Promise<{ level: string }>
}) {
  const { level } = await params
  const id = Number(level)
  if (!Number.isInteger(id) || !getLevel(id)) notFound()
  return <DiveScreen level={id} guideName={PRIMARY_DIVE_GUIDE} />
}
