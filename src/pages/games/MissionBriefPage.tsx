import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MISSIONS,
  SLOT_LABELS,
  SLOT_ORDER,
  type BriefSlot,
  type Chip,
} from '../../data/games/missionBriefData'
import { recordWorldStars } from '../../lib/gameProgress'

type SlotMap = Record<BriefSlot, string | null>

const emptySlots = (): SlotMap => ({
  goal: null,
  audience: null,
  constraints: null,
  format: null,
  success: null,
})

type Board = { slots: SlotMap; pool: Chip[] }

function initBoard(missionIndex: number): Board {
  const m = MISSIONS[missionIndex]!
  return { slots: emptySlots(), pool: m.chips }
}

export function MissionBriefPage() {
  const [mIdx, setMIdx] = useState(0)
  const mission = MISSIONS[mIdx]!
  const [board, setBoard] = useState<Board>(() => initBoard(0))
  const [selectedChip, setSelectedChip] = useState<string | null>(null)
  const [ran, setRan] = useState(false)
  const [starsEarned, setStarsEarned] = useState<number | null>(null)

  const chipsById = useMemo(() => Object.fromEntries(mission.chips.map((c) => [c.id, c])), [mission.chips])

  const switchMission = (idx: number) => {
    setMIdx(idx)
    setBoard(initBoard(idx))
    setSelectedChip(null)
    setRan(false)
    setStarsEarned(null)
  }

  const placeChip = (slot: BriefSlot, chipId: string) => {
    const chip = chipsById[chipId]
    if (!chip) return
    setBoard((b) => {
      const prevId = b.slots[slot]
      const newSlots = { ...b.slots, [slot]: chipId }
      let newPool = b.pool.filter((c) => c.id !== chipId)
      if (prevId) {
        const prevChip = chipsById[prevId]
        if (prevChip) newPool = [...newPool, prevChip]
      }
      return { slots: newSlots, pool: newPool }
    })
    setSelectedChip(null)
  }

  const removeFromSlot = (slot: BriefSlot) => {
    setBoard((b) => {
      const id = b.slots[slot]
      if (!id) return b
      const chip = chipsById[id]
      return {
        slots: { ...b.slots, [slot]: null },
        pool: chip ? [...b.pool, chip] : b.pool,
      }
    })
  }

  const onDragStart = (e: React.DragEvent, chipId: string) => {
    e.dataTransfer.setData('chipId', chipId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const onDropSlot = (e: React.DragEvent, slot: BriefSlot) => {
    e.preventDefault()
    const chipId = e.dataTransfer.getData('chipId')
    if (chipId) placeChip(slot, chipId)
  }

  const runBrief = () => {
    let correct = 0
    for (const slot of SLOT_ORDER) {
      const id = board.slots[slot]
      if (!id) continue
      const c = chipsById[id]
      if (c && c.slot === slot) correct++
    }
    const stars = correct >= 5 ? 3 : correct >= 4 ? 2 : correct >= 3 ? 1 : 0
    setStarsEarned(stars)
    if (stars > 0) recordWorldStars('mission_brief', stars)
    setRan(true)
  }

  const tier = ran
    ? SLOT_ORDER.filter((s) => {
        const id = board.slots[s]
        const c = id ? chipsById[id] : null
        return c && c.slot === s
      }).length
    : 0

  const resetCurrent = () => {
    setBoard(initBoard(mIdx))
    setSelectedChip(null)
    setRan(false)
    setStarsEarned(null)
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Link to="/games" className="text-sm font-medium text-teal hover:underline">
        ← Games
      </Link>
      <h1 className="font-display text-3xl font-semibold text-ink">Mission Brief</h1>
      <p className="text-sm text-ink-muted">
        Drag chips into the brief—or tap a chip, then tap a slot. Leave distractors in the pool if they do not fit.
      </p>

      <div className="flex flex-wrap gap-2">
        {MISSIONS.map((m, i) => (
          <button
            key={m.id}
            type="button"
            onClick={() => switchMission(i)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              i === mIdx ? 'bg-teal text-white' : 'border border-line bg-card text-ink-muted hover:border-teal/40'
            }`}
          >
            Mission {i + 1}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-ember/25 bg-ember-soft px-4 py-3 text-sm text-ink">
        <strong>Vague request:</strong> “{mission.vagueRequest}”
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold text-ink">Brief slots</h2>
          <div className="mt-3 flex flex-col gap-2">
            {SLOT_ORDER.map((slot) => (
              <div key={slot}>
                <p className="text-xs font-medium text-ink-muted">{SLOT_LABELS[slot]}</p>
                <div
                  role="button"
                  tabIndex={0}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => onDropSlot(e, slot)}
                  onClick={() => {
                    if (selectedChip) placeChip(slot, selectedChip)
                  }}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && selectedChip) placeChip(slot, selectedChip)
                  }}
                  className={`mt-1 min-h-[48px] rounded-lg border px-3 py-2 text-sm transition ${
                    board.slots[slot] ? 'border-teal/40 bg-teal/5' : 'border-dashed border-line bg-paper'
                  }`}
                >
                  {board.slots[slot] ? (
                    <button
                      type="button"
                      className="text-left text-ink"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFromSlot(slot)
                      }}
                    >
                      {chipsById[board.slots[slot]!]?.label}
                      <span className="ml-2 text-xs text-ink-muted">(remove)</span>
                    </button>
                  ) : (
                    <span className="text-ink-muted">Drop or tap after selecting a chip</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-ink">Chip pool</h2>
          <p className="mt-1 text-xs text-ink-muted">Tap to select, then tap a slot.</p>
          <ul className="mt-3 flex flex-col gap-2">
            {board.pool.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  draggable
                  onDragStart={(e) => onDragStart(e, c.id)}
                  onClick={() => setSelectedChip((s) => (s === c.id ? null : c.id))}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                    selectedChip === c.id ? 'border-teal bg-teal/10' : 'border-line bg-card hover:border-teal/30'
                  }`}
                >
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        type="button"
        className="rounded-xl bg-teal px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-hover disabled:opacity-50"
        disabled={ran}
        onClick={runBrief}
      >
        Run simulated model on this brief
      </button>

      {ran ? (
        <div className="rounded-xl border border-line bg-card p-5 shadow-sm">
          <p className="text-sm font-semibold text-ink">
            Mission stars: {starsEarned ?? 0}/3 · Correct placements: {tier}/5
          </p>
          <p className="mt-3 text-sm text-ink-muted">{mission.outputs[tier >= 3 ? 2 : tier >= 1 ? 1 : 0]}</p>
          <button
            type="button"
            className="mt-4 text-sm font-semibold text-teal hover:underline"
            onClick={resetCurrent}
          >
            Reset mission
          </button>
        </div>
      ) : null}
    </div>
  )
}
