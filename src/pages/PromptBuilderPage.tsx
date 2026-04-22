import { useState } from 'react'
import { PROMPT_TASKS, scorePrompt } from '../lib/scorePrompt'
import { recordPracticeScore } from '../lib/progress'

export function PromptBuilderPage() {
  const [taskIndex, setTaskIndex] = useState(0)
  const task = PROMPT_TASKS[taskIndex]!
  const [draft, setDraft] = useState('')
  const [result, setResult] = useState<ReturnType<typeof scorePrompt> | null>(null)

  const runScore = () => {
    const r = scorePrompt(draft)
    setResult(r)
    recordPracticeScore(r.score)
  }

  const switchTask = (i: number) => {
    setTaskIndex(i)
    setDraft('')
    setResult(null)
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-display text-3xl font-semibold text-ink">Practice: Prompt Builder</h1>
        <p className="mt-2 max-w-2xl text-ink-muted">
          You get a realistic scenario. Write a prompt you would send to a chatbot. You are scored on clarity,
          constraints, and responsible intent—not on buzzwords.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {PROMPT_TASKS.map((t, i) => (
          <button
            key={t.id}
            type="button"
            onClick={() => switchTask(i)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              i === taskIndex ? 'bg-teal text-white' : 'border border-line bg-card text-ink-muted hover:border-teal/40'
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      <section className="rounded-xl border border-line bg-card p-6 shadow-sm sm:p-8">
        <h2 className="font-display text-lg font-semibold text-ink">{task.title}</h2>
        <p className="mt-3 text-sm text-ink-muted">{task.scenario}</p>
        <p className="mt-4 rounded-lg border border-teal/25 bg-teal/5 px-4 py-3 text-sm font-medium text-ink">
          Goal: {task.goalLine}
        </p>

        <label className="mt-6 block text-sm font-semibold text-ink" htmlFor="prompt-draft">
          Your prompt
        </label>
        <textarea
          id="prompt-draft"
          className="mt-2 w-full min-h-[140px] resize-y rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink outline-none ring-teal/30 focus:ring-2"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Example: “I’m in 10th grade US History…”"
        />

        <button
          type="button"
          className="mt-4 rounded-xl bg-teal px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-hover disabled:cursor-not-allowed disabled:opacity-50"
          disabled={draft.trim().length < 8}
          onClick={runScore}
        >
          Score my prompt
        </button>
      </section>

      {result ? (
        <section className="rounded-xl border border-teal/25 bg-teal/5 p-6 sm:p-8" aria-live="polite">
          <p className="font-display text-2xl font-semibold text-ink">
            Score: <span className="text-teal">{result.score}</span>
            <span className="text-lg font-normal text-ink-muted">/100</span>
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-ink-muted">
            {result.feedback.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-ink-muted">
            Heuristic scoring for learning—not a guarantee of model behavior. Revise and run again; your best
            score is saved on the dashboard.
          </p>
        </section>
      ) : null}
    </div>
  )
}
