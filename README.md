# AI Literacy Lab (MVP)

Web app for practicing **responsible AI use** in school-style tasks: structured modules, a Prompt Builder practice game, a rule-based guided chat, and a simple local dashboard.

```bash
npm install
npm run dev
```

Build: `npm run build` · Preview: `npm run preview`

Guided chat (dev / `vite preview`): copy `.env.example` to `.env.local` and set `OPENAI_API_KEY`. The key stays on the server middleware, not in client bundles.

Supabase: set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local` (same values as Next’s `NEXT_PUBLIC_*` keys, with the `VITE_` prefix). The **Todos** page loads `public.todos` as a smoke test.

Stack: Vite, React, TypeScript, React Router, Tailwind CSS v4, Supabase (`@supabase/ssr` browser client).
