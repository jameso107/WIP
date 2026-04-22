import { useEffect, useRef, useState } from 'react'
import { getGuideReply } from '../lib/guideReplies'
import { recordGuideMessage } from '../lib/progress'

type Msg = { role: 'user' | 'guide'; text: string }

const welcome: Msg = {
  role: 'guide',
  text:
    'I am your guided practice assistant. I will not ghostwrite graded work for you. Tell me what class or task you are on, what you already tried, and what kind of help you want (outline, definitions, checking logic)—not “do the whole thing.”',
}

export function GuideChatPage() {
  const [messages, setMessages] = useState<Msg[]>([welcome])
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = () => {
    const t = input.trim()
    if (!t) return
    recordGuideMessage()
    setMessages((m) => [...m, { role: 'user', text: t }])
    setInput('')
    const reply = getGuideReply(t)
    setTimeout(() => {
      setMessages((m) => [...m, { role: 'guide', text: reply }])
    }, 320)
  }

  return (
    <div className="flex min-h-[60vh] flex-col gap-6">
      <header>
        <h1 className="font-display text-3xl font-semibold text-ink">Guided chat</h1>
        <p className="mt-2 max-w-2xl text-ink-muted">
          This bot is intentionally annoying about shortcuts: it models the posture teachers want—coach, not
          substitute. (No live model calls in this MVP; replies are scripted patterns.)
        </p>
      </header>

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
                  send()
                }
              }}
              placeholder="Describe your task and what you tried first…"
            />
            <button
              type="button"
              className="h-11 shrink-0 rounded-xl bg-ink px-6 text-sm font-semibold text-paper transition hover:bg-ink/85 disabled:opacity-50"
              disabled={!input.trim()}
              onClick={send}
            >
              Send
            </button>
          </div>
          <p className="mt-2 text-xs text-ink-muted">Enter to send · Shift+Enter for newline</p>
        </div>
      </div>
    </div>
  )
}
