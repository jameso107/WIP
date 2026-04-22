export type Spectrum = 'green' | 'yellow' | 'red'

export type LineReason =
  | 'originality'
  | 'privacy'
  | 'disclosure'
  | 'cheating'
  | 'bias'
  | 'professionalism'

export const LINE_REASON_LABELS: Record<LineReason, string> = {
  originality: 'Originality / authorship',
  privacy: 'Privacy / data sensitivity',
  disclosure: 'Disclosure / transparency',
  cheating: 'Academic honesty',
  bias: 'Bias / fairness',
  professionalism: 'Professional norms',
}

export type LineScenario = {
  id: string
  text: string
  spectrum: Spectrum
  validReasons: LineReason[]
}

export const LINE_SCENARIOS: LineScenario[] = [
  {
    id: 'own-notes',
    text: 'Use AI to summarize lecture notes you wrote yourself, for your eyes only.',
    spectrum: 'green',
    validReasons: ['professionalism', 'disclosure'],
  },
  {
    id: 'classmate-paper',
    text: 'Paste a classmate’s paper into AI to “improve” it without their permission.',
    spectrum: 'red',
    validReasons: ['privacy', 'cheating', 'originality'],
  },
  {
    id: 'scholarship-no-edit',
    text: 'Use AI to draft a scholarship essay you never revise in your own words.',
    spectrum: 'red',
    validReasons: ['originality', 'cheating', 'disclosure'],
  },
  {
    id: 'student-pii',
    text: 'Upload a spreadsheet of students’ names, IDs, and grades to a consumer chatbot.',
    spectrum: 'red',
    validReasons: ['privacy', 'professionalism'],
  },
  {
    id: 'resume-feedback',
    text: 'Get feedback on a resume you wrote yourself—facts stay yours, AI comments on clarity.',
    spectrum: 'green',
    validReasons: ['professionalism', 'disclosure'],
  },
  {
    id: 'interview-answers',
    text: 'Use AI to generate verbatim answers you plan to speak in a live interview without disclosure.',
    spectrum: 'yellow',
    validReasons: ['disclosure', 'professionalism', 'originality'],
  },
  {
    id: 'biased-hiring',
    text: 'Ask AI to rank candidates by “culture fit” using names and photos from their LinkedIn.',
    spectrum: 'red',
    validReasons: ['bias', 'privacy', 'professionalism'],
  },
  {
    id: 'group-project-split',
    text: 'Your team agrees AI may outline sections, but each member writes their own paragraphs.',
    spectrum: 'yellow',
    validReasons: ['disclosure', 'originality', 'professionalism'],
  },
]
