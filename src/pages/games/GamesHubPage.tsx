import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadGameProgress, rankFromStars, totalStars, type GameId } from '../../lib/gameProgress'

const WORLDS: {
  id: GameId
  path: string
  name: string
  subtitle: string
  world: string
}[] = [
  {
    id: 'use_it',
    path: '/games/use-it-or-lose-it',
    name: 'Use It or Lose It',
    subtitle: 'When should AI step in—or stay out?',
    world: 'World 1 · Decide',
  },
  {
    id: 'mission_brief',
    path: '/games/mission-brief',
    name: 'Mission Brief',
    subtitle: 'Turn vague asks into clear problem frames.',
    world: 'World 2 · Define',
  },
  {
    id: 'prompt_craft',
    path: '/games/prompt-craft',
    name: 'Prompt Craft Arena',
    subtitle: 'Prompt like a communicator, not a gambler.',
    world: 'World 3 · Direct',
  },
  {
    id: 'hallucination',
    path: '/games/hallucination-hunter',
    name: 'Hallucination Hunter',
    subtitle: 'Forensic passes on polished-but-risky text.',
    world: 'World 4 · Detect',
  },
  {
    id: 'draft_rescue',
    path: '/games/draft-rescue',
    name: 'Draft Rescue',
    subtitle: 'Critique and revise instead of accepting.',
    world: 'World 5 · Develop',
  },
  {
    id: 'the_line',
    path: '/games/the-line',
    name: 'The Line',
    subtitle: 'Green, yellow, or red—with reasons.',
    world: 'World 6 · Defend',
  },
]

function subscribe(cb: () => void) {
  window.addEventListener('ailab-games', cb)
  return () => window.removeEventListener('ailab-games', cb)
}

export function GamesHubPage() {
  const [gp, setGp] = useState(loadGameProgress)

  useEffect(() => {
    const run = () => setGp(loadGameProgress())
    run()
    return subscribe(run)
  }, [])

  const stars = totalStars(gp)
  const rank = rankFromStars(stars)
  const rankLabel =
    rank === 'leader' ? 'AI Leader' : rank === 'analyst' ? 'AI Analyst' : 'AI Apprentice'
  const nextRankAt = rank === 'apprentice' ? 18 : rank === 'analyst' ? 42 : null
  const progressToNext =
    nextRankAt != null ? Math.min(100, Math.round((stars / nextRankAt) * 100)) : 100

  return (
    <div className="flex flex-col gap-10">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-teal">Games · six worlds</p>
        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Practice arena</h1>
        <p className="mt-3 max-w-2xl text-ink-muted">
          Each game targets one habit: judgment, framing, prompting, verification, refinement, and ethics. Progress
          lives in this browser for now—teacher dashboards can sync later.
        </p>
      </header>

      <section className="rounded-2xl border border-line bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Progression</p>
            <p className="font-display text-2xl font-semibold text-ink">{rankLabel}</p>
            <p className="mt-1 text-sm text-ink-muted">
              {stars} mission stars collected · Trust with Ms. Rivera:{' '}
              <strong className="text-ink">{gp.trustScore}</strong>
              {gp.hunterBadges ? (
                <>
                  {' '}
                  · <strong className="text-ink">{gp.hunterBadges}</strong> detective badges
                </>
              ) : null}
            </p>
          </div>
          {nextRankAt != null ? (
            <div className="w-full max-w-xs">
              <p className="text-xs text-ink-muted">Stars to next rank ({nextRankAt} needed)</p>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-paper-dark">
                <div
                  className="h-full rounded-full bg-teal transition-all"
                  style={{ width: `${progressToNext}%` }}
                />
              </div>
            </div>
          ) : (
            <p className="text-sm font-medium text-teal">Top rank—keep sharpening skills in workshop mode.</p>
          )}
        </div>
      </section>

      <ul className="grid gap-4 sm:grid-cols-2">
        {WORLDS.map((w) => {
          const earned = gp.worldStars[w.id] ?? 0
          return (
            <li key={w.id}>
              <Link
                to={w.path}
                className="flex h-full flex-col rounded-xl border border-line bg-card p-5 shadow-sm transition hover:border-teal/40 hover:shadow-md"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-teal">{w.world}</p>
                <h2 className="mt-1 font-display text-xl font-semibold text-ink">{w.name}</h2>
                <p className="mt-2 flex-1 text-sm text-ink-muted">{w.subtitle}</p>
                <p className="mt-4 text-sm font-medium text-ink">
                  Stars: <span className="text-teal">{earned}</span>/15
                </p>
              </Link>
            </li>
          )
        })}
      </ul>

      <p className="text-center text-sm text-ink-muted">
        Quick rounds here; pair with class discussion prompts for workshop mode.
      </p>
    </div>
  )
}
