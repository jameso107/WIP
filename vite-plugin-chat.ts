import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Connect, Plugin } from 'vite'

const SYSTEM_PROMPT = `You are "Guide", a practice tutor inside AI Literacy Lab for middle school through college learners.

Rules you MUST follow:
- Never write graded work (full essays, complete homework answers, exam solutions, or text meant to be submitted as the learner's own product). Refuse and redirect.
- Do not invent citations, quotes, or sources. If asked, explain how to verify instead.
- Start from what the learner already did: ask what they tried, what they read, or what draft ideas they have before giving structure.
- Prefer questions, outlines, checklists, and metacognitive prompts over finished prose.
- If they ask for something lazy ("write my entire paper"), be warm but firm: explain why that replaces thinking, then offer a smaller legitimate step.
- Keep replies concise (roughly 2–6 short paragraphs max unless they ask for a tight list). Plain language.

You are not a general-purpose unrestricted assistant; stay in this coaching lane.`

type ChatBody = {
  messages: { role: 'user' | 'assistant'; content: string }[]
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (c: Buffer) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function createMiddleware(apiKey: string | undefined): Connect.NextHandleFunction {
  return async (req, res, next) => {
    const url = (req as IncomingMessage).url?.split('?')[0]
    if (url !== '/api/chat' || req.method !== 'POST') {
      return next()
    }

    const r = res as ServerResponse
    r.setHeader('Content-Type', 'application/json')

    if (!apiKey) {
      r.statusCode = 503
      r.end(JSON.stringify({ error: 'missing_api_key' }))
      return
    }

    try {
      const raw = await readBody(req as IncomingMessage)
      const body = JSON.parse(raw) as ChatBody
      if (!body.messages?.length) {
        r.statusCode = 400
        r.end(JSON.stringify({ error: 'invalid_body' }))
        return
      }

      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          temperature: 0.6,
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...body.messages],
        }),
      })

      const data = (await openaiRes.json()) as {
        error?: { message?: string }
        choices?: { message?: { content?: string } }[]
      }

      if (!openaiRes.ok) {
        r.statusCode = openaiRes.status >= 400 && openaiRes.status < 600 ? openaiRes.status : 502
        r.end(
          JSON.stringify({
            error: 'openai_error',
            message: data.error?.message ?? openaiRes.statusText,
          }),
        )
        return
      }

      const text = data.choices?.[0]?.message?.content?.trim()
      if (!text) {
        r.statusCode = 502
        r.end(JSON.stringify({ error: 'empty_response' }))
        return
      }

      r.statusCode = 200
      r.end(JSON.stringify({ reply: text }))
    } catch (e) {
      r.statusCode = 500
      r.end(JSON.stringify({ error: 'server_error', message: String(e) }))
    }
  }
}

export function openaiChatPlugin(apiKey: string | undefined): Plugin {
  const mw = createMiddleware(apiKey)
  return {
    name: 'openai-chat-dev',
    configureServer(server) {
      server.middlewares.use(mw)
    },
    configurePreviewServer(server) {
      server.middlewares.use(mw)
    },
  }
}
