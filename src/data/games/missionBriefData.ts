export type BriefSlot = 'goal' | 'audience' | 'constraints' | 'format' | 'success'

export type Chip = {
  id: string
  label: string
  slot: BriefSlot | 'distractor'
}

export type Mission = {
  id: string
  vagueRequest: string
  chips: Chip[]
  /** Simulated model output by how many correct chips placed in correct slots (0–5) */
  outputs: [string, string, string]
}

export const MISSIONS: Mission[] = [
  {
    id: 'history-thing',
    vagueRequest: 'Help me with my history thing.',
    chips: [
      { id: 'g1', label: 'Goal: argue how one reform changed daily life (not a summary)', slot: 'goal' },
      { id: 'a1', label: 'Audience: 10th-grade teacher who wants a thesis + evidence', slot: 'audience' },
      { id: 'c1', label: 'Constraints: 800 words, two primary sources you already read', slot: 'constraints' },
      { id: 'f1', label: 'Format: outline with 3 claims + counterargument slot', slot: 'format' },
      { id: 's1', label: 'Success: teacher can see your line of reasoning in bullets', slot: 'success' },
      { id: 'd1', label: 'Add lots of jokes and memes', slot: 'distractor' },
      { id: 'd2', label: 'Rewrite in Shakespeare English', slot: 'distractor' },
      { id: 'd3', label: 'Include unrelated Python code', slot: 'distractor' },
    ],
    outputs: [
      'Model: “History is important. Many things happened. Here is a generic list of facts…” (Too vague—no brief.)',
      'Model: “Here is a loose outline with some dates.” (Better—goal and format partially clear, still thin on constraints.)',
      'Model: “Outline: thesis on daily life → three claims tied to Source A/B → counterargument + rebuttal slot; 800 words; bullets only.” (Crisp—matches your brief.)',
    ],
  },
  {
    id: 'science-fair',
    vagueRequest: 'Make my science fair thing good.',
    chips: [
      { id: 'g2', label: 'Goal: explain hypothesis + one graph + why results support or fail it', slot: 'goal' },
      { id: 'a2', label: 'Audience: judges who skim boards in 3 minutes', slot: 'audience' },
      { id: 'c2', label: 'Constraints: middle school rules, no fabricated trials', slot: 'constraints' },
      { id: 'f2', label: 'Format: poster sections + 60-second talk track', slot: 'format' },
      { id: 's2', label: 'Success: a visitor can repeat your claim in one sentence', slot: 'success' },
      { id: 'd4', label: 'Generate fake experimental numbers', slot: 'distractor' },
      { id: 'd5', label: 'Write the entire board text in tiny font', slot: 'distractor' },
    ],
    outputs: [
      'Model: “Science is cool! Here are random facts about plants.”',
      'Model: “Poster draft with hypothesis and procedure, but weak link to results.”',
      'Model: “Hypothesis → method → graph callout → honest conclusion + judge-friendly talk track.”',
    ],
  },
]

export const SLOT_LABELS: Record<BriefSlot, string> = {
  goal: 'Goal',
  audience: 'Audience',
  constraints: 'Constraints',
  format: 'Desired format',
  success: 'Success criteria',
}

export const SLOT_ORDER: BriefSlot[] = ['goal', 'audience', 'constraints', 'format', 'success']
