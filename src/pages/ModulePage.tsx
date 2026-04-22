import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getModule } from '../data/modules'
import { completeModule, isModuleComplete } from '../lib/progress'

export function ModulePage() {
  const { moduleId } = useParams()
  const mod = useMemo(() => (moduleId ? getModule(moduleId) : undefined), [moduleId])
  const [choice, setChoice] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [reflection, setReflection] = useState('')
  const [saved, setSaved] = useState(() => (moduleId ? isModuleComplete(moduleId) : false))

  if (!mod) {
    return (
      <div className="rounded-xl border border-line bg-card p-8 text-center">
        <p className="text-ink-muted">Module not found.</p>
        <Link to="/learn" className="mt-4 inline-block font-semibold text-teal underline">
          Back to courses
        </Link>
      </div>
    )
  }

  const selected = mod.interactive.options.find((o) => o.id === choice)
  const answeredCorrectly = submitted && selected?.isCorrect

  const handleComplete = () => {
    if (!answeredCorrectly || reflection.trim().length < 12) return
    completeModule(mod.id)
    setSaved(true)
  }

  return (
    <article className="flex flex-col gap-10">
      <div>
        <Link to="/learn" className="text-sm font-medium text-teal hover:underline">
          ← All modules
        </Link>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink">{mod.title}</h1>
        <p className="mt-2 text-ink-muted">{mod.subtitle}</p>
      </div>

      {mod.sections.map((sec) => (
        <section key={sec.id} className="rounded-xl border border-line bg-card p-6 shadow-sm sm:p-8">
          <h2 className="font-display text-xl font-semibold text-ink">{sec.heading}</h2>
          <div className="mt-4 space-y-3 text-ink-muted">
            {sec.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      ))}

      <section className="rounded-xl border border-line bg-paper-dark/80 p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold text-ink">{mod.example.title}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-ember/30 bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ember">Weaker habit</p>
            <p className="mt-2 text-sm text-ink-muted">{mod.example.bad}</p>
          </div>
          <div className="rounded-lg border border-teal/30 bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal">Stronger habit</p>
            <p className="mt-2 text-sm text-ink-muted">{mod.example.good}</p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-line bg-card p-6 shadow-sm sm:p-8">
        <h2 className="font-display text-xl font-semibold text-ink">Interactive check</h2>
        <p className="mt-2 text-ink-muted">{mod.interactive.prompt}</p>
        <ul className="mt-4 flex flex-col gap-2">
          {mod.interactive.options.map((opt) => (
            <li key={opt.id}>
              <label className="flex cursor-pointer gap-3 rounded-lg border border-line bg-paper px-4 py-3 transition hover:border-teal/40 has-[:checked]:border-teal/50 has-[:checked]:bg-teal/5">
                <input
                  type="radio"
                  name="mcq"
                  className="mt-1"
                  checked={choice === opt.id}
                  onChange={() => {
                    setChoice(opt.id)
                    setSubmitted(false)
                  }}
                />
                <span className="text-sm text-ink">{opt.label}</span>
              </label>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="mt-4 rounded-xl bg-teal px-4 py-2.5 text-sm font-semibold text-white transition enabled:hover:bg-teal-hover disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!choice}
          onClick={() => setSubmitted(true)}
        >
          Check answer
        </button>
        {submitted && selected ? (
          <p
            className={`mt-4 rounded-lg px-4 py-3 text-sm ${selected.isCorrect ? 'bg-teal/10 text-ink' : 'bg-ember/10 text-ink'}`}
          >
            {selected.isCorrect ? mod.interactive.rationale : 'Not quite—try the option that keeps you in the driver’s seat with sources and limits.'}
          </p>
        ) : null}
      </section>

      <section className="rounded-xl border border-line bg-card p-6 shadow-sm sm:p-8">
        <h2 className="font-display text-xl font-semibold text-ink">Reflection</h2>
        <p className="mt-2 text-sm text-ink-muted">{mod.reflection}</p>
        <textarea
          className="mt-4 w-full min-h-[100px] resize-y rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink outline-none ring-teal/30 focus:ring-2"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Write a few sentences in your own words…"
          disabled={saved}
        />
        <button
          type="button"
          className="mt-4 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-paper transition enabled:hover:bg-ink/85 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!answeredCorrectly || reflection.trim().length < 12 || saved}
          onClick={handleComplete}
        >
          {saved ? 'Saved to dashboard' : 'Mark module complete'}
        </button>
        {!answeredCorrectly ? (
          <p className="mt-2 text-xs text-ink-muted">Answer the check correctly to unlock completion.</p>
        ) : null}
      </section>
    </article>
  )
}
