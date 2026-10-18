import { emptyAllocation, sanitizeAllocation } from '@/lib/allocation'
import { MAX_LEVEL } from '@/data/levels'
import type { BadgeId, GameState, SimulationResult } from '@/lib/types'

export const STORAGE_KEY = 'divefund:v1'

export const XP = { lockIn: 20, quiz: 50, diversified: 30, lowFee: 30 } as const

export const BADGES: Record<BadgeId, { name: string; description: string }> = {
  'first-dip': { name: 'First Dip', description: 'Locked in your first month.' },
  'diversified-diver': { name: 'Diversified Diver', description: 'Held 3 different asset classes at once.' },
  'fee-fighter': { name: 'Fee Fighter', description: 'Kept your blended fee under 0.10%.' },
  'steady-hands': { name: 'Steady Hands', description: 'Locked in with at least 20% in bonds.' },
  'trench-explorer': { name: 'Trench Explorer', description: 'Reached The Trench.' },
  'scholar-of-the-sea': { name: 'Scholar of the Sea', description: 'Passed every depth check.' },
}

export function createInitialState(): GameState {
  const allocation = emptyAllocation()
  allocation.reef500 = 60
  allocation.openocean = 40
  return {
    version: 1,
    mode: 'beginner',
    diver: null,
    monthlyContribution: 100,
    horizonYears: 30,
    allocation,
    currentLevel: 1,
    passedQuizzes: [],
    lockInsByLevel: {},
    xp: 0,
    streak: 0,
    totalLockedIn: 0,
    badges: [],
    rewardFlags: { diversified: false, lowFee: false },
    completed: false,
  }
}

export function migrateState(raw: unknown): GameState {
  const initial = createInitialState()
  if (!raw || typeof raw !== 'object' || (raw as GameState).version !== 1) return initial
  const merged = { ...initial, ...(raw as GameState) }
  merged.allocation = sanitizeAllocation({ ...initial.allocation, ...merged.allocation }, merged.currentLevel)
  return merged
}

export interface RewardEvents {
  xpGained: number
  newBadges: BadgeId[]
  levelUnlocked: number | null
}

function addBadge(badges: BadgeId[], id: BadgeId, events: RewardEvents) {
  if (!badges.includes(id)) {
    badges.push(id)
    events.newBadges.push(id)
  }
}

export function applyLockIn(
  state: GameState,
  level: number,
  sim: SimulationResult,
): { state: GameState; events: RewardEvents } {
  const events: RewardEvents = { xpGained: XP.lockIn, newBadges: [], levelUnlocked: null }
  const badges = [...state.badges]
  const rewardFlags = { ...state.rewardFlags }

  addBadge(badges, 'first-dip', events)

  const categories = Object.values(sim.categoryExposure).filter((w) => (w ?? 0) > 0).length
  if (categories >= 3) {
    if (!rewardFlags.diversified) {
      rewardFlags.diversified = true
      events.xpGained += XP.diversified
    }
    addBadge(badges, 'diversified-diver', events)
  }

  if (sim.blendedExpense < 0.001) {
    if (!rewardFlags.lowFee) {
      rewardFlags.lowFee = true
      events.xpGained += XP.lowFee
    }
    addBadge(badges, 'fee-fighter', events)
  }

  if ((sim.categoryExposure.Bonds ?? 0) >= 0.2) addBadge(badges, 'steady-hands', events)

  return {
    events,
    state: {
      ...state,
      badges,
      rewardFlags,
      xp: state.xp + events.xpGained,
      streak: state.streak + 1,
      totalLockedIn: state.totalLockedIn + state.monthlyContribution,
      lockInsByLevel: { ...state.lockInsByLevel, [level]: (state.lockInsByLevel[level] ?? 0) + 1 },
    },
  }
}

export function applyQuizPass(state: GameState, level: number): { state: GameState; events: RewardEvents } {
  const events: RewardEvents = { xpGained: 0, newBadges: [], levelUnlocked: null }
  if (state.passedQuizzes.includes(level)) return { state, events }

  const badges = [...state.badges]
  const passedQuizzes = [...state.passedQuizzes, level].sort((a, b) => a - b)
  events.xpGained = XP.quiz

  const nextLevel = Math.min(MAX_LEVEL, Math.max(state.currentLevel, level + 1))
  if (nextLevel > state.currentLevel) events.levelUnlocked = nextLevel
  if (nextLevel >= MAX_LEVEL) addBadge(badges, 'trench-explorer', events)
  if (passedQuizzes.length >= MAX_LEVEL) addBadge(badges, 'scholar-of-the-sea', events)

  return {
    events,
    state: {
      ...state,
      badges,
      passedQuizzes,
      currentLevel: nextLevel,
      xp: state.xp + events.xpGained,
      completed: state.completed || level === MAX_LEVEL,
    },
  }
}
