export type DraftIssue =
  | 'too_generic'
  | 'wrong_tone'
  | 'unclear_structure'
  | 'inaccurate'
  | 'not_voice'

export const DRAFT_ISSUE_LABELS: Record<DraftIssue, string> = {
  too_generic: 'Too generic / filler',
  wrong_tone: 'Wrong tone for audience',
  unclear_structure: 'Unclear structure',
  inaccurate: 'Inaccurate or overstated',
  not_voice: 'Not in my voice',
}

export type DraftMission = {
  id: string
  title: string
  /** Issues that match teacher rubric (subset player should identify) */
  keyIssues: DraftIssue[]
  draft: string
}

export const DRAFT_MISSIONS: DraftMission[] = [
  {
    id: 'email-prof',
    title: 'Rescue: Email to professor',
    keyIssues: ['too_generic', 'wrong_tone', 'unclear_structure'],
    draft:
      'Dear Sir,\n\nI am writing to respectfully request your kind assistance regarding the matter of my grade. It is very important and I hope you understand. Many students feel this way and it is a common issue. Please advise at your earliest convenience on next steps we can take moving forward.\n\nThanks!',
  },
  {
    id: 'study-guide',
    title: 'Rescue: Study guide',
    keyIssues: ['too_generic', 'inaccurate', 'unclear_structure'],
    draft:
      'Photosynthesis: plants do stuff with sun. Important for earth. You should know the cycles and equations (not shown here). Mitochondria is the powerhouse of photosynthesis. Review everything for the test.',
  },
]
