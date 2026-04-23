import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const navClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-teal/10 text-teal'
      : 'text-ink-muted hover:bg-paper-dark hover:text-ink',
  ].join(' ')

export function Layout() {
  const { user, loading, supabase, signOut } = useAuth()

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-10 border-b border-line bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <NavLink
            to="/"
            className="font-display text-lg font-semibold tracking-tight text-ink no-underline sm:text-xl"
          >
            AI Literacy Lab
          </NavLink>
          <div className="flex flex-wrap items-center justify-end gap-x-2 gap-y-2">
            <nav className="flex flex-wrap items-center gap-1 sm:gap-2" aria-label="Main">
              <NavLink to="/learn" className={navClass}>
                Learn
              </NavLink>
              <NavLink to="/games" className={navClass}>
                Games
              </NavLink>
              <NavLink to="/practice/prompt-builder" className={navClass}>
                Practice
              </NavLink>
              <NavLink to="/guide" className={navClass}>
                Guide
              </NavLink>
              <NavLink to="/dashboard" className={navClass}>
                Dashboard
              </NavLink>
              <NavLink to="/todos" className={navClass}>
                Todos
              </NavLink>
            </nav>
            {supabase ? (
              <div className="flex items-center gap-2 border-l border-line pl-2 sm:pl-3">
                {loading ? (
                  <span className="px-2 text-xs text-ink-muted">Session…</span>
                ) : user ? (
                  <>
                    <NavLink to="/auth" className={navClass} title={user.email ?? ''}>
                      <span className="max-w-[140px] truncate sm:max-w-[200px]">{user.email}</span>
                    </NavLink>
                    <button
                      type="button"
                      onClick={() => void signOut()}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted hover:bg-paper-dark hover:text-ink"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <NavLink to="/auth" className={navClass}>
                    Sign in
                  </NavLink>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
        <Outlet />
      </main>

      <footer className="border-t border-line bg-paper-dark/60 py-6 text-center text-sm text-ink-muted">
        <p className="mx-auto max-w-xl px-4">
          Working name: AI Literacy Lab — practice using AI without replacing your thinking. For high school
          and early college learners; teachers: classroom analytics are on the roadmap.
        </p>
      </footer>
    </div>
  )
}
