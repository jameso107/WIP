import { startTransition, useCallback, useEffect, useState } from 'react'
import { getSupabaseBrowser } from '../lib/supabase/client'

type TodoRow = { id: number | string; name: string }

export function TodosPage() {
  const supabase = getSupabaseBrowser()
  const [rows, setRows] = useState<TodoRow[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const client = getSupabaseBrowser()
    if (!client) {
      setError(null)
      setRows(null)
      return
    }
    setLoading(true)
    setError(null)
    const { data, error: qErr } = await client.from('todos').select('id, name')
    setLoading(false)
    if (qErr) {
      setRows(null)
      setError(qErr.message)
      return
    }
    setRows((data as TodoRow[]) ?? [])
  }, [])

  useEffect(() => {
    startTransition(() => {
      void load()
    })
  }, [load])

  if (!supabase) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="font-display text-3xl font-semibold text-ink">Todos (Supabase)</h1>
        <p className="text-ink-muted">
          Add Supabase credentials to <code className="rounded bg-paper-dark px-1.5 py-0.5 text-sm">.env.local</code>{' '}
          using Vite names (not Next.js):
        </p>
        <pre className="overflow-x-auto rounded-xl border border-line bg-paper-dark/80 p-4 text-left text-sm text-ink">
          {`VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_or_anon_key`}
        </pre>
        <p className="text-sm text-ink-muted">
          Same values as <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
          <code className="text-xs">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> from the Supabase dashboard—only the
          prefix changes to <code className="text-xs">VITE_</code> so the dev server exposes them to the app.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Todos (Supabase)</h1>
          <p className="mt-2 max-w-2xl text-sm text-ink-muted">
            Reads <code className="rounded bg-paper-dark px-1 py-0.5 text-xs">public.todos</code> with{' '}
            <code className="rounded bg-paper-dark px-1 py-0.5 text-xs">select(&apos;id, name&apos;)</code>, matching
            the Supabase quickstart. Ensure RLS allows read (or use the service role only on a server—never in the
            browser).
          </p>
        </div>
        <button
          type="button"
          className="rounded-xl border border-line bg-card px-4 py-2 text-sm font-semibold text-ink hover:border-teal/40"
          disabled={loading}
          onClick={() => void load()}
        >
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </header>

      {error ? (
        <p className="rounded-lg border border-ember/30 bg-ember-soft px-4 py-3 text-sm text-ink" role="alert">
          {error}
        </p>
      ) : null}

      {loading && rows === null ? (
        <p className="text-sm text-ink-muted">Loading…</p>
      ) : rows && rows.length === 0 ? (
        <p className="text-sm text-ink-muted">No rows yet. Insert data in the Supabase table editor.</p>
      ) : rows && rows.length > 0 ? (
        <ul className="rounded-xl border border-line bg-card p-4 shadow-sm">
          {rows.map((todo) => (
            <li key={String(todo.id)} className="border-b border-line py-2 last:border-0">
              {todo.name}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
