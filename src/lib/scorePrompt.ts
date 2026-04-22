export type PromptTask = {
  id: string
  title: string
  scenario: string
  goalLine: string
}

export const PROMPT_TASKS: PromptTask[] = [
  {
    id: 'outline-history',
    title: 'History paper outline',
    scenario:
      'You are in 10th grade US History. You have read two primary sources on the Lincoln–Douglas debates. Your teacher wants a 2-page argument, not a summary.',
    goalLine:
      'Ask the model to help you outline your argument—without writing full paragraphs or inventing quotes.',
  },
  {
    id: 'science-lab',
    title: 'Lab report structure',
    scenario:
      'You finished a chemistry lab on titration. You have messy notes and raw numbers. The rubric asks for hypothesis, procedure summary, data table, and error analysis.',
    goalLine:
      'Use AI to turn your notes into a sensible section order and checklist—not to fabricate data.',
  },
]

export type ScoreResult = {
  score: number
  feedback: string[]
}

export function scorePrompt(prompt: string): ScoreResult {
  const p = prompt.trim()
  const lower = p.toLowerCase()
  const words = p.split(/\s+/).filter(Boolean)
  const feedback: string[] = []
  let score = 38

  if (words.length < 10) {
    score -= 18
    feedback.push('Add more detail: audience, format, and what you do not want (e.g. no full essay).')
  } else if (words.length < 22) {
    feedback.push('Good start—consider naming constraints explicitly (length, tone, grade level).')
    score += 6
  } else {
    score += 12
    feedback.push('Length suggests you are giving the model real context.')
  }

  const constraintLex = [
    'outline',
    'bullet',
    'rubric',
    'constraint',
    'no ',
    "don't",
    'do not',
    'sources',
    'primary',
    'paragraph',
    'sentence',
    'grade',
    'teacher',
    'page',
    'word',
    'tone',
    'audience',
    'checklist',
    'steps',
    'format',
  ]
  const hits = constraintLex.filter((k) => lower.includes(k))
  score += Math.min(28, hits.length * 5)
  if (hits.length) {
    feedback.push(
      `You signaled structure or limits (${hits.slice(0, 4).join(', ')}${hits.length > 4 ? '…' : ''}).`,
    )
  } else {
    feedback.push('Try naming output shape (outline, bullets) and hard limits (no full draft).')
  }

  if (/\b(help me think|brainstorm|structure|organize)\b/.test(lower)) {
    score += 10
    feedback.push('Partner-style verbs (“organize”, “brainstorm”) fit “thinking with AI”, not replacing it.')
  }

  const shortcut = [
    'write the entire',
    'full essay',
    'complete assignment',
    'do it for me',
    'ignore',
    'plagiar',
    'invent quotes',
    'make up',
  ]
  if (shortcut.some((s) => lower.includes(s))) {
    score -= 30
    feedback.push('Watch for “do my work” phrasing—schools flag it, and it trains lazy habits.')
  }

  if (/\b(i read|i have notes|based on my)\b/.test(lower)) {
    score += 8
    feedback.push('Mentioning your own reading or notes anchors the model to your thinking.')
  }

  score = Math.max(0, Math.min(100, Math.round(score)))

  if (score >= 85) {
    feedback.unshift('Strong responsible-use prompt: clear goal, boundaries, and your context.')
  } else if (score >= 65) {
    feedback.unshift('Solid prompt—tighten constraints and your role for a top score.')
  } else {
    feedback.unshift('Keep iterating: add role, deliverable shape, and what the model must not do.')
  }

  return { score, feedback }
}
