import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DRAFT_ISSUE_LABELS, DRAFT_MISSIONS, type DraftIssue } from '../../data/games/draftRescueData'
import { recordDraftLift, recordWorldStars } from '../../lib/gameProgress'

export function DraftRescuePage() {
  const [idx, setIdx] = useState(0)
  const mission = DRAFT_MISSIONS[idx]!
  const [picked, setPicked] = useState<Set<DraftIssue>>(() => new Set())
  const [revision, setRevision] = useState('')
  const [graded, setGraded] = useState<{ lift: number; msg: string } | null>(null)

  const toggle = (k: DraftIssue) => {
    setPicked((s) => {
      const n = new Set(s)
      if (n.has(k)) n.delete(k)
      else n.add(k)
      return n
    })
  }

  const grade = () => {
    const keyHits = mission.keyIssues.filter((k) => picked.has(k)).length
    const noise = [...picked].filter((k) => !mission.keyIssues.includes(k)).length
    const len = revision.trim().length
    const structure = /\n|•|-\s|^\d+\./m.test(revision) ? 8 : 0
    const lift = Math.max(
      0,
      Math.min(
        100,
        Math.round(keyHits * 22 - noise * 10 + Math.min(35, len / 4) + structure),
      ),
    )
    recordDraftLift(lift)
    const stars = lift >= 78 ? 3 : lift >= 55 ? 2 : lift >= 35 ? 1 : 0
    if (stars > 0) recordWorldStars('draft_rescue', stars)
    setGraded({
      lift,
      msg: `You caught ${keyHits}/${mission.keyIssues.length} priority issues in the rubric. Revision depth and structure added ${structure ? 'a' : 'no'} layout bonus.`,
    })
  }

  const nextMission = (i: number) => {
    setIdx(i)
    setPicked(new Set())
    setRevision('')
    setGraded(null)
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <Link to="/games" className="text-sm font-medium text-teal hover:underline">
        ← Games
      </Link>
      <h1 className="font-display text-3xl font-semibold text-ink">Draft Rescue</h1>
      <p className="text-sm text-ink-muted">
        Diagnose what is wrong, then issue concrete revision instructions (or rewrite). Score measures overlap with
        the rubric plus how actionable your plan is.
      </p>

      <div className="flex flex-wrap gap-2">
        {DRAFT_MISSIONS.map((m, i) => (
          <button
            key={m.id}
            type="button"
            onClick={() => nextMission(i)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              i === idx ? 'bg-teal text-white' : 'border border-line bg-card text-ink-muted hover:border-teal/40'
            }`}
          >
            {m.title}
          </button>
        ))}
      </div>

      <div className="whitespace-pre-wrap rounded-xl border border-line bg-card p-5 font-serif text-sm leading-relaxed text-ink shadow-sm">
        {mission.draft}
      </div>

      <fieldset className="rounded-xl border border-line bg-paper-dark/40 p-4">
        <legend className="text-sm font-semibold text-ink">What is wrong?</legend>
        <div className="mt-3 flex flex-col gap-2">
          {(Object.keys(DRAFT_ISSUE_LABELS) as DraftIssue[]).map((k) => (
            <label key={k} className="flex cursor-pointer gap-2 text-sm text-ink-muted">
              <input type="checkbox" checked={picked.has(k)} onChange={() => toggle(k)} />
              {DRAFT_ISSUE_LABELS[k]}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="text-sm font-semibold text-ink">
        Revision instructions or rewritten draft
        <textarea
          className="mt-2 w-full min-h-[140px] rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink outline-none ring-teal/30 focus:ring-2"
          value={revision}
          onChange={(e) => setRevision(e.target.value)}
          placeholder="Be specific: structure, tone, facts to verify, what to delete…"
        />
      </label>

      <button
        type="button"
        className="rounded-xl bg-teal px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-hover disabled:opacity-50"
        disabled={revision.trim().length < 40}
        onClick={grade}
      >
        Score rescue
      </button>

      {graded ? (
        <div className="rounded-xl border border-line bg-card p-5 text-sm shadow-sm">
          <p className="font-display text-2xl font-semibold text-ink">
            Improvement meter: <span className="text-teal">{graded.lift}</span>/100
          </p>
          <p className="mt-2 text-ink-muted">{graded.msg}</p>
        </div>
      ) : null}
    </div>
  )
}
