/**
 * Base URL for auth email links (`emailRedirectTo`) and similar.
 * - Local dev: uses `window.location.origin` → http://localhost:5173
 * - Vercel: same, unless `VITE_SITE_URL` is set (e.g. stable prod URL in Vercel env).
 */
export function getAuthEmailRedirectBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_SITE_URL?.trim()
  if (fromEnv) return fromEnv.replace(/\/+$/, '')
  if (typeof window !== 'undefined' && window.location?.origin) return window.location.origin
  return 'http://localhost:5173'
}

/** Supabase expects a trailing slash for `emailRedirectTo` in many templates. */
export function getAuthEmailRedirectTo(): string {
  const base = getAuthEmailRedirectBaseUrl()
  return base.endsWith('/') ? base : `${base}/`
}
