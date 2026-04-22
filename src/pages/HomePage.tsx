import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div className="flex flex-col gap-12">
      <section className="rounded-2xl border border-line bg-card p-8 shadow-sm sm:p-10">
        <p className="mb-3 text-sm font-medium uppercase tracking-wider text-teal">Syzygy Learn · MVP</p>
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl md:text-[2.5rem]">
          Use AI as a thinking partner—<span className="text-teal">not a shortcut</span>.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink-muted">
          Schools worry about cheating; students already use tools like chatbots—often by copy-pasting answers. AI
          Literacy Lab is a guided, interactive space to practice{' '}
          <strong className="font-medium text-ink">when</strong> to use AI,{' '}
          <strong className="font-medium text-ink">how</strong> to prompt, and{' '}
          <strong className="font-medium text-ink">how</strong> to check outputs—without replacing your own
          reasoning.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/learn"
            className="inline-flex items-center justify-center rounded-xl bg-teal px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-hover"
          >
            Start learning
          </Link>
          <Link
            to="/practice/prompt-builder"
            className="inline-flex items-center justify-center rounded-xl border border-line bg-card px-5 py-3 text-sm font-semibold text-ink transition hover:border-teal/40 hover:bg-ember-soft"
          >
            Try Prompt Builder
          </Link>
          <Link
            to="/guide"
            className="inline-flex items-center justify-center rounded-xl border border-transparent px-5 py-3 text-sm font-semibold text-teal underline-offset-4 hover:underline"
          >
            Open guided chat
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <article className="rounded-xl border border-line bg-card p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-ink">Structured modules</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Short explanations, concrete examples, quick checks, and reflection—starting with AI basics and
            prompting fundamentals.
          </p>
        </article>
        <article className="rounded-xl border border-line bg-card p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-ink">Practice arena</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Prompt Builder scores clarity, constraints, and intent so you build habits schools can defend—not
            “prompt hacks” that hide thinking.
          </p>
        </article>
        <article className="rounded-xl border border-line bg-card p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-ink">Guide bot</h2>
          <p className="mt-2 text-sm text-ink-muted">
            A built-in assistant that pushes back on lazy requests and asks what you tried first—training the
            interaction pattern you want in real tools.
          </p>
        </article>
      </section>

      <section className="rounded-xl border border-ember/25 bg-ember-soft px-6 py-5 text-sm text-ink">
        <strong className="font-semibold">For schools:</strong> positioning is AI safety and measurable habits,
        not “more ChatGPT.” Per-student licensing and teacher dashboards are planned; this MVP ships learner flows
        first.
      </section>
    </div>
  )
}
