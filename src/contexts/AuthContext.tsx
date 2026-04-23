import type { Session, User } from '@supabase/supabase-js'
import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getSupabaseBrowser } from '../lib/supabase/client'
import { logLoginEvent } from '../lib/loginEvents'

type AuthContextValue = {
  supabase: ReturnType<typeof getSupabaseBrowser>
  session: Session | null
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => getSupabaseBrowser(), [])
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(() => Boolean(supabase))

  useEffect(() => {
    if (!supabase) return

    let cancelled = false

    void supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return
      startTransition(() => {
        setSession(data.session)
        setUser(data.session?.user ?? null)
        setLoading(false)
      })
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, next) => {
      startTransition(() => {
        setSession(next)
        setUser(next?.user ?? null)
      })
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [supabase])

  const signOut = useCallback(async () => {
    if (!supabase) return
    const uid = (await supabase.auth.getUser()).data.user?.id
    if (uid) await logLoginEvent(supabase, uid, 'sign_out', { source: 'user_initiated' })
    await supabase.auth.signOut()
  }, [supabase])

  const value = useMemo<AuthContextValue>(
    () => ({
      supabase,
      session,
      user,
      loading,
      signOut,
    }),
    [supabase, session, user, loading, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- colocated hook for AuthProvider
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
