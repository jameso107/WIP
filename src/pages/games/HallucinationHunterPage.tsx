import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HUNTER_MISSIONS,
  HUNTER_TAG_LABELS,
  type HunterLine,
  type HunterTag,
} from '../../data/games/hallucinationHunterData'
import { addHunterBadge, recordWorldStars } from '../../lib/gameProgress'

type Catch = { lineId: string; tag: HunterTag }

function lineTruthCount(lines: HunterLine[]): number {
  return lines.reduce((n, l) => n + l.truth.length, 0)
}

export function HallucinationHunterPage() {
  const [mIdx, setMIdx] = useState(0)
  const mission = HUNTER_MISSIONS[mIdx]!
  const [catches, setCatches] = useState<Catch[]>([])
  const [pickLine, setPickLine] = useState<string>(mission.lines[0]!.id)
  const [pickTag, setPickTag] = useState<HunterTag>('unsupported')
  const [submitted, setSubmitted] = useState(false)
  const [scoreMsg, setScoreMsg] = useState<string | null>(null)

  const truthTotal = useMemo(() => lineTruthCount(mission.lines), [mission.lines])

  const addCatch = () => {
    if (catches.some((c) => c.lineId === pickLine && c.tag === pickTag)) return
    setCatches((c) => [...c, { lineId: pickLine, tag: pickTag }])
  }

  const submit = () => {
    let hits = 0
    for (const line of mission.lines) {
      for (const t of line.truth) {
        if (catches.some((c) => c.lineId === line.id && c.tag === t)) hits++
      }
    }
    const ratio = truthTotal ? hits / truthTotal : 0
    const stars = ratio >= 0.85 ? 3 : ratio >= 0.55 ? 2 : ratio >= 0.25 ? 1 : 0
    if (ratio >= 0.7) addHunterBadge(1)
    if (stars > 0) recordWorldStars('hallucination', stars)
    setScoreMsg(
      `You flagged ${hits}/${truthTotal} ground-truth issues (${Math.round(ratio * 100)}%).` +
        (stars ? ` Mission stars: ${stars}/3.` : ' Try again for more stars.'),
    )
    setSubmitted(true)
  }

  const switchMission = (i: number) => {
    setMIdx(i)
    const m = HUNTER_MISSIONS[i]!
    setPickLine(m.lines[0]!.id)
    setCatches([])
    setSubmitted(false)
    setScoreMsg(null)
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Link to="/games" className="text-sm font-medium text-teal hover:underline">
        ← Games
      </Link>
      <h1 className="font-display text-3xl font-semibold text-ink">Hallucination Hunter</h1>
      <p className="text-sm text-ink-muted">
        Flag suspicious lines with a forensic tag. Partial credit when your tag matches any issue on that line.
      </p>

      <div className="flex flex-wrap gap-2">
        {HUNTER_MISSIONS.map((m, i) => (
          <button
            key={m.id}
            type="button"
            onClick={() => switchMission(i)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              i === mIdx ? 'bg-teal text-white' : 'border border-line bg-card text-ink-muted hover:border-teal/40'
            }`}
          >
            {m.title}
          </button>
        ))}
      </div>

      <p className="text-sm text-ink-muted">{mission.intro}</p>

      <ol className="space-y-3 rounded-xl border border-line bg-card p-4 shadow-sm">
        {mission.lines.map((line, i) => (
          <li key={line.id} className="flex gap-3 text-sm">
            <span className="shrink-0 font-mono text-ink-muted">{i + 1}.</span>
            <span className="text-ink">{line.text}</span>
          </li>
        ))}
      </ol>

      {!submitted ? (
        <div className="rounded-xl border border-line bg-paper-dark/50 p-4">
          <p className="text-sm font-semibold text-ink">Add a flag</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <label className="text-xs font-medium text-ink-muted">
              Line #
              <select
                className="mt-1 block w-full rounded-lg border border-line bg-card px-2 py-2 text-sm text-ink sm:w-40"
                value={pickLine}
                onChange={(e) => setPickLine(e.target.value)}
              >
                {mission.lines.map((l, i) => (
                  <option key={l.id} value={l.id}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </label>
            <label className="min-w-[200px] flex-1 text-xs font-medium text-ink-muted">
              Tag
              <select
                className="mt-1 block w-full rounded-lg border border-line bg-card px-2 py-2 text-sm text-ink"
                value={pickTag}
                onChange={(e) => setPickTag(e.target.value as HunterTag)}
              >
                {(Object.keys(HUNTER_TAG_LABELS) as HunterTag[]).map((t) => (
                  <option key={t} value={t}>
                    {HUNTER_TAG_LABELS[t]}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="rounded-xl bg-teal px-4 py-2 text-sm font-semibold text-white hover:bg-teal-hover"
              onClick={addCatch}
            >
              Add flag
            </button>
          </div>
          <ul className="mt-4 space-y-1 text-sm text-ink-muted">
            {catches.map((c, i) => {
              const n = mission.lines.findIndex((l) => l.id === c.lineId) + 1
              return (
                <li key={`${c.lineId}-${c.tag}-${i}`}>
                  Line {n}: {HUNTER_TAG_LABELS[c.tag]}
                </li>
              )
            })}
          </ul>
          <button
            type="button"
            className="mt-4 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-paper hover:bg-ink/85"
            disabled={catches.length === 0}
            onClick={submit}
          >
            Submit investigation
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-teal/30 bg-teal/5 p-4 text-sm text-ink">
          {scoreMsg}
          <button
            type="button"
            className="mt-4 block text-sm font-semibold text-teal hover:underline"
            onClick={() => switchMission(mIdx)}
          >
            Retry mission
          </button>
        </div>
      )}
    </div>
  )
}
