export type LessonSection = {
  id: string
  heading: string
  paragraphs: string[]
}

export type InteractiveQuestion = {
  prompt: string
  options: { id: string; label: string; isCorrect: boolean }[]
  rationale: string
}

export type Module = {
  id: string
  title: string
  subtitle: string
  durationMin: number
  sections: LessonSection[]
  example: { title: string; bad: string; good: string }
  interactive: InteractiveQuestion
  reflection: string
}

export const MODULES: Module[] = [
  {
    id: 'ai-basics',
    title: 'AI basics: tool, not substitute',
    subtitle: 'What AI is useful for—and what it is not',
    durationMin: 18,
    sections: [
      {
        id: 's1',
        heading: 'What large language models actually do',
        paragraphs: [
          'Models predict likely next words based on patterns in data. They can summarize, rephrase, brainstorm, and tutor at a high level—but they can be confidently wrong, biased, or outdated.',
          'Responsible use starts with that mental model: AI is a flexible assistant, not an authority and not a replacement for reading, practice, or judgment.',
        ],
      },
      {
        id: 's2',
        heading: 'When AI helps thinking',
        paragraphs: [
          'Good fits: clarifying definitions after you tried first, outlining after you gathered notes, stress-testing an argument, generating practice questions, improving wording on text you wrote.',
          'Poor fits: skipping assigned reading, inventing citations, pasting model output as “your voice” without understanding it.',
        ],
      },
    ],
    example: {
      title: 'Same assignment, different habit',
      bad: '“Write my entire two-page history paper from this one prompt.”',
      good: '“I read two primary sources. Here are my three bullet takeaways. Help me turn them into a thesis and section outline—no full paragraphs.”',
    },
    interactive: {
      prompt: 'Which choice best matches “AI as a thinking partner”?',
      options: [
        {
          id: 'a',
          label: 'Paste the essay question and submit the model’s answer as your draft.',
          isCorrect: false,
        },
        {
          id: 'b',
          label:
            'Read sources, jot notes, then ask the model to help outline and stress-test your thesis before you write.',
          isCorrect: true,
        },
        {
          id: 'c',
          label: 'Skip the reading and ask the model to invent plausible quotes.',
          isCorrect: false,
        },
      ],
      rationale:
        'Partnership means you bring understanding and artifacts; the model helps structure and sharpen—not replace your engagement with sources.',
    },
    reflection:
      'Name one subject where AI could help you plan or revise—and one where using it would short-circuit the skill you need to build.',
  },
  {
    id: 'prompting-fundamentals',
    title: 'Prompting fundamentals',
    subtitle: 'Clarity, constraints, and intent',
    durationMin: 22,
    sections: [
      {
        id: 's1',
        heading: 'The three Cs',
        paragraphs: [
          'Clear prompts name context (who you are, what you already did), the deliverable shape (outline, bullets, checklist), and constraints (length, tone, banned behaviors like “no invented citations”).',
          'Vague prompts (“essay”, “fix this”) invite vague—or misleading—answers.',
        ],
      },
      {
        id: 's2',
        heading: 'Intent beats cleverness',
        paragraphs: [
          'You do not need magic words. You need the model to understand your goal, your limits, and what “done” looks like.',
          'Say what you tried, where you are stuck, and what you still want to decide yourself.',
        ],
      },
    ],
    example: {
      title: 'From fuzzy to teachable',
      bad: '“Essay.”',
      good:
        '“10th grade US History, 2-page argument. I read two primary sources on Lincoln–Douglas. I want a 5-bullet outline with space for counterarguments—no full sentences, no sources I did not list.”',
    },
    interactive: {
      prompt: 'Which prompt gives the model the most useful guardrails?',
      options: [
        { id: 'a', label: '“Write something good about Lincoln.”', isCorrect: false },
        {
          id: 'b',
          label:
            '“I need a rubric-aligned outline: thesis + 3 supporting claims + one counterargument slot. Bullets only, max 120 words.”',
          isCorrect: true,
        },
        { id: 'c', label: '“Be creative.”', isCorrect: false },
      ],
      rationale:
        'Constraints and format reduce hallucination risk and keep the model in a coaching lane instead of ghostwriting.',
    },
    reflection:
      'Rewrite a prompt you have used (or imagined) into a “three Cs” version in your notes. What single constraint mattered most?',
  },
]

export function getModule(id: string): Module | undefined {
  return MODULES.find((m) => m.id === id)
}
