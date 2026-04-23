import type { SupabaseClient } from '@supabase/supabase-js'

export type LoginEventType = 'sign_in' | 'sign_out' | 'sign_up'

export async function logLoginEvent(
  supabase: SupabaseClient,
  userId: string,
  eventType: LoginEventType,
  clientMeta: Record<string, unknown> = {},
) {
  const meta = {
    ...clientMeta,
    pathname: typeof window !== 'undefined' ? window.location.pathname : undefined,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
  }
  const { error } = await supabase.from('login_events').insert({
    user_id: userId,
    event_type: eventType,
    client_meta: meta,
  })
  if (error) console.warn('login_events insert failed', error.message)
}
