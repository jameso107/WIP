import { useState } from 'react'
import { Link } from 'react-router-dom'
import { recordPracticeScore } from '../../lib/progress'
import { recordWorldStars } from '../../lib/gameProgress'
import { PROMPT_ARENA_TASKS, scorePrompt } from '../../lib/scorePrompt'

const CHECKLIST_KEYS = [
  { id: 'role', label: 'Names role or level (e.g., 7th grade, job title)' },
  { id: 'context', label: 'States what you already did or know' },
  { id: 'constraints', label: 'Hard limits (length, banned behaviors, sources)' },
  { id: 'tone', label: 'Tone or reading level' },
  { id: 'format', label: 'Output format (bullets, table, questions first, …)' },
  { id: 'quality', label: 'Quality check (e.g., hide answers until I try)' },
] as const

export function PromptCraftArenaPage() {
  const [taskIdx, setTaskIdx] = useState(0)
  const task = PROMPT_ARENA_TASKS[taskIdx]!
  const [draft, setDraft] = useState('')
  const [checks, setChecks] = useState<Record<(typeof CHECKLIST_KEYS)[number]['id'], boolean>>({
    role: false,
    context: false,
    constraints: false,
    tone: false,
    format: false,
    quality: false,
  })
  const [result, setResult] = useState<{ base: number; comm: number; lines: string[] } | null>(null)

  const run = () => {
    const base = scorePrompt(draft)
    const ticked = CHECKLIST_KEYS.filter((k) => checks[k.id]).length
    const comm = Math.min(100, base.score + ticked * 3)
    const lines = [
      ...base.feedback,
      `Communication checklist self-audit: ${ticked}/6 boxes you believe you hit (honesty matters in class).`,
    ]
    setResult({ base: base.score, comm, lines })
    recordPracticeScore(comm)
    const stars = comm >= 88 ? 3 : comm >= 72 ? 2 : comm >= 55 ? 1 : 0
    if (stars > 0) recordWorldStars('prompt_craft', stars)
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <Link to="/games" className="text-sm font-medium text-teal hover:underline">
        ← Games
      </Link>
      <h1 className="font-display text-3xl font-semibold text-ink">Prompt Craft Arena</h1>
      <p className="text-sm text-ink-muted">
        Build a prompt that reads like a crisp brief. Automated score plus a communication checklist—head-to-head
        voting with classmates can come later.
      </p>

      <div className="flex flex-wrap gap-2">
        {PROMPT_ARENA_TASKS.map((t, i) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setTaskIdx(i)
              setDraft('')
              setResult(null)
              setChecks({
                role: false,
                context: false,
                constraints: false,
                tone: false,
                format: false,
                quality: false,
              })
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              i === taskIdx ? 'bg-teal text-white' : 'border border-line bg-card text-ink-muted hover:border-teal/40'
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      <section className="rounded-xl border border-line bg-card p-5 shadow-sm">
        <h2 className="font-display text-lg font-semibold text-ink">{task.title}</h2>
        <p className="mt-2 text-sm text-ink-muted">{task.scenario}</p>
        <p className="mt-3 rounded-lg border border-teal/20 bg-teal/5 px-3 py-2 text-sm font-medium text-ink">
          Target: {task.goalLine}
        </p>
      </section>

      <section className="rounded-xl border border-line bg-card p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-ink">Communication checklist</h3>
        <ul className="mt-3 space-y-2">
          {CHECKLIST_KEYS.map((k) => (
            <li key={k.id}>
              <label className="flex cursor-pointer gap-2 text-sm text-ink-muted">
                <input
                  type="checkbox"
                  checked={checks[k.id]}
                  onChange={(e) => setChecks((c) => ({ ...c, [k.id]: e.target.checked }))}
                />
                {k.label}
              </label>
            </li>
          ))}
        </ul>
      </section>

      <label className="text-sm font-semibold text-ink">
        Your prompt
        <textarea
          className="mt-2 w-full min-h-[140px] rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink outline-none ring-teal/30 focus:ring-2"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write the prompt you would send…"
        />
      </label>

      <button
        type="button"
        className="rounded-xl bg-teal px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-hover disabled:opacity-50"
        disabled={draft.trim().length < 8}
        onClick={run}
      >
        Score prompt
      </button>

      {result ? (
        <div className="rounded-xl border border-teal/25 bg-teal/5 p-5 text-sm" aria-live="polite">
          <p className="font-display text-2xl font-semibold text-ink">
            Arena score: <span className="text-teal">{result.comm}</span>
            <span className="text-base font-normal text-ink-muted">/100</span>
          </p>
          <p className="mt-1 text-xs text-ink-muted">Heuristic base {result.base}/100 + checklist bonus (capped)</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-ink-muted">
            {result.lines.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
