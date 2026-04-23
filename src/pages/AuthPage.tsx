import { startTransition, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { logLoginEvent } from '../lib/loginEvents'
import { getAuthEmailRedirectTo } from '../lib/siteUrl'

type Row = { event_type: string; created_at: string }

export function AuthPage() {
  const { supabase, user, loading, signOut } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [events, setEvents] = useState<Row[] | null>(null)

  useEffect(() => {
    if (!supabase || !user) {
      startTransition(() => setEvents(null))
      return
    }
    let cancelled = false
    void supabase
      .from('login_events')
      .select('event_type, created_at')
      .order('created_at', { ascending: false })
      .limit(25)
      .then(({ data, error }) => {
        if (cancelled) return
        startTransition(() => {
          if (error) setEvents([])
          else setEvents((data as Row[]) ?? [])
        })
      })
    return () => {
      cancelled = true
    }
  }, [supabase, user])

  const submit = async () => {
    if (!supabase) return
    setBusy(true)
    setMsg(null)
    const e = email.trim()
    const p = password
    if (!e || p.length < 6) {
      setMsg('Use a valid email and a password of at least 6 characters.')
      setBusy(false)
      return
    }

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email: e,
        password: p,
        options: {
          data: { display_name: displayName.trim() || e.split('@')[0] },
          emailRedirectTo: getAuthEmailRedirectTo(),
        },
      })
      if (error) {
        setMsg(error.message)
        setBusy(false)
        return
      }
      if (data.user) await logLoginEvent(supabase, data.user.id, 'sign_up', { has_session: !!data.session })
      setMsg(
        data.session
          ? 'Account ready—you are signed in.'
          : 'Check your email to confirm your address, then sign in.',
      )
      setBusy(false)
      if (data.session) navigate('/')
      return
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email: e, password: p })
    if (error) {
      setMsg(error.message)
      setBusy(false)
      return
    }
    if (data.user) await logLoginEvent(supabase, data.user.id, 'sign_in', {})
    setBusy(false)
    navigate('/')
  }

  if (!supabase) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-line bg-card p-8 text-center shadow-sm">
        <h1 className="font-display text-xl font-semibold text-ink">Supabase not configured</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Add <code className="text-xs">VITE_SUPABASE_URL</code> and{' '}
          <code className="text-xs">VITE_SUPABASE_PUBLISHABLE_KEY</code> to <code className="text-xs">.env.local</code>.
        </p>
        <Link to="/" className="mt-4 inline-block text-sm font-semibold text-teal hover:underline">
          Home
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="py-16 text-center text-sm text-ink-muted" aria-busy="true">
        Loading session…
      </div>
    )
  }

  if (user) {
    return (
      <div className="mx-auto flex max-w-lg flex-col gap-6">
        <h1 className="font-display text-3xl font-semibold text-ink">Account</h1>
        <p className="text-sm text-ink-muted">
          Signed in as <strong className="text-ink">{user.email}</strong>
        </p>
        <section className="rounded-xl border border-line bg-card p-5 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-ink">Recent login activity</h2>
          <p className="mt-1 text-xs text-ink-muted">Stored in Supabase <code className="rounded bg-paper-dark px-1">login_events</code>.</p>
          {!events ? (
            <p className="mt-3 text-sm text-ink-muted">Loading…</p>
          ) : events.length === 0 ? (
            <p className="mt-3 text-sm text-ink-muted">No events yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line text-sm">
              {events.map((r, i) => (
                <li key={`${r.created_at}-${i}`} className="flex justify-between gap-4 py-2">
                  <span className="font-medium capitalize text-ink">
                    {r.event_type.replaceAll('_', ' ')}
                  </span>
                  <span className="shrink-0 text-ink-muted">
                    {new Date(r.created_at).toLocaleString(undefined, {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-paper hover:bg-ink/85"
            onClick={() => void signOut().then(() => navigate('/'))}
          >
            Sign out
          </button>
          <Link
            to="/"
            className="inline-flex items-center rounded-xl border border-line bg-card px-4 py-2.5 text-sm font-semibold text-ink hover:border-teal/40"
          >
            Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <h1 className="font-display text-3xl font-semibold text-ink">Sign in</h1>
      <p className="text-sm text-ink-muted">
        Email and password auth. Each sign-in, sign-up, and sign-out is recorded in your project&apos;s{' '}
        <code className="rounded bg-paper-dark px-1 text-xs">login_events</code> table (RLS: your rows only).
      </p>

      <div className="flex rounded-lg border border-line bg-paper-dark/50 p-1">
        <button
          type="button"
          className={`flex-1 rounded-md py-2 text-sm font-semibold ${mode === 'signin' ? 'bg-card text-ink shadow-sm' : 'text-ink-muted'}`}
          onClick={() => {
            setMode('signin')
            setMsg(null)
          }}
        >
          Sign in
        </button>
        <button
          type="button"
          className={`flex-1 rounded-md py-2 text-sm font-semibold ${mode === 'signup' ? 'bg-card text-ink shadow-sm' : 'text-ink-muted'}`}
          onClick={() => {
            setMode('signup')
            setMsg(null)
          }}
        >
          Create account
        </button>
      </div>

      <form
        className="flex flex-col gap-4 rounded-xl border border-line bg-card p-6 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault()
          void submit()
        }}
      >
        {mode === 'signup' ? (
          <label className="text-sm font-medium text-ink">
            Display name (optional)
            <input
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none ring-teal/30 focus:ring-2"
              value={displayName}
              onChange={(ev) => setDisplayName(ev.target.value)}
              autoComplete="name"
            />
          </label>
        ) : null}
        <label className="text-sm font-medium text-ink">
          Email
          <input
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none ring-teal/30 focus:ring-2"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            autoComplete="email"
          />
        </label>
        <label className="text-sm font-medium text-ink">
          Password
          <input
            type="password"
            required
            minLength={6}
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none ring-teal/30 focus:ring-2"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          />
        </label>
        {msg ? <p className="text-sm text-ember">{msg}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="rounded-xl bg-teal px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-hover disabled:opacity-50"
        >
          {busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}
        </button>
      </form>

      <Link to="/" className="text-center text-sm font-semibold text-teal hover:underline">
        Back to home
      </Link>
    </div>
  )
}
