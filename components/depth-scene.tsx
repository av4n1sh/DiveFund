'use client'

import { useEffect } from 'react'

const BUBBLES = [
  { left: '6%', size: 6, duration: 14, delay: 0 },
  { left: '18%', size: 10, duration: 19, delay: 4 },
  { left: '33%', size: 5, duration: 12, delay: 7 },
  { left: '52%', size: 8, duration: 17, delay: 2 },
  { left: '68%', size: 4, duration: 11, delay: 9 },
  { left: '81%', size: 9, duration: 21, delay: 5 },
  { left: '93%', size: 6, duration: 15, delay: 11 },
]

/** Sets the page depth tint and draws a subtle rising-bubble layer. */
export function DepthScene({ depth }: { depth: number }) {
  useEffect(() => {
    document.body.dataset.depth = String(depth)
    document.documentElement.dataset.depth = String(depth)
  }, [depth])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 h-64 opacity-40"
        style={{ background: 'linear-gradient(to bottom, oklch(0.97 0.01 220 / 0.12), transparent)' }}
      />
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="absolute -bottom-6 animate-rise rounded-full border border-foreground/30 bg-foreground/5"
          style={
            {
              left: b.left,
              width: b.size,
              height: b.size,
              animationDelay: `${b.delay}s`,
              '--rise-duration': `${b.duration}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
