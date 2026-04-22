import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LINE_REASON_LABELS,
  LINE_SCENARIOS,
  type LineReason,
  type Spectrum,
} from '../../data/games/theLineData'
import { recordTheLineStreak, recordWorldStars } from '../../lib/gameProgress'

const SPECTRUM_LABEL: Record<Spectrum, string> = {
  green: 'Green — appropriate',
  yellow: 'Yellow — depends / disclose / tighten',
  red: 'Red — inappropriate',
}

export function TheLinePage() {
  const [order] = useState(() => {
    const o = [...Array(LINE_SCENARIOS.length).keys()]
    for (let i = o.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[o[i], o[j]] = [o[j]!, o[i]!]
    }
    return o.slice(0, 5)
  })
  const [step, setStep] = useState(0)
  const [spectrum, setSpectrum] = useState<Spectrum | null>(null)
  const [reasons, setReasons] = useState<Set<LineReason>>(() => new Set())
  const [feedback, setFeedback] = useState<string | null>(null)
  const [streak, setStreak] = useState(0)
  const [done, setDone] = useState(false)
  const [donePeak, setDonePeak] = useState(0)
  const peakStreak = useRef(0)

  const scenario = LINE_SCENARIOS[order[step]!]!

  const toggleReason = (r: LineReason) => {
    setReasons((s) => {
      const n = new Set(s)
      if (n.has(r)) n.delete(r)
      else n.add(r)
      return n
    })
  }

  const submit = () => {
    if (!spectrum || reasons.size === 0) return
    const specOk = spectrum === scenario.spectrum
    const overlap = scenario.validReasons.some((r) => reasons.has(r))
    const ok = specOk && overlap
    setFeedback(
      ok
        ? 'Nice judgment—your spectrum and at least one reason match how schools and employers tend to view this.'
        : `Expected spectrum: ${SPECTRUM_LABEL[scenario.spectrum]}. Reasons that fit include: ${scenario.validReasons.map((r) => LINE_REASON_LABELS[r]).join('; ')}.`,
    )
    if (ok) {
      const s = streak + 1
      setStreak(s)
      peakStreak.current = Math.max(peakStreak.current, s)
      recordTheLineStreak(s)
    } else {
      setStreak(0)
    }
  }

  const next = () => {
    if (step >= order.length - 1) {
      const peak = peakStreak.current
      const stars = peak >= 4 ? 3 : peak >= 2 ? 2 : peak >= 1 ? 1 : 0
      if (stars > 0) recordWorldStars('the_line', stars)
      setDonePeak(peak)
      setDone(true)
      return
    }
    setStep((s) => s + 1)
    setSpectrum(null)
    setReasons(new Set())
    setFeedback(null)
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-line bg-card p-8 text-center shadow-sm">
        <h1 className="font-display text-2xl font-semibold text-ink">Ethics sprint complete</h1>
        <p className="mt-3 text-ink-muted">Best streak this run: {donePeak} correct in a row.</p>
        <Link to="/games" className="mt-6 inline-flex rounded-xl bg-teal px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-hover">
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
          Card {step + 1}/5 · Streak {streak}
        </span>
      </div>
      <h1 className="font-display text-3xl font-semibold text-ink">The Line</h1>
      <p className="text-sm text-ink-muted">
        Place the scenario on the spectrum, then pick at least one reason that captures the main risk or virtue.
      </p>

      <div className="rounded-xl border border-line bg-card p-6 shadow-sm">
        <p className="text-lg text-ink">{scenario.text}</p>

        <div className="mt-6 flex flex-col gap-2">
          {(Object.keys(SPECTRUM_LABEL) as Spectrum[]).map((s) => (
            <label
              key={s}
              className="flex cursor-pointer gap-3 rounded-lg border border-line bg-paper px-4 py-3 has-[:checked]:border-teal/50 has-[:checked]:bg-teal/5"
            >
              <input type="radio" name="sp" checked={spectrum === s} onChange={() => setSpectrum(s)} />
              <span className="text-sm">{SPECTRUM_LABEL[s]}</span>
            </label>
          ))}
        </div>

        <fieldset className="mt-6">
          <legend className="text-sm font-semibold text-ink">Reasons (pick any that apply)</legend>
          <div className="mt-2 flex flex-col gap-2">
            {(Object.keys(LINE_REASON_LABELS) as LineReason[]).map((r) => (
              <label key={r} className="flex cursor-pointer gap-2 text-sm text-ink-muted">
                <input type="checkbox" checked={reasons.has(r)} onChange={() => toggleReason(r)} />
                {LINE_REASON_LABELS[r]}
              </label>
            ))}
          </div>
        </fieldset>

        {!feedback ? (
          <button
            type="button"
            className="mt-6 rounded-xl bg-teal px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-hover disabled:opacity-50"
            disabled={!spectrum || reasons.size === 0}
            onClick={submit}
          >
            Lock judgment
          </button>
        ) : (
          <div className="mt-6 space-y-4">
            <p className="rounded-lg bg-paper-dark px-4 py-3 text-sm text-ink">{feedback}</p>
            <button
              type="button"
              className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-paper hover:bg-ink/85"
              onClick={next}
            >
              {step >= order.length - 1 ? 'Finish' : 'Next card'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
