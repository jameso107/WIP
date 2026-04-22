import { useSyncExternalStore } from 'react'
import { Link } from 'react-router-dom'
import { MODULES } from '../data/modules'
import { loadProgress, type ProgressState } from '../lib/progress'

function subscribe(cb: () => void) {
  const run = () => cb()
  window.addEventListener('storage', run)
  window.addEventListener('ailab-progress', run)
  return () => {
    window.removeEventListener('storage', run)
    window.removeEventListener('ailab-progress', run)
  }
}

function getSnapshot(): ProgressState {
  return loadProgress()
}

function getServerSnapshot(): ProgressState {
  return {
    completedModuleIds: [],
    practiceRuns: 0,
    bestPromptScore: 0,
    lastPromptScore: null,
    guideMessagesSent: 0,
  }
}

export function DashboardPage() {
  const p = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const completed = MODULES.filter((m) => p.completedModuleIds.includes(m.id))

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-display text-3xl font-semibold text-ink">Your dashboard</h1>
        <p className="mt-2 text-ink-muted">
          Progress is stored in this browser only (local demo). Teacher assignment and misuse flags are future
          B2B features.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Modules done" value={`${completed.length}/${MODULES.length}`} />
        <Stat label="Prompt Builder runs" value={String(p.practiceRuns)} />
        <Stat label="Best prompt score" value={p.bestPromptScore ? `${p.bestPromptScore}/100` : '—'} />
        <Stat label="Guide messages sent" value={String(p.guideMessagesSent)} />
      </div>

      {p.lastPromptScore != null ? (
        <p className="text-sm text-ink-muted">
          Last Prompt Builder score: <strong className="text-ink">{p.lastPromptScore}/100</strong>
        </p>
      ) : null}

      <section className="rounded-xl border border-line bg-card p-6 shadow-sm">
        <h2 className="font-display text-lg font-semibold text-ink">Module completion</h2>
        <ul className="mt-4 space-y-2">
          {MODULES.map((m) => {
            const done = p.completedModuleIds.includes(m.id)
            return (
              <li key={m.id} className="flex items-center justify-between gap-4 text-sm">
                <span className={done ? 'text-ink' : 'text-ink-muted'}>{m.title}</span>
                {done ? (
                  <span className="shrink-0 text-teal font-medium">Done</span>
                ) : (
                  <Link to={`/learn/${m.id}`} className="shrink-0 font-medium text-teal hover:underline">
                    Continue
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/learn"
          className="inline-flex rounded-xl bg-teal px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-hover"
        >
          Go to modules
        </Link>
        <Link
          to="/practice/prompt-builder"
          className="inline-flex rounded-xl border border-line bg-card px-4 py-2.5 text-sm font-semibold text-ink hover:border-teal/40"
        >
          Practice again
        </Link>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-card p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold text-ink">{value}</p>
    </div>
  )
}
