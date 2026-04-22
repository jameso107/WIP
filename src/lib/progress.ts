const STORAGE_KEY = 'ailab-progress-v1'

export type ProgressState = {
  completedModuleIds: string[]
  practiceRuns: number
  bestPromptScore: number
  lastPromptScore: number | null
  guideMessagesSent: number
}

const defaultState: ProgressState = {
  completedModuleIds: [],
  practiceRuns: 0,
  bestPromptScore: 0,
  lastPromptScore: null,
  guideMessagesSent: 0,
}

function read(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultState }
    const parsed = JSON.parse(raw) as Partial<ProgressState>
    return { ...defaultState, ...parsed }
  } catch {
    return { ...defaultState }
  }
}

function write(state: ProgressState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  window.dispatchEvent(new Event('ailab-progress'))
}

export function loadProgress(): ProgressState {
  return read()
}

export function completeModule(moduleId: string) {
  const s = read()
  if (!s.completedModuleIds.includes(moduleId)) {
    s.completedModuleIds.push(moduleId)
    write(s)
  }
}

export function isModuleComplete(moduleId: string): boolean {
  return read().completedModuleIds.includes(moduleId)
}

export function recordPracticeScore(score: number) {
  const s = read()
  s.practiceRuns += 1
  s.lastPromptScore = score
  s.bestPromptScore = Math.max(s.bestPromptScore, score)
  write(s)
}

export function recordGuideMessage() {
  const s = read()
  s.guideMessagesSent += 1
  write(s)
}
