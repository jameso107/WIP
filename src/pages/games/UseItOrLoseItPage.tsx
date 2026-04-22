import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SCENARIOS, USAGE_LABELS, type UsageChoice } from '../../data/games/useItOrLoseItData'
import { bumpTrust, recordWorldStars } from '../../lib/gameProgress'

const ROUND_LEN = 6

export function UseItOrLoseItPage() {
  const [indices] = useState(() => {
    const idx = [...Array(SCENARIOS.length).keys()]
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[idx[i], idx[j]] = [idx[j]!, idx[i]!]
    }
    return idx.slice(0, ROUND_LEN)
  })

  const [step, setStep] = useState(0)
  const [choice, setChoice] = useState<UsageChoice | null>(null)
  const [why, setWhy] = useState('')
  const [phase, setPhase] = useState<'pick' | 'result'>('pick')
  const [lastFb, setLastFb] = useState<{ headline: string; detail: string; trustDelta: number } | null>(null)
  const [done, setDone] = useState(false)
  const [goodPicks, setGoodPicks] = useState(0)

  const scenario = SCENARIOS[indices[step]!]

  const submit = () => {
    if (!choice || why.trim().length < 12 || !scenario) return
    const fb = scenario.feedback[choice]
    bumpTrust(fb.trustDelta)
    const optimal = choice === scenario.best || scenario.ok?.includes(choice)
    if (optimal) setGoodPicks((n) => n + 1)
    setLastFb(fb)
    setPhase('result')
  }

  const next = () => {
    if (step >= ROUND_LEN - 1) {
      const stars = goodPicks >= 5 ? 3 : goodPicks >= 3 ? 2 : 1
      recordWorldStars('use_it', stars)
      setDone(true)
      return
    }
    setStep((s) => s + 1)
    setChoice(null)
    setWhy('')
    setPhase('pick')
    setLastFb(null)
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-line bg-card p-8 text-center shadow-sm">
        <h1 className="font-display text-2xl font-semibold text-ink">Round complete</h1>
        <p className="mt-3 text-ink-muted">
          Your trust score moved with each call. Keep practicing restraint—it is a muscle.
        </p>
        <Link
          to="/games"
          className="mt-6 inline-flex rounded-xl bg-teal px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-hover"
        >
          Back to games
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <Link to="/games" className="text-sm font-medium text-teal hover:underline">
          ← Games
        </Link>
        <span className="text-sm text-ink-muted">
          Scenario {step + 1}/{ROUND_LEN}
        </span>
      </div>
      <h1 className="font-display text-3xl font-semibold text-ink">Use It or Lose It</h1>
      <p className="text-sm text-ink-muted">
        Pick how AI should be used, defend it in one sentence, then see how your fictional teacher reacts.
      </p>

      <div className="rounded-xl border border-line bg-card p-6 shadow-sm">
        <p className="text-lg font-medium text-ink">{scenario?.prompt}</p>

        {phase === 'pick' ? (
          <div className="mt-6 flex flex-col gap-4">
            <fieldset>
              <legend className="text-sm font-semibold text-ink">Your call</legend>
              <div className="mt-2 flex flex-col gap-2">
                {(Object.keys(USAGE_LABELS) as UsageChoice[]).map((k) => (
                  <label
                    key={k}
                    className="flex cursor-pointer gap-3 rounded-lg border border-line bg-paper px-4 py-3 has-[:checked]:border-teal/50 has-[:checked]:bg-teal/5"
                  >
                    <input type="radio" name="u" checked={choice === k} onChange={() => setChoice(k)} />
                    <span className="text-sm">{USAGE_LABELS[k]}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="text-sm font-semibold text-ink">
              One-sentence justification
              <textarea
                className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink outline-none ring-teal/30 focus:ring-2"
                rows={2}
                value={why}
                onChange={(e) => setWhy(e.target.value)}
                placeholder="Because…"
              />
            </label>
            <button
              type="button"
              className="rounded-xl bg-teal px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-hover disabled:opacity-50"
              disabled={!choice || why.trim().length < 12}
              onClick={submit}
            >
              Lock in choice
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div
              className={`rounded-lg px-4 py-3 text-sm ${
                lastFb && lastFb.trustDelta >= 4
                  ? 'bg-teal/10 text-ink'
                  : lastFb && lastFb.trustDelta < 0
                    ? 'bg-ember/10 text-ink'
                    : 'bg-paper-dark text-ink'
              }`}
            >
              <p className="font-semibold">{lastFb?.headline}</p>
              <p className="mt-1 text-ink-muted">{lastFb?.detail}</p>
              <p className="mt-2 text-xs font-medium text-ink-muted">
                Trust shift: {lastFb && lastFb.trustDelta > 0 ? '+' : ''}
                {lastFb?.trustDelta}
              </p>
            </div>
            <button
              type="button"
              className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-paper hover:bg-ink/85"
              onClick={next}
            >
              {step >= ROUND_LEN - 1 ? 'Finish' : 'Next scenario'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
