const STORAGE_KEY = 'ailab-games-v1'

export type GameId =
  | 'use_it'
  | 'mission_brief'
  | 'prompt_craft'
  | 'hallucination'
  | 'draft_rescue'
  | 'the_line'

export type RankTier = 'apprentice' | 'analyst' | 'leader'

export type GameProgressState = {
  trustScore: number
  worldStars: Record<GameId, number>
  hunterBadges: number
  draftRescueBestLift: number
  theLineStreak: number
  plays: Partial<Record<GameId, number>>
}

const defaultState: GameProgressState = {
  trustScore: 72,
  worldStars: {
    use_it: 0,
    mission_brief: 0,
    prompt_craft: 0,
    hallucination: 0,
    draft_rescue: 0,
    the_line: 0,
  },
  hunterBadges: 0,
  draftRescueBestLift: 0,
  theLineStreak: 0,
  plays: {},
}

function fresh(): GameProgressState {
  return {
    trustScore: defaultState.trustScore,
    worldStars: { ...defaultState.worldStars },
    hunterBadges: defaultState.hunterBadges,
    draftRescueBestLift: defaultState.draftRescueBestLift,
    theLineStreak: defaultState.theLineStreak,
    plays: {},
  }
}

function read(): GameProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fresh()
    const parsed = JSON.parse(raw) as Partial<GameProgressState>
    return {
      ...fresh(),
      ...parsed,
      worldStars: { ...defaultState.worldStars, ...parsed.worldStars },
      plays: { ...parsed.plays },
    }
  } catch {
    return fresh()
  }
}

function write(s: GameProgressState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  window.dispatchEvent(new Event('ailab-games'))
}

export function loadGameProgress(): GameProgressState {
  return read()
}

export function totalStars(s: GameProgressState): number {
  return (Object.values(s.worldStars) as number[]).reduce((a, b) => a + b, 0)
}

export function rankFromStars(stars: number): RankTier {
  if (stars >= 42) return 'leader'
  if (stars >= 18) return 'analyst'
  return 'apprentice'
}

export function bumpTrust(delta: number) {
  const s = read()
  s.trustScore = Math.max(12, Math.min(100, s.trustScore + delta))
  write(s)
}

export function recordWorldStars(game: GameId, stars: number) {
  const s = read()
  s.worldStars[game] = Math.max(s.worldStars[game] ?? 0, Math.min(15, stars))
  s.plays[game] = (s.plays[game] ?? 0) + 1
  write(s)
}

export function addHunterBadge(n: number) {
  const s = read()
  s.hunterBadges += n
  write(s)
}

export function recordDraftLift(lift: number) {
  const s = read()
  s.draftRescueBestLift = Math.max(s.draftRescueBestLift, lift)
  write(s)
}

export function recordTheLineStreak(streak: number) {
  const s = read()
  s.theLineStreak = Math.max(s.theLineStreak, streak)
  write(s)
}
