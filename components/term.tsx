'use client'

import { Fragment } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { GLOSSARY } from '@/data/glossary'

export function Term({ termKey, children }: { termKey: string; children: React.ReactNode }) {
  const entry = GLOSSARY[termKey]
  if (!entry) return <>{children}</>
  return (
    <Popover>
      <PopoverTrigger
        className="cursor-help rounded-sm font-medium text-primary underline decoration-primary/50 decoration-dotted underline-offset-4 hover:decoration-primary focus-visible:outline-2"
        aria-label={`Define ${entry.term}`}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-72 text-sm leading-relaxed">
        <p className="font-heading font-semibold text-foreground">{entry.term}</p>
        <p className="text-muted-foreground">{entry.definition}</p>
      </PopoverContent>
    </Popover>
  )
}

const TOKEN = /\{\{(\w+):([^}]+)\}\}/g

/** Renders text containing {{termKey:Display}} tokens as tappable glossary terms. */
export function RichText({ text }: { text: string }) {
  const parts: React.ReactNode[] = []
  let last = 0
  for (const match of text.matchAll(TOKEN)) {
    const index = match.index ?? 0
    if (index > last) parts.push(text.slice(last, index))
    parts.push(
      <Term key={index} termKey={match[1]}>
        {match[2]}
      </Term>,
    )
    last = index + match[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>{p}</Fragment>
      ))}
    </>
  )
}
