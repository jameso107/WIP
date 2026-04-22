/** Rule-based “guide bot” — nudges thinking instead of doing graded work. */

export function getGuideReply(userText: string): string {
  const t = userText.trim()
  const lower = t.toLowerCase()

  if (t.length < 3) {
    return 'Say a bit more—what class or project is this for, and where are you stuck after trying yourself?'
  }

  if (/(write my|do my homework|full essay|complete (the )?assignment|give me the answer)/.test(lower)) {
    return (
      'I will not produce graded work for you—that pattern is exactly what makes AI replace your thinking. ' +
      'What is your one-sentence claim or hypothesis right now, even if it is rough? If you do not have one, what evidence stuck with you from your reading?'
    )
  }

  if (/(outline|brainstorm|structure|rubric|checklist|organize my notes)/.test(lower)) {
    return (
      'That is a strong way to use AI: shaping ideas after you have engaged with the material. ' +
      'List two constraints your teacher cares about (length, sources, stance). What part of the outline feels weakest to you?'
    )
  }

  if (/(is this true|fact check|hallucination|wrong|biased)/.test(lower)) {
    return (
      'Good instinct to verify. Before trusting an answer: can you cross-check with a primary source, syllabus, or textbook index? ' +
      'What claim are you unsure about—quote it in one line.'
    )
  }

  if (/(snapchat|cheat|without reading|teacher won't know)/.test(lower)) {
    return (
      'Using AI to hide that you did not do the reading usually backfires—and it skips the skill you are supposed to build. ' +
      'What is the smallest honest step you could take in the next 15 minutes (skim intro, read one section, jot three bullets)?'
    )
  }

  if (/(prompt|how do i ask)/.test(lower)) {
    return (
      'Strong prompts name role, goal, format, and limits. Try: “I am in [class]. I already [what you did]. Help me [outline/brainstorm], not [full draft].” ' +
      'What is the task in one line?'
    )
  }

  return (
    'Before I go further: what have you already tried on your own—even messy notes count? ' +
    'Then say what kind of help you want (outline, definitions, practice questions)—not the final turned-in artifact.'
  )
}
