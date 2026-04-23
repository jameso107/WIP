# AI Literacy Lab (MVP)

Web app for practicing **responsible AI use** in school-style tasks: structured modules, a Prompt Builder practice game, a rule-based guided chat, and a simple local dashboard.

```bash
npm install
npm run dev
```

Build: `npm run build` · Preview: `npm run preview`

Guided chat (dev / `vite preview`): copy `.env.example` to `.env.local` and set `OPENAI_API_KEY`. The key stays on the server middleware, not in client bundles.

Supabase: set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local` (same values as Next’s `NEXT_PUBLIC_*` keys, with the `VITE_` prefix). The **Todos** page loads `public.todos` as a smoke test.

### Supabase Auth with Vercel + local dev

This repo’s Vercel project is named **wip** (stable URL is usually `https://wip.vercel.app`; confirm under Vercel → Project → **Domains**).

In [Supabase → Authentication → URL configuration](https://supabase.com/dashboard/project/nluvrrptxvheeldehjkc/auth/url-configuration):

1. **Site URL** — set to your **production** app URL, e.g. `https://wip.vercel.app` (default redirect when a template uses `{{ .SiteURL }}` and you have not customized it).
2. **Redirect URLs** — add every origin users may return to after email links or OAuth. Recommended entries:
   - `http://localhost:5173/**` — Vite dev
   - `https://wip.vercel.app/**` — production
   - `https://*-.vercel.app/**` — Vercel preview deployments (Supabase [wildcard docs](https://supabase.com/docs/guides/auth/redirect-urls))
   - `https://*-james-oosterhouses-projects.vercel.app/**` — matches preview hosts like `https://wip-….vercel.app` on this team

Sign-up uses `emailRedirectTo` from `getAuthEmailRedirectTo()` (`src/lib/siteUrl.ts`): current browser origin locally, or `VITE_SITE_URL` if you set it (useful if you ever need emails to always point at production).

On **Vercel → Project → Environment Variables**, production can optionally set `VITE_SITE_URL=https://wip.vercel.app` so confirmation links always target prod even if triggered from a misconfigured client (optional; usually `window.location.origin` is enough).

Stack: Vite, React, TypeScript, React Router, Tailwind CSS v4, Supabase (`@supabase/ssr` browser client).
