export type HunterTag =
  | 'unsupported'
  | 'likely_hallucination'
  | 'biased'
  | 'missing_source'
  | 'incomplete_reasoning'

export const HUNTER_TAG_LABELS: Record<HunterTag, string> = {
  unsupported: 'Unsupported / needs evidence',
  likely_hallucination: 'Likely hallucination',
  biased: 'Biased or loaded wording',
  missing_source: 'Missing source',
  incomplete_reasoning: 'Incomplete reasoning',
}

export type HunterLine = {
  id: string
  text: string
  /** Ground-truth tags for this line (player needs ≥1 match per line for credit) */
  truth: HunterTag[]
}

export type HunterMission = {
  id: string
  title: string
  intro: string
  lines: HunterLine[]
}

export const HUNTER_MISSIONS: HunterMission[] = [
  {
    id: 'water-on-mars',
    title: 'Mission: Climate memo',
    intro: 'A model drafted this internal memo. Some lines are shaky. Tag what is suspicious.',
    lines: [
      {
        id: 'l1',
        text: 'Our Q3 sales grew 12% year over year according to the finance dashboard.',
        truth: [],
      },
      {
        id: 'l2',
        text: 'Smith et al. (2018) famously proved that drinking 4L water daily reverses aging in adults.',
        truth: ['likely_hallucination', 'unsupported'],
      },
      {
        id: 'l3',
        text: 'Lazy people clearly prefer remote work, so we should end hybrid policies entirely.',
        truth: ['biased', 'incomplete_reasoning'],
      },
      {
        id: 'l4',
        text: 'The new carbon rule will bankrupt every small business by next Tuesday.',
        truth: ['unsupported', 'incomplete_reasoning'],
      },
      {
        id: 'l5',
        text: 'See internal wiki page “FY24 emissions methodology” for how we calculated offsets.',
        truth: [],
      },
      {
        id: 'l6',
        text: 'We should cite that wiki page by name in the client deck, but the link is behind SSO.',
        truth: ['missing_source'],
      },
    ],
  },
  {
    id: 'study-tips',
    title: 'Mission: Study tips blog',
    intro: 'A draft post for students. Flag weak or risky claims.',
    lines: [
      { id: 'b1', text: 'Start studying at least one hour before the exam for best results.', truth: [] },
      {
        id: 'b2',
        text: 'Harvard (2020) recommends never sleeping before finals so your brain stays “warmed up.”',
        truth: ['likely_hallucination', 'unsupported'],
      },
      {
        id: 'b3',
        text: 'Students who struggle are usually not trying hard enough compared to top performers.',
        truth: ['biased', 'incomplete_reasoning'],
      },
      {
        id: 'b4',
        text: 'This technique raised GPAs by 1.5 points on average.', truth: ['unsupported'] },
      {
        id: 'b5',
        text: 'Check your syllabus for the instructor’s preferred citation style.',
        truth: [],
      },
    ],
  },
]
