'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useGame } from '@/components/game-provider'
import { getLevel, MAX_LEVEL } from '@/data/levels'
import { fundsUnlockedAt } from '@/lib/funds'
import { buildGuideGameState } from '@/lib/guide/game-state'
import type { ChatMessage, GuideProviderName } from '@/lib/guide/types'

const STORAGE_KEY = 'divefund:guide:v1'
const HISTORY_LIMIT = 10
const MAX_STORED = 60
const FEE_TIP_THRESHOLD = 0.005

interface TipFlags {
  feeShown: boolean
  seenLevel: number
  congratulated: number[]
}

interface Stored {
  messages: ChatMessage[]
  open: boolean | null
  tips: TipFlags | null
  width?: number
}

interface GuideContextValue {
  messages: ChatMessage[]
  open: boolean
  unread: boolean
  busy: boolean
  error: boolean
  provider: GuideProviderName | null
  level: number
  setLevel: (level: number) => void
  setOpen: (open: boolean) => void
  send: (text: string) => void
  clear: () => void
  width: number
  setWidth: (width: number) => void
}

export const GUIDE_MIN_WIDTH = 320
export const GUIDE_MAX_WIDTH = 720
export const GUIDE_DEFAULT_WIDTH = 380

export function clampGuideWidth(px: number): number {
  const viewportCap = typeof window === 'undefined' ? GUIDE_MAX_WIDTH : Math.floor(window.innerWidth * 0.6)
  return Math.round(Math.min(Math.max(px, GUIDE_MIN_WIDTH), Math.max(GUIDE_MIN_WIDTH, Math.min(GUIDE_MAX_WIDTH, viewportCap))))
}

const GuideContext = createContext<GuideContextValue | null>(null)

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Math.random()).slice(2)

export function GuideStateProvider({ children }: { children: React.ReactNode }) {
  const { state, sim, hydrated: gameHydrated } = useGame()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [open, setOpenState] = useState(false)
  const [unread, setUnread] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)
  const [provider, setProvider] = useState<GuideProviderName | null>(null)
  const [level, setLevel] = useState(1)
  const [tips, setTips] = useState<TipFlags | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const [width, setWidthState] = useState(GUIDE_DEFAULT_WIDTH)
  const setWidth = useCallback((px: number) => setWidthState(clampGuideWidth(px)), [])

  const openRef = useRef(open)
  openRef.current = open
  const busyRef = useRef(busy)
  busyRef.current = busy
  const snapshot = useRef({ state, sim, level, messages })
  snapshot.current = { state, sim, level, messages }

  useEffect(() => {
    let stored: Partial<Stored> = {}
    try {
      stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}')
    } catch {
      // Corrupt storage: start with an empty chat.
    }
    if (Array.isArray(stored.messages)) setMessages(stored.messages.slice(-MAX_STORED))
    setOpenState(typeof stored.open === 'boolean' ? stored.open : window.matchMedia('(min-width: 1024px)').matches)
    if (stored.tips) setTips(stored.tips)
    if (typeof stored.width === 'number') setWidthState(clampGuideWidth(stored.width))
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      const data: Stored = { messages: messages.slice(-MAX_STORED), open, tips, width }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      // Storage unavailable; chat simply won't persist.
    }
  }, [messages, open, tips, width, hydrated])

  // Contextual tips: compare live game state with what the guide has already reacted to.
  useEffect(() => {
    if (!hydrated || !gameHydrated || !state.diver) return
    if (!tips) {
      setTips({
        feeShown: sim.blendedExpense > FEE_TIP_THRESHOLD,
        seenLevel: state.currentLevel,
        congratulated: [...state.passedQuizzes],
      })
      return
    }

    // A game reset lowers progress; forget tips tied to progress that no longer exists.
    const next: TipFlags = {
      feeShown: tips.feeShown,
      seenLevel: Math.min(tips.seenLevel, state.currentLevel),
      congratulated: tips.congratulated.filter((l) => state.passedQuizzes.includes(l)),
    }
    const out: string[] = []

    for (const passed of state.passedQuizzes) {
      if (next.congratulated.includes(passed)) continue
      next.congratulated.push(passed)
      const upcoming = passed < MAX_LEVEL ? getLevel(passed + 1) : undefined
      out.push(
        upcoming
          ? `Nice work passing the ${getLevel(passed)?.name} check! ${upcoming.name} is open now. Descend when you're ready.`
          : 'You passed the deepest check of all. Your dive log is ready whenever you want to look back.',
      )
    }

    for (let l = next.seenLevel + 1; l <= state.currentLevel; l++) {
      for (const fund of fundsUnlockedAt(l)) out.push(`New fund unlocked: ${fund.name}. ${fund.newReason}`)
    }
    next.seenLevel = Math.max(next.seenLevel, state.currentLevel)

    if (!next.feeShown && sim.blendedExpense > FEE_TIP_THRESHOLD) {
      next.feeShown = true
      out.push(`Noticed your fees just climbed. Want to know why that matters over ${state.horizonYears} years?`)
    }

    const changed =
      next.feeShown !== tips.feeShown ||
      next.seenLevel !== tips.seenLevel ||
      next.congratulated.length !== tips.congratulated.length
    if (changed) setTips(next)
    if (out.length > 0) {
      setMessages((m) => [...m, ...out.map((text) => ({ id: newId(), role: 'guide' as const, text, tip: true }))])
      if (!openRef.current) setUnread(true)
    }
  }, [
    hydrated,
    gameHydrated,
    state.diver,
    state.currentLevel,
    state.passedQuizzes,
    state.horizonYears,
    sim.blendedExpense,
    tips,
  ])

  const setOpen = useCallback((value: boolean) => {
    setOpenState(value)
    if (value) setUnread(false)
  }, [])

  const send = useCallback(async (raw: string) => {
    const text = raw.trim().slice(0, 1200)
    if (!text || busyRef.current) return
    const userMessage: ChatMessage = { id: newId(), role: 'user', text }
    const { state: s, sim: sm, level: lv, messages: current } = snapshot.current
    const history = [...current, userMessage].slice(-HISTORY_LIMIT)
    setMessages((m) => [...m, userMessage])
    busyRef.current = true
    setBusy(true)
    setError(false)
    try {
      const res = await fetch('/api/guide/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.map(({ id, role, text: t }) => ({ id, role, text: t })),
          gameState: buildGuideGameState(lv, s, sm),
        }),
      })
      if (!res.ok) throw new Error(`Guide request failed: ${res.status}`)
      const data: { reply: string; provider: GuideProviderName } = await res.json()
      setProvider(data.provider)
      setMessages((m) => [...m, { id: newId(), role: 'guide', text: data.reply }])
      if (!openRef.current) setUnread(true)
    } catch {
      setError(true)
    } finally {
      busyRef.current = false
      setBusy(false)
    }
  }, [])

  const clear = useCallback(() => {
    setMessages([])
    setError(false)
  }, [])

  const value = useMemo<GuideContextValue>(
    () => ({ messages, open, unread, busy, error, provider, level, setLevel, setOpen, send, clear, width, setWidth }),
    [messages, open, unread, busy, error, provider, level, setOpen, send, clear, width, setWidth],
  )

  return <GuideContext.Provider value={value}>{children}</GuideContext.Provider>
}

export function useGuide(): GuideContextValue {
  const ctx = useContext(GuideContext)
  if (!ctx) throw new Error('useGuide must be used inside GuideStateProvider')
  return ctx
}
