'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { MessageCircle, PanelRightClose, Send, Sparkles, Trash2, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GUIDE_DEFAULT_WIDTH, GUIDE_MAX_WIDTH, GUIDE_MIN_WIDTH, useGuide } from '@/components/guide/guide-provider'
import { chipsForLevel, GUIDE_GREETINGS } from '@/data/guideAnswers'
import { cn } from '@/lib/utils'

export function GuidePanel() {
  const { messages, open, unread, busy, error, provider, level, setOpen, send, clear, width, setWidth } = useGuide()
  const [input, setInput] = useState('')
  const [resizing, setResizing] = useState(false)

  function startResize(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    setResizing(true)
  }

  function onResizeMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!resizing) return
    setWidth(window.innerWidth - e.clientX)
  }

  function endResize(e: React.PointerEvent<HTMLDivElement>) {
    if (!resizing) return
    e.currentTarget.releasePointerCapture(e.pointerId)
    setResizing(false)
  }

  useEffect(() => {
    if (!resizing) return
    const root = document.documentElement
    root.classList.add('guide-resizing')
    return () => root.classList.remove('guide-resizing')
  }, [resizing])

  useEffect(() => {
    const onWindowResize = () => setWidth(width)
    window.addEventListener('resize', onWindowResize)
    return () => window.removeEventListener('resize', onWindowResize)
  }, [width, setWidth])
  const fabRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const wasOpen = useRef(open)

  useEffect(() => {
    if (open && !wasOpen.current) inputRef.current?.focus()
    if (!open && wasOpen.current) fabRef.current?.focus()
    wasOpen.current = open
  }, [open])

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ block: 'end' })
  }, [messages.length, busy, open])

  const asked = useMemo(
    () => new Set(messages.filter((m) => m.role === 'user').map((m) => m.text.trim().toLowerCase())),
    [messages],
  )
  const chips = useMemo(() => {
    const pool = chipsForLevel(level).filter((q) => !asked.has(q.toLowerCase()))
    return messages.length === 0 ? pool.slice(0, 4) : pool.slice(0, 3)
  }, [level, asked, messages.length])

  const last = messages.at(-1)
  const showFollowUps = !busy && last?.role === 'guide' && chips.length > 0

  function submit(text: string) {
    if (!text.trim() || busy) return
    send(text)
    setInput('')
  }

  return (
    <>
      <button
        ref={fabRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={unread ? 'Open Dive Guide, new message' : 'Open Dive Guide'}
        aria-expanded={open}
        aria-controls="dive-guide-panel"
        className={cn(
          'fixed right-4 bottom-4 z-40 flex h-14 items-center gap-2 rounded-full bg-primary px-5 font-heading text-base font-semibold text-primary-foreground shadow-lg transition-transform outline-none hover:scale-105 focus-visible:ring-4 focus-visible:ring-ring/60',
          open && 'pointer-events-none scale-90 opacity-0',
        )}
        tabIndex={open ? -1 : 0}
      >
        <MessageCircle className="size-5" aria-hidden="true" />
        Guide
        {unread && (
          <span className="absolute -top-0.5 -right-0.5 size-3.5 rounded-full border-2 border-background bg-destructive" aria-hidden="true" />
        )}
      </button>

      <aside
        id="dive-guide-panel"
        aria-label="Dive Guide chat"
        hidden={!open}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.stopPropagation()
            setOpen(false)
          }
        }}
        className={cn(
          'fixed inset-x-0 bottom-0 z-40 flex h-[75dvh] flex-col rounded-t-3xl border-t border-border bg-popover text-popover-foreground shadow-2xl',
          'lg:inset-x-auto lg:top-0 lg:right-0 lg:h-auto lg:w-(--guide-w) lg:rounded-none lg:border-t-0 lg:border-l lg:shadow-none',
        )}
      >
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize Dive Guide"
          aria-controls="dive-guide-panel"
          aria-valuemin={GUIDE_MIN_WIDTH}
          aria-valuemax={GUIDE_MAX_WIDTH}
          aria-valuenow={width}
          tabIndex={0}
          title="Drag to resize · double-click to reset"
          onPointerDown={startResize}
          onPointerMove={onResizeMove}
          onPointerUp={endResize}
          onPointerCancel={endResize}
          onDoubleClick={() => setWidth(GUIDE_DEFAULT_WIDTH)}
          onKeyDown={(e) => {
            const step = e.shiftKey ? 64 : 16
            if (e.key === 'ArrowLeft') setWidth(width + step)
            else if (e.key === 'ArrowRight') setWidth(width - step)
            else if (e.key === 'Home') setWidth(GUIDE_MAX_WIDTH)
            else if (e.key === 'End') setWidth(GUIDE_MIN_WIDTH)
            else return
            e.preventDefault()
          }}
          className="group absolute inset-y-0 -left-1.5 z-10 hidden w-3 cursor-col-resize touch-none outline-none lg:block"
        >
          <span
            aria-hidden="true"
            className={cn(
              'absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-transparent transition-colors group-hover:bg-primary/60 group-focus-visible:bg-primary',
              resizing && 'bg-primary',
            )}
          />
          <span
            aria-hidden="true"
            className={cn(
              'absolute top-1/2 left-1/2 h-10 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border transition-colors group-hover:bg-primary group-focus-visible:bg-primary',
              resizing && 'bg-primary',
            )}
          />
        </div>

        <header className="flex items-center gap-3 border-b border-border px-4 py-3">
          <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
            <MessageCircle className="size-4" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <h2 className="font-heading text-base font-semibold leading-tight">Dive Guide</h2>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Sparkles className="size-3 text-primary" aria-hidden="true" />
              Powered by Gemini
              {provider === 'mock' && (
                <>
                  <span aria-hidden="true">·</span>
                  <WifiOff className="size-3" aria-hidden="true" />
                  offline answers
                </>
              )}
            </p>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={clear} disabled={messages.length === 0} aria-label="Clear chat" title="Clear chat">
            <Trash2 aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => setOpen(false)} aria-label="Collapse guide" title="Collapse (Esc)">
            <PanelRightClose aria-hidden="true" />
          </Button>
        </header>

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4" aria-live="polite" aria-relevant="additions">
          {messages.length === 0 && <Bubble role="guide">{GUIDE_GREETINGS[level] ?? GUIDE_GREETINGS[1]}</Bubble>}
          {messages.map((m) => (
            <Bubble key={m.id} role={m.role} tip={m.tip}>
              {m.text}
            </Bubble>
          ))}
          {busy && (
            <div className="flex items-center gap-1 self-start rounded-2xl rounded-bl-md bg-secondary px-4 py-3" role="status">
              <span className="sr-only">The guide is typing</span>
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  aria-hidden="true"
                  className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          )}
          {error && <p className="text-sm text-destructive">The guide lost signal for a moment. Try again.</p>}
          {(messages.length === 0 || showFollowUps) && (
            <div className="flex flex-col gap-2 pt-1">
              {messages.length > 0 && <p className="text-xs font-medium text-muted-foreground">You could ask…</p>}
              <div className="flex flex-wrap gap-2">
                {chips.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => submit(q)}
                    className="rounded-full border border-primary/40 px-3 py-1.5 text-left text-sm text-primary transition-colors outline-none hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form
          className="flex items-end gap-2 border-t border-border p-3"
          onSubmit={(e) => {
            e.preventDefault()
            submit(input)
          }}
        >
          <label htmlFor="guide-input" className="sr-only">
            Message the Dive Guide
          </label>
          <textarea
            ref={inputRef}
            id="guide-input"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== 'Enter' || e.shiftKey) return
              if (e.nativeEvent.isComposing || e.keyCode === 229) return
              e.preventDefault()
              submit(input)
            }}
            placeholder="Ask about your dive…"
            maxLength={1200}
            className="max-h-32 min-h-11 flex-1 resize-none rounded-2xl border border-input bg-secondary px-4 py-2.5 text-sm leading-relaxed outline-none field-sizing-content focus-visible:ring-2 focus-visible:ring-ring"
          />
          <Button type="submit" size="icon" className="size-11 shrink-0 rounded-full" disabled={busy || !input.trim()}>
            <Send aria-hidden="true" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </aside>
    </>
  )
}

function Bubble({ role, tip, children }: { role: 'user' | 'guide'; tip?: boolean; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap',
        role === 'user'
          ? 'self-end rounded-br-md bg-primary text-primary-foreground'
          : 'self-start rounded-bl-md bg-secondary text-secondary-foreground',
        tip && 'border border-primary/40',
      )}
    >
      {role === 'guide' && <span className="sr-only">Guide: </span>}
      {children}
    </div>
  )
}
