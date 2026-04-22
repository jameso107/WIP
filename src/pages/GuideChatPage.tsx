import { useEffect, useRef, useState } from 'react'
import { getGuideReply } from '../lib/guideReplies'
import { recordGuideMessage } from '../lib/progress'

type Msg = { role: 'user' | 'guide'; text: string }

const welcome: Msg = {
  role: 'guide',
  text:
    'I am your guided practice assistant. I will not ghostwrite graded work for you. Tell me what class or task you are on, what you already tried, and what kind of help you want (outline, definitions, checking logic)—not “do the whole thing.”',
}

function toApiMessages(msgs: Msg[]): { role: 'user' | 'assistant'; content: string }[] {
  return msgs.map((m) => ({
    role: m.role === 'user' ? 'user' : 'assistant',
    content: m.text,
  }))
}

export function GuideChatPage() {
  const [messages, setMessages] = useState<Msg[]>([welcome])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiNote, setApiNote] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async () => {
    const t = input.trim()
    if (!t || loading) return
    recordGuideMessage()
    const thread: Msg[] = [...messages, { role: 'user', text: t }]
    setMessages(thread)
    setInput('')
    setLoading(true)
    setApiNote(null)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: toApiMessages(thread) }),
      })
      const data = (await res.json()) as { reply?: string; error?: string; message?: string }

      if (!res.ok) {
        if (data.error === 'missing_api_key') {
          setApiNote('No OpenAI key in .env.local — using built-in scripted replies for now.')
          setMessages((m) => [...m, { role: 'guide', text: getGuideReply(t) }])
          return
        }
        throw new Error(data.message ?? data.error ?? res.statusText)
      }

      const reply = data.reply?.trim()
      if (!reply) throw new Error('empty_response')

      setMessages((m) => [...m, { role: 'guide', text: reply }])
    } catch {
      setApiNote('Could not reach the model — showing a scripted fallback for this message.')
      setMessages((m) => [...m, { role: 'guide', text: getGuideReply(t) }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[60vh] flex-col gap-6">
      <header>
        <h1 className="font-display text-3xl font-semibold text-ink">Guided chat</h1>
        <p className="mt-2 max-w-2xl text-ink-muted">
          The assistant uses OpenAI when <code className="rounded bg-paper-dark px-1 py-0.5 text-xs">OPENAI_API_KEY</code> is set in{' '}
          <code className="rounded bg-paper-dark px-1 py-0.5 text-xs">.env.local</code> (dev server only). Otherwise it falls back to
          scripted coaching patterns.
        </p>
      </header>

      {apiNote ? (
        <p className="rounded-lg border border-ember/30 bg-ember-soft px-4 py-3 text-sm text-ink" role="status">
          {apiNote}
        </p>
      ) : null}

      <div className="flex flex-1 flex-col rounded-xl border border-line bg-card shadow-sm">
        <div className="max-h-[min(520px,55vh)] flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-teal text-white'
                    : 'border border-line bg-paper text-ink'
                }`}
              >
                {msg.role === 'guide' ? (
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-teal">
                    Guide
                  </span>
                ) : null}
                {msg.text}
              </div>
            </div>
          ))}
          {loading ? (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-line bg-paper px-4 py-3 text-sm text-ink-muted">
                Thinking…
              </div>
            </div>
          ) : null}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-line p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <textarea
              className="min-h-[52px] flex-1 resize-none rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink outline-none ring-teal/30 focus:ring-2 sm:min-h-[44px]"
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  void send()
                }
              }}
              placeholder="Describe your task and what you tried first…"
              disabled={loading}
            />
            <button
              type="button"
              className="h-11 shrink-0 rounded-xl bg-ink px-6 text-sm font-semibold text-paper transition hover:bg-ink/85 disabled:opacity-50"
              disabled={!input.trim() || loading}
              onClick={() => void send()}
            >
              {loading ? 'Sending…' : 'Send'}
            </button>
          </div>
          <p className="mt-2 text-xs text-ink-muted">Enter to send · Shift+Enter for newline</p>
        </div>
      </div>
    </div>
  )
}
