export type UsageChoice = 'use_ai' | 'partial_ai' | 'yourself' | 'ask_human'

export type Scenario = {
  id: string
  prompt: string
  /** Best single choice for teaching moment */
  best: UsageChoice
  /** Other defensible choices (smaller trust bonus) */
  ok?: UsageChoice[]
  feedback: Record<
    UsageChoice,
    { headline: string; detail: string; trustDelta: number }
  >
}

export const USAGE_LABELS: Record<UsageChoice, string> = {
  use_ai: 'Use AI fully for this',
  partial_ai: 'Use AI partially (supporting role)',
  yourself: 'Do it yourself',
  ask_human: 'Ask a qualified human instead',
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'thesis-brainstorm',
    prompt: 'Brainstorm five thesis ideas for an essay after you skimmed the prompt but before deep reading.',
    best: 'partial_ai',
    ok: ['use_ai'],
    feedback: {
      use_ai: {
        headline: 'Acceptable with a guardrail',
        detail: 'Early ideation can be fine, but add your own sources or angle so ideas stay yours.',
        trustDelta: 2,
      },
      partial_ai: {
        headline: 'Strong judgment',
        detail: 'You kept ownership: AI supports ideation, not the whole argument chain.',
        trustDelta: 6,
      },
      yourself: {
        headline: 'Safe but slow',
        detail: 'Totally fine—just know AI can speed structured brainstorming if you stay in control.',
        trustDelta: 3,
      },
      ask_human: {
        headline: 'Overkill here',
        detail: 'A peer or teacher can help too, but this task is usually fine with AI if framed responsibly.',
        trustDelta: -2,
      },
    },
  },
  {
    id: 'take-home-quiz',
    prompt: 'Solve this take-home quiz exactly as assigned, line by line, tonight.',
    best: 'yourself',
    feedback: {
      use_ai: {
        headline: 'Academic integrity risk',
        detail: 'Outsourcing assessed work is usually misconduct—and you skip the learning being measured.',
        trustDelta: -14,
      },
      partial_ai: {
        headline: 'Still risky',
        detail: 'Even “partial” help on graded items can cross policies. Clarify with your instructor first.',
        trustDelta: -8,
      },
      yourself: {
        headline: 'Right call',
        detail: 'Assessed work should reflect your understanding. Use office hours if you are stuck.',
        trustDelta: 8,
      },
      ask_human: {
        headline: 'Good when stuck on a concept',
        detail: 'Asking a teacher for clarification is appropriate; asking them to do the quiz is not.',
        trustDelta: 4,
      },
    },
  },
  {
    id: 'grammar-pass',
    prompt: 'Rewrite my own paragraph for grammar and clarity after I wrote the ideas myself.',
    best: 'partial_ai',
    ok: ['yourself'],
    feedback: {
      use_ai: {
        headline: 'Watch scope creep',
        detail: 'If the model rewrites voice or adds claims, you may lose authenticity. Keep edits tight.',
        trustDelta: 0,
      },
      partial_ai: {
        headline: 'Good use',
        detail: 'Editing support on your draft is a classic “partner” pattern—verify it still sounds like you.',
        trustDelta: 7,
      },
      yourself: {
        headline: 'Solid',
        detail: 'Self-editing is great. AI can optionally speed polish if your school allows editing tools.',
        trustDelta: 5,
      },
      ask_human: {
        headline: 'Fine for high-stakes writing',
        detail: 'A writing center is ideal when grades or publication depend on voice and accuracy.',
        trustDelta: 4,
      },
    },
  },
  {
    id: 'lab-results',
    prompt: 'Interpret my private medical lab results from a photo I upload.',
    best: 'ask_human',
    feedback: {
      use_ai: {
        headline: 'Privacy and safety concern',
        detail: 'Uploading health data to consumer tools is risky; models can hallucinate medical guidance.',
        trustDelta: -16,
      },
      partial_ai: {
        headline: 'Still risky',
        detail: 'Even “explain jargon” can go wrong without a clinician and may expose sensitive data.',
        trustDelta: -10,
      },
      yourself: {
        headline: 'Not enough',
        detail: 'Self-diagnosis from labs without training is dangerous—this is not a DIY moment.',
        trustDelta: -6,
      },
      ask_human: {
        headline: 'Correct boundary',
        detail: 'A licensed clinician can interpret results in context and protect your privacy.',
        trustDelta: 10,
      },
    },
  },
  {
    id: 'personal-reflection',
    prompt: 'Write a reflection about what I personally learned in the unit.',
    best: 'yourself',
    ok: ['partial_ai'],
    feedback: {
      use_ai: {
        headline: 'Bad fit',
        detail: 'Reflections are about authentic experience—AI text here is often academic dishonesty.',
        trustDelta: -12,
      },
      partial_ai: {
        headline: 'Only if you stay author',
        detail: 'You might use AI to organize bullets you wrote, not to invent feelings you did not have.',
        trustDelta: 2,
      },
      yourself: {
        headline: 'Best match',
        detail: 'Your voice and specifics are the point. Short beats polished if it is honest.',
        trustDelta: 9,
      },
      ask_human: {
        headline: 'Optional',
        detail: 'A teacher can help you find structure, but the content must still be yours.',
        trustDelta: 5,
      },
    },
  },
  {
    id: 'lit-review-outline',
    prompt: 'Turn ten papers I already read into a literature review outline with themes.',
    best: 'partial_ai',
    ok: ['use_ai'],
    feedback: {
      use_ai: {
        headline: 'Possible if you verify',
        detail: 'Outlines are safer than prose, but check that themes match your notes and citations.',
        trustDelta: 3,
      },
      partial_ai: {
        headline: 'Strong partner use',
        detail: 'You brought the reading; AI helps compress and structure—keep verifying claims.',
        trustDelta: 7,
      },
      yourself: {
        headline: 'Great discipline',
        detail: 'Doing it manually builds synthesis skills; AI is optional acceleration later.',
        trustDelta: 6,
      },
      ask_human: {
        headline: 'Great for methods',
        detail: 'A librarian or advisor can shape search strategy—different from outsourcing synthesis.',
        trustDelta: 4,
      },
    },
  },
  {
    id: 'classmate-essay',
    prompt: 'Paste my classmate’s submitted essay into AI to “edit” it before they turn it in.',
    best: 'yourself',
    feedback: {
      use_ai: {
        headline: 'Serious integrity violation',
        detail: 'Using someone else’s work without consent—and likely helping academic misconduct.',
        trustDelta: -18,
      },
      partial_ai: {
        headline: 'Still wrong',
        detail: 'This is not your intellectual property to run through a model.',
        trustDelta: -14,
      },
      yourself: {
        headline: 'Ethical baseline',
        detail: 'Refuse. Offer peer feedback on their outline in your own words if they ask.',
        trustDelta: 10,
      },
      ask_human: {
        headline: 'If you are unsure',
        detail: 'Ask your instructor how collaboration is defined—do not process their draft in AI.',
        trustDelta: 8,
      },
    },
  },
  {
    id: 'email-tone',
    prompt: 'Soften the tone of an email I drafted to a professor about a grade dispute.',
    best: 'partial_ai',
    ok: ['yourself', 'ask_human'],
    feedback: {
      use_ai: {
        headline: 'Check facts and voice',
        detail: 'Full rewrite can sound generic. Keep your facts and requests accurate and personal.',
        trustDelta: 1,
      },
      partial_ai: {
        headline: 'Good use',
        detail: 'Tone polish on your draft is a bounded task—read it aloud before sending.',
        trustDelta: 6,
      },
      yourself: {
        headline: 'Respectful path',
        detail: 'Drafting yourself builds communication skills; sleep on it before sending.',
        trustDelta: 5,
      },
      ask_human: {
        headline: 'Wise for high stakes',
        detail: 'A mentor or writing center can help you navigate sensitive academic conversations.',
        trustDelta: 6,
      },
    },
  },
]
