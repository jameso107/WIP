import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let browserClient: SupabaseClient | undefined

/**
 * Browser Supabase client (Vite SPA). Uses `@supabase/ssr` so auth uses the
 * same cookie/storage behavior Supabase documents for modern clients, with
 * automatic token refresh in the browser.
 *
 * Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local`
 * (same values as Next’s `NEXT_PUBLIC_*` vars, renamed for Vite).
 */
export function getSupabaseBrowser(): SupabaseClient | null {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  if (!url?.trim() || !key?.trim()) return null

  if (!browserClient) {
    browserClient = createBrowserClient(url.trim(), key.trim())
  }
  return browserClient
}
