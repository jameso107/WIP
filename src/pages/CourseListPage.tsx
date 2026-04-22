import { Link } from 'react-router-dom'
import { MODULES } from '../data/modules'
import { isModuleComplete } from '../lib/progress'

export function CourseListPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-display text-3xl font-semibold text-ink">Course path</h1>
        <p className="mt-2 max-w-2xl text-ink-muted">
          Two starter modules mirror the MVP scope: foundations first, then prompting. Complete the check at the
          end of each module to track progress on your dashboard.
        </p>
      </header>

      <ul className="flex flex-col gap-4">
        {MODULES.map((m) => {
          const done = isModuleComplete(m.id)
          return (
            <li key={m.id}>
              <Link
                to={`/learn/${m.id}`}
                className="group flex flex-col rounded-xl border border-line bg-card p-6 shadow-sm transition hover:border-teal/35 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-xl font-semibold text-ink group-hover:text-teal">
                      {m.title}
                    </h2>
                    {done ? (
                      <span className="rounded-full bg-teal/15 px-2.5 py-0.5 text-xs font-semibold text-teal">
                        Completed
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-ink-muted">{m.subtitle}</p>
                </div>
                <div className="mt-4 flex items-center gap-3 sm:mt-0">
                  <span className="text-sm text-ink-muted">~{m.durationMin} min</span>
                  <span
                    className="text-sm font-semibold text-teal"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
