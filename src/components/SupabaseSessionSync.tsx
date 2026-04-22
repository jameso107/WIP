import { useEffect } from 'react'
import { getSupabaseBrowser } from '../lib/supabase/client'

/** Keeps auth subscriptions alive and reacts to sign-in/out (session refresh is enabled on the client). */
export function SupabaseSessionSync() {
  useEffect(() => {
    const supabase = getSupabaseBrowser()
    if (!supabase) return

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {})

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return null
}
