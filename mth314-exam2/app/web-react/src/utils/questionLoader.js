const TRUE_FALSE_CHOICES = ['True', 'False']

export const normalizeQuestion = raw => {
  if (!raw) return null

  const choices = Array.isArray(raw.choices)
    ? [...raw.choices]
    : Array.isArray(raw.options)
      ? [...raw.options]
      : raw.type === 'tf'
        ? [...TRUE_FALSE_CHOICES]
        : []

  return {
    id:
      raw.id ??
      `${raw.video_id || 'unknown'}-${raw.question?.slice?.(0, 16)?.trim() ?? 'question'}`,
    module: raw.module?.toString?.() ?? '',
    video_id: raw.video_id ?? null,
    type: raw.type ?? (choices.length === 2 ? 'tf' : 'mcq'),
    question: raw.question ?? '',
    choices,
    answer_index: typeof raw.answer_index === 'number' ? raw.answer_index : 0,
    explanation: raw.explanation ?? '',
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    assets: raw.assets ?? {},
  }
}

export const parseLectures = resources => {
  if (!resources) return []

  return Object.values(resources)
    .map(item => ({
      video_id: item.video_id,
      module: item.module?.toString?.() ?? '',
      topic: item.topic ?? '',
      title: item.title ?? item.video_id,
      url: item.url ?? '',
      date: item.date ?? '',
    }))
    .filter(item => item.video_id)
    .sort((a, b) => {
      const moduleDiff = (parseInt(a.module) || 0) - (parseInt(b.module) || 0)
      if (moduleDiff !== 0) return moduleDiff
      return a.title.localeCompare(b.title)
    })
}

export const parseQuestionsFromJsonl = jsonl =>
  jsonl
    .split('\n')
    .filter(Boolean)
    .map(line => {
      try {
        return JSON.parse(line)
      } catch {
        return null
      }
    })
    .filter(Boolean)
    .map(normalizeQuestion)
    .filter(Boolean)

export const loadQuestionsFromJsonl = async url => {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to load question bank from ${url}`)
  const text = await response.text()
  return parseQuestionsFromJsonl(text)
}


