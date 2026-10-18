import { cn } from '@/lib/utils'

export const DISCLAIMER =
  'Educational simulation only. Fictional funds and assumed returns. Not financial advice.'

export function Disclaimer({ className }: { className?: string }) {
  return (
    <p className={cn('text-pretty text-center text-xs leading-relaxed text-muted-foreground', className)}>
      {DISCLAIMER}
    </p>
  )
}
